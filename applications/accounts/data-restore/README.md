# Accounts data restore

Recovery runbook for the accounts application table (`accounts-<stage>-application`). The tool replaces every item in the application table with the items from a source table, normally a point-in-time recovery copy of the same table.

Use it only when the application table's data must be rolled back as a whole, for example after corruption or a bad migration. It deletes every item in the target table first, so anything written after the recovery point is lost.

The stack is deployed by hand. It is deliberately outside the delivery catalog.

## How it works

The table's stream consumers (the Lambda event source mappings in `accounts-data` and `accounts-api`) must not see the restore. Deleting items would make the attachments consumer delete files from S3, and re-inserting items would make other consumers apply changes that the restored data already contains.

The `data-restore` function takes one action per invocation:

| Action    | What it does                                                                                                                                                                                                           |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `restore` | Disables every event source mapping on the target table's stream and waits until they are all `Disabled`. Then it deletes every item in the target table and copies every item from the source table.                  |
| `resume`  | Waits two minutes, then enables every mapping with a maximum record age of 60 seconds. Lambda resumes each mapping from its last checkpoint and discards the restore's records because they are older than 60 seconds. |
| `release` | Sets every mapping's maximum record age back to the default (`-1`, no limit). It refuses to run unless every mapping is `Enabled`.                                                                                     |

The table's stream is never touched, so its ARN and the `<stage>-AccountsApplicationTableStreamArn` export stay valid.

The restore runs in a single Lambda invocation, so it must finish within the 15-minute timeout. This assumes the application table is small enough to clear and copy in that time. If it times out, the consumers stay paused and `restore` can be run again from the start.

## Before you start

- Make sure nobody uses the application in the stage being restored. Any write made between `restore` and `resume` is lost, and consumers never see it.
- Freeze deployments of `accounts-data` and `accounts-api` to that stage until `release` has been checked. A deployment can re-enable a paused mapping or reset its settings.
- Configure AWS credentials for the stage's account and region (the services deploy to `eu-west-1` by default). The account and region must be CDK bootstrapped.
- Run `yarn install` from the repository root.

The commands below use these shell variables:

```sh
STAGE=<stage>
TARGET=accounts-$STAGE-application
SOURCE=accounts-$STAGE-application-recovery
```

## 1. Create the source table

Point-in-time recovery is enabled on the application table. Restore it into a new table at the last moment the data was good:

```sh
aws dynamodb restore-table-to-point-in-time \
  --source-table-name "$TARGET" \
  --target-table-name "$SOURCE" \
  --restore-date-time <ISO-8601 time>
aws dynamodb wait table-exists --table-name "$SOURCE"
```

Use `--use-latest-restorable-time` instead of `--restore-date-time` to restore to the latest possible point.

## 2. Deploy the restore stack

From `applications/accounts/data-restore`:

```sh
yarn cdk deploy -c source="$SOURCE" -c target="$TARGET"
```

Synthesis fails if either table name is missing.

## 3. Restore

```sh
aws lambda invoke --function-name data-restore \
  --cli-binary-format raw-in-base64-out --cli-read-timeout 0 \
  --payload '{"action":"restore"}' restore.json
```

The response must not contain `FunctionError`. If it does, check the function's logs, fix the cause and run `restore` again. Do not continue to `resume` until `restore` has succeeded. `resume` permanently skips everything written while the consumers were paused.

Record the time you start `resume`; you need it in step 6.

## 4. Resume the consumers

```sh
aws lambda invoke --function-name data-restore \
  --cli-binary-format raw-in-base64-out --cli-read-timeout 0 \
  --payload '{"action":"resume"}' resume.json
```

Wait at least five minutes so every mapping can read past the restore's records before you release them.

## 5. Release the consumers (mandatory)

Do not skip this step. Until it runs, every consumer silently discards any record older than 60 seconds, including records delayed by retries in normal operation.

```sh
aws lambda invoke --function-name data-restore \
  --cli-binary-format raw-in-base64-out --cli-read-timeout 0 \
  --payload '{"action":"release"}' release.json
```

Then check every mapping:

```sh
aws lambda list-event-source-mappings \
  --event-source-arn "$(aws dynamodb describe-table --table-name "$TARGET" --query Table.LatestStreamArn --output text)" \
  --query 'EventSourceMappings[].[FunctionArn,State,MaximumRecordAgeInSeconds,DestinationConfig.OnFailure.Destination]' \
  --output table
```

Every row must show `Enabled` and `-1`. Do not lift the deployment freeze until it does.

## 6. Clear the stream failure stores

Lambda delivers each batch it discards in step 4 to that mapping's on-failure destination. These are listed in the last column of the check above, for example `accounts-<stage>-schedule-sync-failures-<account id>`. Each failure bucket feeds a dead-letter queue whose alarm reports to Sentry, so expect those alarms after a restore.

For every failure destination:

- Delete the objects written from the start of `resume` onwards.
- Delete the matching messages from the dead-letter queue the bucket feeds, for example `accounts-<stage>-schedule-synchronisation-dlq`.

Never replay these failures. They are the restore's own changes; replaying them would re-apply its deletes, for example removing attachments, and double-count balances.

## 7. Check the result

- Compare item counts. Run `aws dynamodb scan --table-name <table> --select COUNT` on both tables and sum the `Count` values across pages.
- Spot-check data in the application.
- Scheduled transactions: EventBridge Scheduler schedules in `accounts-<stage>-scheduled-transactions` are not part of the table and are not restored. Compare them with the restored pending scheduled transactions, then recreate any missing schedules and delete any for transactions that no longer exist.
- Attachments: files deleted from S3 after the recovery point stay deleted. Check that the restored attachments still have their files.

## 8. Clean up

```sh
yarn cdk destroy -c source="$SOURCE" -c target="$TARGET"
aws dynamodb delete-table --table-name "$SOURCE"
```

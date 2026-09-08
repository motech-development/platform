# Code style for agents

Use the shared rules and the section for the affected app or package together.
Explicit task instructions, `AGENTS.md`, workspace configuration, and public API
contracts take precedence. Examples illustrate code shape; adapt their names and
behavior to the task. They are not new dependencies or abstractions to introduce.

## File and module structure

Keep a module focused on a recognizable responsibility: one UI component, one
handler, a set of related operations, or a framework adapter. Follow the local
layout rather than introducing `services`, `repositories`, or other layers for
consistency alone.

Within a module, group imports first, then supporting types, constants or schemas,
implementation, and public exports. Put helpers before the code that uses them
where that makes the main operation easier to read. Keep related declarations
together; do not enforce a rigid ordering that splits a type from its helper.

- A single-purpose helper usually declares a named function or arrow constant and
  default-exports it at the bottom. Keep meaningful names in stack traces.
- Lambda entrypoints use a named `handler` export. Export related input contracts
  when other workflow steps or tests consume them.
- A module containing related operations uses named exports, such as `insert`,
  `remove`, and `update`. Do not add a wrapper class just to group these functions.
- Package barrels explicitly re-export public values and types. Add an export
  only when it belongs to the package API; keep implementation helpers private.
- Preserve CommonJS, ESM, and provider-specific entrypoint contracts. A plugin's
  `module.exports` and a React component's default export serve different callers.

A public barrel should make the supported API visible:

```ts
export { default as Button } from './Button/Button';
export type { IButtonProps } from './Button/Button';
```

Keep tests in the nearby `__tests__` directory. Match the local suffix: both
`name.test.ts` and plain `name.ts`/`Component.tsx` occur inside test directories.
Keep stories beside the component they demonstrate.

## Naming and formatting

| Construct                          | Convention                                                                |
| ---------------------------------- | ------------------------------------------------------------------------- |
| React component and component file | PascalCase, such as `CompanyForm.tsx`                                     |
| Backend handler or operation file  | Kebab-case, such as `signed-upload.ts`                                    |
| Hook and hook file                 | `use` plus camelCase, such as `useQueryString.ts`                         |
| Local value or function            | Descriptive camelCase; verbs for operations, nouns for results            |
| Interface                          | `I` plus PascalCase where established, such as `IEvent` or `IButtonProps` |
| Type alias                         | Match the neighboring contract; do not add a universal `T` prefix         |
| GraphQL operation constant         | Upper snake case, such as `ADD_COMPANY`                                   |
| Framework resource identifier      | Descriptive PascalCase; retain provider property casing                   |

Use two spaces, single-quoted JavaScript/TypeScript strings, semicolons, trailing
commas, and LF line endings as formatted by the workspace tools. Use the layout
conventions below when writing code, then let Prettier normalize it. Formatting
alone does not establish the intended grouping of declarations or operations.

Let the configured import sorter arrange imports and exports. Keep package imports
and relative imports recognizable, and use `node:` for Node built-ins where
supported by the affected module. Follow the configured object-key order, but
preserve meaningful order in arrays, spreads, report columns, and execution steps.

Use destructuring to name relevant input fields and shorthand for corresponding
output fields. Preserve wire-format names such as `TableName`, `__typename`, or
`family_name`; a local variable can use an alias such as
`family_name: familyName`. Do not rename external fields for cosmetic consistency.

### Object literals and destructuring

Write nonempty data and configuration objects across multiple lines, with one
property per line and a trailing comma. This applies to assigned objects, returned
objects, SDK command inputs, callback results, and objects passed as arguments.
Use this layout even when the object would fit on one line; short return values
and single-option objects should remain easy to extend and scan.

```ts
const command = new GetObjectCommand({
  Bucket: bucket,
  Key: decodedKey,
});

return getSignedUrl(client, command, {
  expiresIn: expires,
});
```

Keep each nested object expanded at its own indentation level. Keep related
properties together without blank lines between ordinary properties. Use
shorthand when the property and local variable have the same name.

```ts
return {
  complete: false,
  count: items.length,
  current: 0,
  items,
};
```

An empty object stays `{}`, as in `new S3Client({})`. Destructuring is different
from constructing an object: short destructuring patterns stay inline, with
spaces inside the braces and after commas. Let longer patterns wrap normally.

```ts
const { id, owner } = event;

const { Items } = await documentClient.send(command);
```

Do not align property values, assignment operators, or variable names with padding
spaces. Use ordinary spacing and indentation. Let the formatter handle inline
type expressions and imports rather than treating every pair of braces as a
multiline object literal.

### Variable declarations and vertical spacing

Declare each variable with its own `const` or `let` statement rather than a
comma-separated declaration. Use a single blank line to separate declarations
that introduce different steps, especially an input conversion, command
construction, and command execution.

```ts
const decodedKey = decodeURIComponent(key);

const command = new GetObjectCommand({
  Bucket: bucket,
  Key: decodedKey,
});

const response = await client.send(command);

if (response.Body instanceof Readable) {
  return response.Body;
}

throw new Error('Unable to stream file');
```

Closely related declarations can remain adjacent. For example, a local path and
the stream created from that path form one setup group; obtaining the remote
stream starts the next step:

```ts
const filePath = join(to, basename(key));
const fileStream = createWriteStream(filePath);

const stream = await downloadFileStream(bucket, key, client);
```

Apply the same grouping to React setup: related hooks may sit together; separate
a substantial callback or derived block from the next declaration. Do not insert
a blank line between every variable mechanically, or compress a whole function's
declarations into one uninterrupted block.

- Leave a blank line after input destructuring before a guard or a separate
  operation, and between independent guard clauses.
- Leave a blank line between a completed multiline declaration and the statement
  that consumes it, and before the final return following setup or effects.
- Separate sibling functions, interfaces, type aliases, and class methods with a
  blank line. Keep interface members and object properties contiguous.
- Keep a short block's first statement directly after its opening brace and its
  closing brace directly after its last statement; do not pad blocks internally.
- Use one blank line between groups, not repeated blank lines or decorative
  separator comments. In tests, separate fixture changes, the action, and the
  assertions in the same way.

## Types and contracts

Define types where the contract is owned. A component's props belong beside the
component; reusable request/result types belong in the package's existing type
module. Reuse AWS, React, Apollo, and other library contracts instead of inventing
parallel versions. Narrow an external interface with `Pick` when only a few
members are needed by an adapter.

- Give public utilities explicit parameter and result types, including
  `Promise<Result>` for asynchronous operations. Allow clear local and JSX return
  types to be inferred; do not annotate every expression.
- Model optional values as optional. Default optional component options in the
  destructured signature rather than repeating fallback expressions in JSX.
- Use unions when callers provide alternative shapes. Narrow by a discriminator
  or property check before reading fields specific to one variant.
- Keep response data, request bodies, and error payloads as separate generic
  parameters where they represent different contracts. Use `unknown` for
  unconstrained data instead of allowing `any` to propagate.
- Derive form value types with `typeof` when the initial-value object is the
  established source of the form shape. Keep runtime validation separate.
- Use type predicates to narrow collections. A predicate must check the fields
  its result promises; do not use an assertion to conceal missing validation.

For example, a stream predicate checks both the event kind and the required image:

```ts
interface IInsertRecord {
  eventName: 'INSERT';
  dynamodb: {
    NewImage: Record<string, AttributeValue>;
  };
}

const isInsertRecord = (record: DynamoDBRecord): record is IInsertRecord => {
  if (record.eventName === 'INSERT') {
    return !!record.dynamodb?.NewImage;
  }

  return false;
};
```

The AWS types above come from the affected event module. Parsing JSON or
unmarshalling database data does not by itself validate a domain object; keep
validation and any necessary boundary assertion explicit.

## Function bodies and asynchronous work

Start with input extraction and guards, then name transformed values, perform the
operation, and return its result. Prefer early returns for invalid or empty states
over nesting the whole function inside a success condition. Keep a short inline
callback when it expresses one transformation; extract a helper when it has a
separate responsibility or is already shared by multiple callers.

Use `filter` and `map` for collection selection and transformation. Copy an input
array before sorting when the caller or cache owns it. Construct optional fields
with conditional spreads when that keeps the output shape clear. Avoid mutation
hidden inside a transformation callback.

Use `async`/`await` for sequential operations. Collect independent promises and
await them together only when concurrency and failure behavior are appropriate.
Distinguish an array of promises from a promise of results in return types and
caller code; the caller must own completion, not leave work unawaited.

For AWS operations, keep command construction separate from execution so the
request is readable and directly testable:

```ts
const command = new PutCommand({
  Item: notification,
  TableName,
});

await client.send(command);
```

Reuse a module-level client where the workspace already does so. Where a utility
accepts an injected client, pass that same client through nested operations.

Narrow caught values with `error instanceof Error` before using Error properties.
Keep error translation at the existing transport or workflow boundary. Do not
introduce empty catches or classify every infrastructure failure as invalid user
input merely to match nearby syntax. Error propagation and retry behavior must
satisfy the operation's contract.

## React components, forms, and data

App clients, Auth, and Apollo use named function components with default exports.
Breeze UI uses typed `FC` arrow components. Preserve this distinction; a shared
style guide does not require a component syntax migration.

App component shape:

```tsx
export interface IConnectedProps {
  children: ReactNode;
  loading: boolean;
}

function Connected({ children, loading }: IConnectedProps) {
  if (loading) {
    return <Loader />;
  }

  return <div>{children}</div>;
}

export default Connected;
```

Keep hooks at the top level. Put state, data hooks, and event callbacks before the
returned JSX. Keep loading, error, and ready states explicit, using the established
wrapper where one exists. UI callbacks should express the user action; move
multi-step reusable transformations out of JSX props.

- Use `onSave`, `onSubmit`, and similar `on…` props to expose events to the parent.
  Keep request execution and navigation with the page that owns the operation.
- Compose existing field groups and UI primitives. Do not rebuild labels,
  validation messages, loading controls, or toast containers inside each page.
- Keep initial values, form value types, and Yup validation aligned. Translate
  visible labels and validation messages through the component's namespace.
- Destructure form state in render callbacks. Connect submission and disabled or
  loading presentation explicitly to that state.
- Keep GraphQL documents named and near the consuming page. Use the existing
  generated operation contracts; do not edit generated files or replace their
  types with hand-maintained duplicates.
- Keep cache updates immutable. Identify records by their cache identity and
  domain ID; avoid duplicate insertion and preserve meaningful list order.
- Use multiline JSX props when formatted that way, boolean shorthand for true
  props, and straightforward conditional rendering. Separate major sibling
  sections with blank lines.

Build conditional validation from the same field shape as the form. For example,
the identity form adds name validation only when those fields are displayed:

```ts
const validationSchema = object<FormSchema>()
  .shape({
    ...(name
      ? {
          userMetadata: object()
            .shape({
              family_name: string().required(t('family-name.required')),
              given_name: string().required(t('given-name.required')),
            })
            .required(),
        }
      : {}),
    password: string().required(t('password.required')),
    username: string()
      .email(t('username.invalid'))
      .required(t('username.required')),
  })
  .required();
```

Use the affected workspace's supported Yup syntax. The convention is the aligned
form shape, conditional fields, and translated messages, not a library upgrade.

In Breeze UI, define styled primitives before the exported component. Use
transient `$` props for styling-only state and compose base components instead of
copying their styles. Keep public props distinct from the private styling props.

## Tests

Organize tests around the subject and observable scenarios. Set up the common
valid fixture once per test; change only the fields relevant to a scenario. Keep
setup, action, and assertions visibly separate.

```ts
describe('signed-upload', () => {
  describe('when the request body is missing', () => {
    it('should return an error response', async () => {
      event.body = null;

      await handler(event, context, callback);

      expect(callback).toHaveBeenCalledWith(null, {
        body: JSON.stringify({
          message: 'No body found',
          statusCode: 400,
        }),
        statusCode: 400,
      });
    });
  });
});
```

Here `event`, `context`, and `callback` come from the suite's normal setup. Keep
that setup local and typed instead of constructing a general fixture framework
for a single test.

- Handler tests assert returned workflow state, HTTP responses, or the meaningful
  SDK command payload. Include missing configuration, invalid input, and relevant
  success/failure branches when the behavior changes.
- Use the existing AWS client mock tools for SDK boundaries. Avoid tests that
  merely assert a helper was called when the returned result can be checked.
- Restore changes to `process.env`, timers, and other shared state in teardown.
  Reset mocks between scenarios so test order cannot determine results.
- Prefer partial mocks for external modules and Node built-ins. Keep real exports
  that the code under test and its transitive dependencies still need.
- UI tests compose the existing test provider, router, and Apollo mocks as needed.
  Find controls by label or role, perform user actions, and await resulting
  content, navigation, or notifications.
- Hook tests use the existing hook renderer and `act`/async assertions to observe
  state transitions and callbacks. Check success and failure state, not private
  helper names.
- Style assertions belong in UI primitive tests where a prop controls styling.
  Do not make ordinary page tests depend on incidental DOM structure or CSS.
- Keep tests focused on changed behavior. Follow `AGENTS.md` for targeted test
  commands and verification; do not run broad CI coverage suites by default.

## Applications

Apply each workspace's rules to that workspace; do not move implementation
patterns across apps just to make them uniform. Consult the repository's delivery
guidance before changing infrastructure or deployment configuration.

### `applications/accounts/api`

- Keep GraphQL schema files organized by domain noun, such as `transaction.graphql`, `company.graphql`, and `balance.graphql`. Use PascalCase type names, `<Entity>Input` input objects, camelCase fields, and explicit GraphQL nullability; collection results carry `items` and pagination metadata rather than exposing raw database responses.
- Keep resolver templates under `mapping-templates/<domain>/<operation>/`, pairing `<Query|Mutation|Pipeline>.<operation>.req.vtl` with `.res.vtl`. Establish named values with `#set` before constructing the request. Serialize values through AppSync utilities rather than interpolating raw request values into JSON.
- Keep the distinction between API input and stored metadata visible in request construction: identity, generated IDs, timestamps, and composite `data` keys are assembled separately from input fields. Preserve the neighboring resolver's authorization and conditional-write behavior when changing its shape.
- Separate stream entry points in `src/handlers` from GraphQL mutation helpers in `src/shared`. Handlers select and unmarshall records, project the fields needed downstream, and collect mutation promises; helpers own the GraphQL document, variables, credentials, and client call.
- Export GraphQL documents as named constants and export single-purpose helpers as default functions. Use small interfaces for helper inputs and explicit type predicates such as `isStreamModifyRecord` before accessing stream-specific properties.
- Test the handler boundary with representative stream images and mocked downstream operations. Verify which records produce calls and the values forwarded, including environment preconditions and failure paths; avoid making logging text the sole assertion for a changed mutation path.

### `applications/accounts/client`

- Organize routes as domain folders under `pages`, with `index.tsx` defining the local `Routes` and lazy imports of sibling pages. Use PascalCase page/component files and default-exported named functions. Keep feature-specific helpers in the feature folder and reusable UI under `components`.
- Make pages responsible for route parameters, queries/mutations, navigation, and toasts. Put reusable field layout and validation composition in form components. A form receives values, loading state, navigation destination, and a typed callback such as `onSave(value: FormSchema): void`; it should not need to know which mutation saves it.
- Use generated GraphQL types to describe API-derived values, including indexed types such as `GetCompanyQuery['getCompany']`. Define operation documents with the generated `gql` helper and export named operation constants beside their page. Keep generated files out of hand-written model changes.
- Keep Apollo cache updates in separately exported, typed updater functions when the page has nontrivial cache behavior. Identify the collection, use references and `readField`, guard absent mutation results or fragments, and construct new arrays when inserting or sorting; preserve the collection's deduplication and ordering behavior.
- Compose forms from Breeze UI `Form`, layout, and field components. Build Yup schemas from the shared `useAddress`, `useBank`, and other schema hooks; use `.concat` and nested `.shape` for the form's structure. Derive validation messages, labels, success messages, and page titles from the appropriate translation namespace.
- Establish required route parameters with the existing `invariant` helper before passing them into operations. Destructure Apollo's error/loading state explicitly and pass it to the established `Connected`/form presentation boundary; keep completion navigation and toast handling together in the mutation completion callback.
- In page tests, combine `TestProvider` route context with Apollo `MockedProvider` and exact query/variable fixtures. Fill controls by label, activate buttons by role, and assert the resulting destination, notification, validation, or error state. Test exported cache updaters against an `InMemoryCache` separately from the interaction flow.

### `applications/accounts/data`

- Keep stream entry points at `src/<domain>.ts`, operation-specific processing in `src/handlers`, and shared record/balance logic in `src/shared`. The entry point dispatches the event; it should not duplicate the arithmetic or DynamoDB expressions already owned by a helper.
- Use the shared `extractStream` result to separate inserts, updates, and removals. Keep processing functions explicit about their inputs: the DynamoDB client, table name, and record array are parameters, while the entry point creates the client and reads configuration.
- Preserve the helper convention of returning arrays of AWS command promises where the caller combines independent operations with `Promise.all`. Annotate those arrays with the appropriate SDK output type so callers can see that work has been started and must be awaited.
- Use typed unmarshalling helpers and domain interfaces such as `ITransaction`; express selection with `filter` followed by `map`. Keep old and new images named `OldImage` and `NewImage` at the stream boundary so transition logic remains easy to inspect.
- Centralize balance updates and transaction-status handling in the existing shared modules. When changing a transition, show its old/new values explicitly rather than hiding differences behind a generic record patch; the generated update expression is part of the behavior to preserve.
- Build regression fixtures with actual DynamoDB attribute shapes (`S`, `N`, and image objects). Assert SDK command contents and counts across relevant old/new status, amount, category, and date combinations; freeze the clock when timestamps contribute to those commands.

### `applications/accounts/data-restore`

- Keep the deployment entry point in `bin`, the CDK stack in `lib`, and restoration runtime in `src`. The stack uses a named `Stack` subclass with a small configuration interface and private methods for related resource construction.
- Keep source/target configuration distinct from CDK `StackProps`. Store configuration as readonly fields, import the relevant tables in a dedicated method, then wire the function's environment and grants where the function is created.
- Structure the runtime as named operations such as `clear`, `restore`, and `streams`, with the exported handler showing their sequence. Use parameters for the table each operation targets rather than repeatedly rediscovering configuration inside every helper.
- Keep AWS request construction adjacent to each `client.send` call. Use the low-level DynamoDB command types consistently with explicit marshalling/unmarshalling; do not mix document-client object shapes into low-level requests.
- Use local helpers for batching and the paired stream operations. Keep progress messages attached to the phase or batch they describe, and preserve operational sequencing and error behavior as functional concerns rather than changing them during a style cleanup.
- Test runtime operations through mocked SDK commands and keep stack synthesis checks under `lib/__tests__`. Review the synthesized template when resource wiring changes; a snapshot update should reflect an intentional infrastructure change.

### `applications/accounts/infrastructure`

- Keep this workspace declarative: resource definitions belong in `serverless.yml` under `resources.Resources`, with provider settings, plugins, and shared deployment values in their existing sections.
- Put reusable naming inputs in `custom`, and compose resource names from those values. Use CloudFormation references and attributes (`!Ref`, `!GetAtt`, `!ImportValue`) for resource relationships instead of duplicating resolved IDs or addresses.
- Give logical resources descriptive PascalCase names such as `BucketPolicy` and `CloudFrontDistribution`. Keep policy statements with the resource they protect and express actions/resources as YAML lists even when there is one entry.
- Preserve the distinction between Serverless interpolation and CloudFormation evaluation. Follow neighboring examples for joins and cross-stack imports; verify the resolved resource graph rather than treating a YAML-format check as sufficient validation for a structural change.

### `applications/accounts/notifications`

- Keep notification creation as a narrow handler built with the shared `apiGatewayHandler`, `paramCheck`, and `response` utilities. Use the wrapper's response contract instead of manually rebuilding API Gateway envelopes.
- Declare the reusable AWS client and Yup schema outside the request callback. Inside the callback, resolve required configuration and body, parse the JSON as `unknown`, then validate before destructuring trusted input.
- Describe accepted input fields in the schema and use `stripUnknown` at validation. Build the persisted notification object explicitly so generated IDs, timestamps, ownership/index fields, and default state remain visible next to the `PutCommand`.
- Keep request validation and response construction together. Preserve the existing status/body contract when changing fields, and distinguish a requested behavior change from a stylistic refactor of the handler.
- Test the exported wrapped handler with an API Gateway event and callback. Assert both the returned HTTP shape and the `PutCommand` item; use stable UUID and clock values, and restore environment changes after each test.

### `applications/accounts/queue`

- Keep state-machine steps in `src/handlers`, event initiators in `src/triggers`, and collection utilities in `src/shared`. Name files for their action, such as `get-records` and `delete-records`, rather than putting the whole workflow in one handler.
- Export the step's `IEvent` interface and type its entry point with `Handler<IEvent>`. Destructure required environment values near the start and use explicit guard clauses before constructing AWS commands.
- Build DynamoDB expressions as separate `ExpressionAttributeNames`, `ExpressionAttributeValues`, and condition/query strings. Keep owner and entity selection visible in the command so authorization filters cannot disappear in a generic deletion helper.
- Narrow queried items with a type predicate before extracting IDs. Use the existing chunk helper for batches and return plain workflow state objects such as `complete`, `count`, `current`, and `items`; these fields are the handoff to the next step.
- Organize tests by configuration and result scenarios with nested `describe` blocks. Verify empty-result completion, populated-result state, and exact query/delete command inputs; snapshot and restore environment values in the scopes that change them.

### `applications/accounts/reports`

- Model the report workflow as one action per handler, such as retrieving transactions, transforming rows, converting CSV, creating the archive, and issuing the download link. Keep formatting/archive helpers in `src/shared` instead of expanding each step with duplicate utility code.
- Export each step's `IEvent` contract and use `Handler<IEvent, IOutput>` where output is known. Reuse the next step's input as `IOutput` when that is the actual handoff, so changes to workflow payloads are checked across both steps.
- Validate external step input with a module-level Yup schema before transformation. Use named intermediate values (`result`, `sorted`, `csv`, `attachments`) to separate validation, ordering, row formatting, and asset mapping.
- Copy collections before sorting. Use a type predicate for optional attachments before accessing attachment-only fields; build attachment keys and archive paths through the existing path/slug utilities and date formatting through Luxon.
- Construct report rows explicitly. Column labels and insertion order are output-format concerns, and dates, currency precision, and positive/negative amount placement should remain visible in the transformation instead of being generalized into an opaque serializer.
- Test complete output objects for representative input collections, including ordering, formatted values, and attachment paths. Keep AWS/storage/archiver calls mocked in the corresponding integration step so transformation tests remain focused on the exported report data.

### `applications/accounts/storage`

- Keep HTTP signing endpoints and S3/SQS event handlers as distinct modules under `src/handlers`. Use the shared API Gateway wrapper for HTTP and the appropriate AWS event handler type for background work.
- Define request schemas outside handlers. Parse JSON into `unknown`, then validate/normalize it before using values to construct object keys or metadata; keep optional nested metadata explicit in the schema.
- Reuse `@motech-development/s3-file-operations` for file operations and signing. Build keys, expiry values, content types, and metadata in the handler where the storage contract can be reviewed, rather than spreading raw input into an S3 request.
- Use conditional object spreads for optional metadata fields so absent fields are omitted deliberately. Keep key construction and the response projection separate; callers receive the intended response fields, not the whole validated request or AWS result.
- For record batches, map records to operations and await their combined promises. Check optional message attributes before using them, keeping the malformed/missing-attribute path visible alongside the operation.
- Test configuration and body failures, schema normalization, optional-metadata cases, and exact signing arguments. Invoke wrapped HTTP handlers through their callback contract and background handlers through their promise contract; preserve unmocked exports when adding package mocks.

### `applications/accounts/web`

Use the shared naming, typing, module, and testing rules with this workspace's
own tooling and contracts. No additional app-specific conventions are prescribed;
do not assume the Accounts client determines this app's component or data layer.

### `applications/core/anti-virus`

- Keep Lambda entrypoints in kebab-case modules under `src/handlers` and shared operations under `src/shared`. Export the entrypoint as `handler`, with its AWS event type and a local `IEvent` when the payload needs an explicit contract.
- Destructure event inputs into named locals and assemble result objects with shorthand fields. Keep intermediate values descriptive, as in `downloadsDir`, `downloadedFile` and `definitions`.
- When coordinating several asynchronous operations, name the promises or mapped collection before awaiting them together. Keep the sequence of preparation, execution and returned result visually distinct with blank lines.
- Expose process operations through small named helpers with explicit return types. Keep path preparation and argument-array construction inside the relevant helper.
- Place tests in adjacent `__tests__` directories using the source basename. Group shared-helper tests by exported operation and handler tests by scenario; build fresh event, context and callback fixtures in setup.

### `applications/core/comms`

- Keep the custom-resource contract, validation schema and entrypoint together in the single-purpose module. Place the local `IEvent` above the module-level schema.
- Preserve external field casing in boundary objects, including `Domain`, `DMARC`, `TTL` and `Route53RecordSets`; use named locals for derived identifiers.
- Use block-scoped `switch` cases for lifecycle branches. Where cases share an implementation, place their labels together instead of repeating the branch.
- Construct response collections with named arrays, `map`, conditional spreads and object literals. Keep the provider response shape visible rather than obscuring it through unrelated abstractions.
- Narrow caught values before accessing error properties and express protocol response construction explicitly in the handler.
- Organize tests by input validity and lifecycle operation. Keep assertions about AWS command parameters separate from assertions about the resulting custom-resource response.

### `applications/core/infrastructure`

- Group the deployment definition into `service`, `provider`, `plugins`, `custom` and `resources`, with resource definitions under `resources.Resources`.
- Keep shared naming inputs in `custom` and use interpolation for derived names.
- Give resources semantic PascalCase identifiers such as `HostedZone` and `Certificate`; retain AWS-defined property casing.
- Separate complete resources with blank lines. Place each resource's `Type` before its `Properties` and indent nested lists consistently.
- Group exported values under `resources.Outputs`, with a description, value reference and export name for each shared output.

### `applications/id/client`

- Write components as named PascalCase functions with a default export at the bottom. Export `I<Component>Props` alongside the component, destructure props in the signature and put defaults there.
- Keep page-level view selection, individual views and shared form rendering in their existing directories. Put reusable SDK setup and error interpretation in hooks or utilities.
- Pass callbacks and presentation state through explicit props. Keep operation-specific callbacks near their view and shared form controls in the shared component.
- When the form type matches its initial values, derive it with `typeof` rather than repeating the shape. Keep validation fields aligned with those values and use conditional object spread for optional validation sections.
- Resolve display copy through named translation namespaces. Compose existing Breeze UI components, expand longer JSX prop lists across lines and separate major JSX siblings with blank lines.
- Test through the shared `TestProvider` and user interactions. Group scenarios with `describe('when ...')`, use label/role queries and await asynchronous state changes before assertions.

### `applications/id/emails`

- Keep message templates in Pug files that extend `layout.pug` and supply `block content`. Put shared document structure and style inclusion in the layout.
- Preserve snake_case template filenames that correspond to external template identifiers.
- Follow the existing table-based email structure, using shared named classes for typography, links and buttons. Keep message-specific content inside the layout's content block.
- Preserve Liquid expressions as literal template content. Use Pug text lines for conditional content and keep placeholders intact in attributes and body text.
- Keep shared CSS in `src/assets/styles.css`; use semantic lowercase names and the existing element/modifier forms such as `button__link` and `typography--lg-spacing`.
- Edit source templates and styles rather than compiled HTML output.

### `applications/id/infrastructure`

- Keep shared domain and stage-derived names in `custom`, then reference them from resources.
- Name resources by purpose, as in `BucketPolicy`, `CloudFrontDistribution` and `DnsRecord`.
- Express resource relationships through references and attributes rather than repeating literal identifiers.
- Keep policy statements as structured lists, with actions, principals and resources nested under the relevant statement.
- Keep distribution settings inside their named substructures, such as origins, cache behavior and certificate configuration.
- Separate logical resources with blank lines and retain AWS property casing. Follow the file's supported intrinsic syntax without rewriting unrelated shorthand or long-form references.

### `applications/id/tenant`

- Preserve each script's provider execution form: named callback-taking functions for rules and `module.exports` for hooks. Retain the existing CommonJS boundary in utilities and tests.
- Keep provider-specific dependency loading and globals within that boundary instead of making incidental module-system conversions.
- Rename external snake_case fields to camelCase when destructuring into local variables, while preserving provider field names in outgoing objects.
- Give update payloads explicit local names and use object spread to show how they extend existing objects. Keep construction, external calls and callback results visually distinct.
- Test rules through the existing `loadRule` helper, which supplies provider globals. Group cases around the relevant user state and assert external calls and callback results.
- For timestamp-dependent tests, use the existing clock-control setup and teardown pattern and explicit fixtures for absent and populated metadata.

## Shared packages

### `packages/api-gateway-handler`

- Keep serialization, expected errors, validation and the Lambda adapter in separate kebab-case modules, following `src/response.ts`, `src/error-response.ts`, `src/param-check.ts` and `src/api-gateway-handler.ts`.
- Use named local arrow functions followed by default exports for individual utilities. Keep the error class separate with explicitly typed public fields.
- Express the application handler as a local function type; keep callback adaptation inside the wrapper instead of mixing it into each application handler.
- Preserve generic body inputs and concrete serialized outputs. `response<T>` exposes a string body and numeric status, while `ErrorResponse<T>` reuses that serialization responsibility.
- Place tests in `src/__tests__`, name scenarios with `it('should …')`, and assert callback arguments at the adapter boundary.

### `packages/appsync-apollo`

- Group components and helpers by responsibility, with implementation and nested tests: `src/Apollo/Apollo.tsx` and `src/waitForApollo/waitForApollo.ts`.
- Use an exported props interface and a named function component with destructured arguments. Express renderable inputs as React node types and asynchronous callbacks with explicit Promise contracts.
- Keep client construction together and link composition visibly ordered: authentication, subscription handling, and variable cleanup each have a separate role. Use early render returns for missing configuration, loading, and unauthenticated states before returning the provider.
- Keep independent helpers small and explicitly typed, as with `waitForApollo(ms): Promise<void>`.
- Expose public values through named re-exports in `src/index.ts`; expose public interfaces separately with `export type`.

### `packages/auth`

- Keep route wrappers in flat PascalCase modules, using named function components and default exports.
- Represent alternative input shapes with separate interfaces and a union, as in `ProtectedRoute.tsx` and `ConditionalRoute.tsx`; narrow the union explicitly before reading variant-specific properties.
- Keep route rendering declarative and short, with guard branches followed by the alternative result.
- Keep authentication effects separate from render decisions. Name destructured authentication state clearly so guards remain readable.
- Keep `WithAuth.tsx` focused on its own wrapper contract, with explicit children, fallback and error callback props.

### `packages/axios-hooks`

- Keep related hooks as named exports in `src/axios-hooks.ts`, shared API contracts in `src/types.ts`, and transport helpers in `src/utils.ts`.
- Carry distinct data, body and error generic parameters through public signatures. Use `unknown` defaults and meaningful tuple aliases rather than flattening generic results to untyped objects.
- Preserve the distinction between automatic and explicit execution: `useGet` returns a result object; lazy and form hooks return `[execute, result]`. Keep tuple order explicit in `UseWithoutInput` and `UseWithInput`, with optional `data`/`error` and required `loading` in `IResults`.
- Separate request execution from hook orchestration with local helpers; small public method variants can delegate to the shared form-action hook.
- Destructure callback options away from transport options before constructing the request. Keep header merge order visible.
- Narrow unknown failures through a type predicate. Tests should exercise public hook results and execution behavior, with scenarios covering the relevant state changes.

### `packages/breeze-ui`

- Use `src/Component/Component.tsx`, nested component tests and adjacent stories where applicable. Keep shared hooks in `src/hooks` and curate public exports in `src/index.ts`.
- Compose named local layers instead of placing every concern in the public component. `Button` uses `BaseButton` and `Loader`; `TextBox` separates its styled input, adapter and form-facing implementation.
- Use exported `IComponentProps` interfaces and destructured defaults. Reuse platform attribute interfaces and express visual variants through unions or `keyof typeof` theme maps.
- Keep typed styles beside their component. Use the surrounding component's transient props or forwarding filter to distinguish styling inputs from DOM attributes.
- Reuse shared input wrappers, labels and validation hooks. Keep field identity and associated accessibility attributes visibly connected in the component markup.
- Test public visual and interaction states with component-local tests. Keep stories as named examples of the component API rather than alternate implementations.

### `packages/eslint-config-motech-base`

- Keep configuration declarative and organized into explicit language and file-scope groups.
- Scope test and tooling allowances to the files that need them; avoid broad production-rule changes to accommodate development files.
- Keep shared rule definitions centralized and sorting conventions machine-enforced. Follow the current configuration for exact rule names, module format and supported file patterns.

### `packages/eslint-config-motech-react`

- Reuse shared base rules instead of duplicating them in the React configuration.
- Keep React-specific settings distinct from shared language rules, with clear file scopes for tests, stories and tooling.
- Keep exceptions explicit and narrowly scoped. Follow the current tool configuration for syntax and exact rule behavior rather than reproducing a superseded configuration structure.

### `packages/ga-web-vitals`

- Keep the adapter in one small module, with an exported input interface, a named local function and a default export.
- Destructure the typed input and annotate the side-effecting function's `void` result.
- Keep outbound payload construction together. Test complete external-call arguments for the relevant input branches, as in `src/__tests__/ga-web-vitals.ts`.

### `packages/node-logger`

- Separate logger composition in `src/logger.ts` from transport options in `src/opts.ts`.
- Type configuration objects with the library's contract. Use uppercase names for shared protocol symbols and computed interface keys where those symbols define the payload.
- Keep environment defaults at the configuration boundary, using nullish fallback such as `LOG_LEVEL ?? 'info'`. Keep stderr and standard-output branches explicit; preserve callback completion in both paths.
- Keep configuration and transport tests separate, preserving this package's `.test.ts` naming convention.

### `packages/prettier-motech-config`

- Keep formatter settings declarative and centralized in `index.json`.
- Let the current formatter configuration determine quotes, commas, line endings and plugin-driven ordering; do not maintain competing manual rules.
- Keep the configuration concise rather than restating defaults without a repository-specific reason.

### `packages/query-string-hook`

- Keep one named hook per camelCase module, followed by a default export; expose the hooks through `src/index.ts`.
- Keep router integration small: `useQueryString` reads `search` from `useLocation` and returns `URLSearchParams`. Keep this separate from `useQs<T>`, which provides structured parsing and serialization.
- Keep structured parsing/serialization separate from router access. Use a generic interface for the returned `parse` and `stringify` functions.
- Use local literal unions and lookup objects for a closed set of keyword values rather than scattering comparisons.
- Test returned query values through the hook boundary and follow the local `use*.test.ts` filename convention.

### `packages/s3-file-operations`

- Keep related operations as named exports in the main kebab-case module, with meaningful explicit public return types.
- Use operation-specific local types and reuse SDK types, including indexed-access types, where they accurately express the accepted input.
- Construct SDK commands in named local variables before sending them. Preserve SDK field names while keeping application variables camelCase.
- Keep boundary conversions visible and close to the operation that needs them, including decoded keys, local paths and stream narrowing.
- Follow the existing optional client-parameter pattern when extending operations that support substitution, and preserve that parameter through composed calls.
- Group tests by operation and scenario; assert observable SDK commands and returned results rather than internal helper ordering.

### `packages/semantic-release`

- Preserve the package's surrounding module conventions and keep entry-point presets small and declarative.
- Centralize shared branches and plugin definitions in `src/utils.js`; express preset differences through small shared builders.
- Keep plugin arrays in meaningful execution order. Object sorting must not reorder those arrays.
- Separate preset-output tests from shared-helper tests, following the root `__tests__` and `src/__tests__` split.

### `packages/serverless-outputs-env`

- Keep the integration adapter as a default-export class with explicit private state and public lifecycle integration points.
- Describe the consumed external surface narrowly, as with `IServerlessInstance` built from `Pick<Serverless, 'cli' | 'getProvider'>` plus the custom configuration the plugin consumes.
- Expose lifecycle registration separately from processing. Keep instance binding clear where callbacks access private state.
- Separate validation, lookup, mapping and writing into named private methods, leaving the main processing method as readable orchestration.
- Keep collection transformations explicit: map provider outputs to configured names before serialization, then construct and await the write queue.

### `packages/webpack-conditional-plugin`

- Keep a small default-export class with typed private predicate and plugin fields.
- Define the predicate contract locally and reuse framework compiler/plugin types.
- Capture dependencies in the constructor; keep the public `apply(compiler): void` method short and focused on delegation.
- Test the public `apply` boundary for both condition branches using a minimal fake plugin.

### `packages/webpack-permissions-plugin`

- Keep options in a local interface, including the compiler-dependent folders callback.
- Store constructor options privately and expose a typed public `apply` integration method.
- Register a clearly named framework callback and delegate per-folder work to a private helper.
- Use an early guard before filesystem work, keeping enumeration and permission changes readable as separate operations.
- Place tests under `src/__tests__` and exercise registered-hook behavior through the plugin boundary.

### `packages/yarn-plugin-dedupe`

- Keep the existing plugin factory and name export shape in `index.js`.
- Resolve dependencies through the factory-provided loader and return lifecycle hooks from the factory.
- Use a named async lifecycle method and readable local flags for invocation state; keep the guard and conditional command sequence explicit.

### `packages/yarn-plugin-prepare`

- Follow the sibling Yarn plugin's export and factory conventions, resolving dependencies through the factory-provided loader.
- Keep the returned async lifecycle hook narrowly focused on preparation.
- Keep the module small; error-handling behavior should be justified by the hook's contract rather than adopted as a general coding-style rule.

## Before finishing a change

- Confirm the public input, output, export, and callback shapes still match callers.
- Check that external data is narrowed or validated at the appropriate boundary.
- Check that asynchronous work is awaited and injected dependencies survive
  composed calls.
- Check that pages, form components, handlers, and helpers retain their existing
  responsibilities rather than accumulating unrelated behavior.
- Verify the changed behavior through the affected suite and run the relevant
  formatting, lint, and type checks under `AGENTS.md` guidance.
- Inspect the diff for generated-file edits, incidental module conversions,
  unnecessary exports, and unrelated style changes.

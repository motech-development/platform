# Accounts frontend access logs

The production CloudFront distribution sends standard logging v2 access logs to
a dedicated S3 bucket using CloudWatch Logs delivery resources. The records are
JSON and include the request path, response status, timing, and CloudFront edge
result fields. They omit cookies, query strings, referrers, viewer IP addresses,
and user-agent values. Cookie logging remains disabled.

The bucket uses S3-managed encryption, blocks public access, and expires objects
after 14 days. Its bucket policy permits the log delivery service to write only
to `AWSLogs/<account-id>/CloudFront/`, conditioned on this account and this
distribution's delivery source. The bucket is retained when the stack is removed
or the bucket is replaced. Stack teardown removes log delivery and its policy;
the retained bucket continues its 14-day lifecycle and must be deleted manually
after its remaining objects expire.

CloudFront standard logging v2 uses the CloudWatch Logs API in `us-east-1`.
Before deploying, ensure the deployment principal can manage CloudWatch Logs
deliveries, use `cloudfront:AllowVendedLogDeliveryForResource` on the
distribution, and read/update the destination bucket policy. AWS documents the
[logging setup](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/standard-logging.html),
[S3 delivery permissions and encryption](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AWS-logs-infrastructure-V2-S3.html),
and [bucket ownership controls](https://docs.aws.amazon.com/AmazonS3/latest/userguide/about-object-ownership.html).

After deployment, verify that logging is enabled in the CloudFront console and
that objects arrive in the bucket. Delivery can take several hours to become
reliable; deployment and template packaging alone do not verify log delivery.

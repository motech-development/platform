# Accounts prototype fit against the AppSync API

## Research question

For every data-bearing element of the Accounts prototype, which API operation and fields provide it, and is it Direct, Derived or Unsupported? Does `DESIGN.md`'s API Fit table and its Provable Figure Rule hold against the schema, and which elements must be cut?

This note resolves [Research: Fit between the Accounts prototype and the chosen API](https://github.com/motech-development/platform/issues/1654). The chosen API is the existing AppSync GraphQL API ([#1656](https://github.com/motech-development/platform/issues/1656)): the client calls it with the Auth0 access token, reads the Accounts Owner ID from the `https://motechdevelopment.co.uk/owner_id` claim, and passes it as `owner` on subscriptions. Resolvers read the same claim (`applications/accounts/api/serverless.yml:406`). It audits commit `4a928201497eb8e9aa935585837c372e1bd16495`.

## Short answer

The API supports almost all of the prototype. Every route, list, form and action maps to an existing, wired query, mutation or subscription; no new operation is needed. Four things must be cut: the attachment's file name, its file size, the "Used to match transactions" caption on the bank account, and any daily total on a day the client has not fully loaded. Four figures need a narrower scope or a completeness rule: the Overview's "no invoice or receipt" count, the pending and scheduled counts, and client-side filter results on Confirmed.

The main mismatch with `DESIGN.md` is the pending query. `DESIGN.md` says it "takes no `count` or `nextToken`" and so its counts are complete (`DESIGN.md:372`, `DESIGN.md:477`). The schema gives `getTransactions` `count` and `nextToken` for both statuses (`applications/accounts/api/schema/schema.graphql:38-43`), so pending counts are complete only once the client has followed `nextToken` to the end. The API Fit table also:

- marks several client-computed values as Direct
- lists input fields as the result of `requestUpload`
- says the reports list is never more than a day deep, which DynamoDB TTL does not guarantee

## Fit vocabulary

`DESIGN.md:465` defines Direct, Derived and Scoped but not Unsupported. This note uses:

- **Direct**: a returned field, shown as-is or only formatted (currency, date).
- **Derived**: computed in the client from returned fields, the device clock, or values visible on screen. The formula is given.
- **Unsupported**: no operation or field provides it.
- **Scoped** (a qualifier on Derived): true only of the rows the client has loaded.
- **Not API data**: held by the client or the identity provider, or shown only by the prototype; outside the fit question.

Domain terms follow `applications/accounts/GLOSSARY.md`: Accounts Owner ID (`:7-9`), Transaction Date (`:11-12`), Pending, Scheduled and Confirmed Transaction (`:14-25`), and Publish (`:21-22`).

Facts used throughout:

- Every query and mutation in the schema has a wired resolver (`applications/accounts/api/serverless.yml:56-258`). The bank-connection templates under `applications/accounts/api/mapping-templates/bank` are not wired, and the schema has only `BankDetails` (`applications/accounts/api/schema/bank.graphql:1-9`).
- Only Confirmed Transactions with a `companyId` change a `Balance` (`applications/accounts/api/src/shared/apply-balance.ts:17-22`).
- `getTransactions` sorts confirmed newest first and pending oldest first, on the `data` key `<owner>:<companyId>:<status>:<date>` (`applications/accounts/api/mapping-templates/transaction/getTransactions/Query.getTransactions.req.vtl:5`, `:31-35`; `applications/accounts/api/mapping-templates/transaction/addTransaction/Pipeline.addTransaction.req.vtl:11`).
- Empty strings are not stored on add and are removed on update, so an absent attachment reads back as `null` (`Pipeline.addTransaction.req.vtl:25-29`; `applications/accounts/api/mapping-templates/transaction/updateTransaction/Pipeline.updateTransaction.req.vtl:15-21`).
- `Transaction.attachment` is `<companyId>/<uploadId>.<extension>`, built by the client from the `requestUpload` result (`applications/accounts/client/src/pages/MyCompanies/Accounts/shared/UploadAttachment.tsx:72`; `applications/accounts/storage/src/handlers/signed-upload.ts:65`; `applications/accounts/data/src/handlers/update-attachments.ts:97-98`).
- The sign of `amount` gives direction; a sale is `category: "Sales"`; a refund flips the sign of `amount` and `vat` (`applications/accounts/client/src/components/TransactionForm.tsx:294-323`).

Prototype citations are to `.design/accounts/prototype.html`, shortened to `prototype:line`.

## Element-by-element fit

### Shell and menus

| Element | Operation | Fields | Fit | Notes |
| --- | --- | --- | --- | --- |
| Company selector name | `getCompanies(id: <Accounts Owner ID>)` | `items { id name }` | Direct | `prototype:2896-2900`. `id` must equal the Accounts Owner ID (`applications/accounts/api/mapping-templates/company/getCompanies/Query.getCompanies.res.vtl:8`). |
| Company initials tile | `getCompanies` | `name` | Derived | Initials of `name`. `prototype:2897`. |
| Company menu list | `getCompanies` | `items { id name }`, `nextToken` | Direct | Sorted by name (`applications/accounts/api/mapping-templates/company/createCompany/Pipeline.createCompany.req.vtl:39`). Paged (`schema.graphql:33`). `prototype:2797-2817`. |
| "Selected" badge | none | — | Derived | Client state: the current company id. `prototype:2807-2809`. |
| Avatar initials "MG" | none | — | Not API data | Comes from the Auth0 session, outside this API. `prototype:2904-2906`. |
| Unread dot and "N unread" accessible name | `getNotifications`, `onNotification(owner)` | `items { read }` | Derived, Scoped | `items.filter(!read).length` over the loaded page. `prototype:2889-2909`. |
| Notification rows | `getNotifications(id, count: 5)` | `items { id message createdAt read payload }` | Direct | Newest first (`applications/accounts/api/mapping-templates/notifications/getNotifications/Query.getNotifications.req.vtl:29`). No `nextToken` on the type (`applications/accounts/api/schema/notification.graphql:10-13`). The legacy client asks for five (`applications/accounts/client/src/pages/MyCompanies/UserNotifications.tsx:102`). `prototype:2830-2852`. |
| Notification text | `getNotifications` | `message` | Direct | A key resolved to copy. Producers: `applications/accounts/data/src/publish-transactions.ts:106`, `applications/accounts/data/src/handlers/update-attachments.ts:145`, `applications/accounts/reports/src/handlers/publish-notification.ts:63`. `prototype:715-720`. |
| Notification time | `getNotifications` | `createdAt` | Direct | `String!` (`notification.graphql:2`). "Today, 14:32" is a relative label derived from the clock. |
| Download on a report notification | `getNotifications` | `payload` | Direct | `qs.parse(payload).downloadUrl` (`publish-notification.ts:63-65`). The URL is signed for 86 400 s (`applications/accounts/reports/src/handlers/generate-download-link.ts:35`). `prototype:2846-2848`. |
| Mark all as read | `markAsRead(id, input: { ids })` | — | Direct | Sets `ttl` to now, so read notifications are deleted by TTL (`applications/accounts/api/mapping-templates/notifications/markAsRead/Mutation.markAsRead.req.vtl:2`, `:19`). A read row such as `prototype:744` is transient. |
| Appearance chips | none | — | Not API data | `localStorage` (`DESIGN.md:327`). |

### Overview

| Element | Operation | Fields | Fit | Notes |
| --- | --- | --- | --- | --- |
| Current balance | `getBalance(id)` | `balance currency` | Direct | Confirmed Transactions only. `prototype:1138-1140`. |
| Balance less VAT owed | `getBalance` | `balance vat { owed }` | Derived | `balance − vat.owed`; both are on screen. `prototype:1141-1143`. |
| VAT owed | `getBalance` | `vat { owed }` | Direct | Sales VAT plus `VAT payment` amounts; every other category goes to `paid` (`applications/accounts/api/src/shared/balance.ts:71-89`). `prototype:1144-1148`. |
| VAT scheme chip "Standard 20%" | `getSettings(id)` | `vat { scheme charge }` | Direct | `none` shows as "Not registered" (`applications/accounts/api/schema/vat-settings.graphql:1-5`). `prototype:550-554`. |
| "Needs you" count | none | — | Derived | The number of attention rows shown. `prototype:1151-1156`. |
| "N of the transactions below have no invoice or receipt" and names | `getTransactions(status: confirmed)` | `items { attachment name }` | Derived, Scoped | Loaded confirmed rows whose `attachment` is empty. As built, it counts `loadedConfirmed()` (`prototype:1033-1039`, `1086-1088`), but "below" shows only the first two day groups (`prototype:1078`). |
| "N scheduled transactions coming up", with "name ±amount on date" | `getTransactions(status: pending)` | `items { scheduled name amount date }`, `nextToken` | Derived | `items.filter(scheduled)`. Complete only when `nextToken` is null. `prototype:1109-1131`. |
| Recent activity rows | `getTransactions(status: confirmed, count)` | As on Money | Direct | `prototype:1078-1085`. |
| Recent activity day headings and totals | As on Money | As on Money | Derived | See Money. |
| Year end date | `getSettings` | `yearEnd { day month }` | Derived | The next `day`/`month` (zero-based) on or after today. `prototype:487-494`, `1166-1169`. |
| "N days away" | `getSettings` | `yearEnd` | Derived | Year end minus today, from the device clock. `prototype:501-503`. |
| "Financial year began" | `getSettings` | `yearEnd` | Derived | Year end plus one day, minus one year. `prototype:495-500`. |
| Recent reports: requested, expires, Download | `getReports(id, count)` | `items { createdAt ttl downloadUrl }` | Direct | Returned oldest first: there is no `scanIndexForward` (`applications/accounts/api/mapping-templates/reports/getReports/Query.getReports.req.vtl:6-36`). `ttl` is epoch seconds (`applications/accounts/api/schema/report.graphql:5`). `prototype:1176-1188`. |
| Empty state | `getTransactions` (both) | `items` | Derived | Both lists empty. `prototype:1065-1076`. |

### Money

| Element | Operation | Fields | Fit | Notes |
| --- | --- | --- | --- | --- |
| Confirmed / Pending toggle | `getTransactions(id, status)` | `status` | Direct | Two queries; `status` is required (`schema.graphql:38-43`). `prototype:1211-1219`. |
| Pending count badge | `getTransactions(status: pending)` | `items`, `nextToken` | Derived | `items.length`. Complete only when `nextToken` is null. `prototype:1198-1206`, `1217-1219`. |
| Direction filter (All, Money in, Money out) | none | `amount` | Derived, Scoped | A client filter over loaded rows; `getTransactions` has no direction argument. `prototype:1221-1235`, `1266-1268`. |
| Scheduled chip and count | `getTransactions(status: pending)` | `scheduled` | Derived | `items.filter(scheduled).length`. Completeness as for the pending badge. `prototype:1236-1242`. |
| No receipt chip | none | `attachment` | Derived, Scoped | A client filter over loaded rows. `prototype:1243-1245`. |
| Day heading ("Thursday 3 September") | `getTransactions` | `date` | Derived | Group by the UTC calendar date of `date` (Transaction Date). `prototype:1005-1027`. |
| Daily total | `getTransactions` | `amount` | Derived, Scoped | Sum of the loaded rows for that day. Complete only if the day is closed by an older loaded row or by a null `nextToken`. Authoritative daily buckets exist in storage (`balance.ts:98`, `:120`; `applications/accounts/api/src/shared/aggregated-day.ts:1-8`), but `Balance` does not expose them (`applications/accounts/api/schema/balance.graphql:1-7`). `prototype:1012-1018`. |
| "Not in the balance yet" | `getTransactions(status: pending)` | `status` | Direct | True: pending never reaches `Balance` (`apply-balance.ts:17-22`). `prototype:1009-1010`. |
| Direction icon and colour | `getTransactions` | `amount` | Derived | `amount ≥ 0` means money in. `prototype:967-971`. |
| Row name | `getTransactions` | `name` | Direct | `prototype:973-975`. |
| Row detail | `getTransactions` | `description` | Direct | The prototype calls it `detail`. `prototype:978-980`. |
| Row category | `getTransactions` | `category` | Direct | A refunded sale keeps `"Sales"`. The sample `"Sales refund"` (`prototype:675`) is not a value the API writes. `prototype:988-992`. |
| Row VAT | `getTransactions` | `vat` | Direct | Negative on refunds. `prototype:993-997`. |
| Row amount with sign | `getTransactions` | `amount`, `currency` from `getBalance` | Direct | `prototype:998-1002`. |
| "No receipt" tag | `getTransactions` | `attachment` | Derived | `attachment` is null or empty. `prototype:944-948`. |
| "Publishes 5 Oct" tag | `getTransactions(status: pending)` | `date scheduled` | Direct | Format in UTC. Publish runs at `date`, then sets `status: confirmed` and `scheduled: false` (`applications/accounts/data/src/schedule-transactions.ts:56`; `publish-transactions.ts:56-62`, `:96`). `prototype:949-955`. |
| "Showing N transactions" and Load more | `getTransactions` | `nextToken` | Derived | The count of rendered rows. `prototype:916-926`, `1298-1307`. |
| No footer on Pending | `getTransactions(status: pending)` | `nextToken` | Derived | Valid only if the client pages pending to the end. `prototype:1306-1307`. |
| "Nothing matches these filters" | none | — | Derived, Scoped | True only of the loaded rows. `prototype:1292-1296`. |
| Live list refresh | `onTransactionChange(id, owner)`, then `getTransactionState(companyId, transactionId)` | `transactionId` | Direct | Needed when a scheduled transaction publishes or another session edits (`schema.graphql:37`, `:51-52`; `applications/accounts/api/src/handlers/publish-stream.ts:155-196`). Not shown in the prototype. |

### Record transaction sheet

| Element | Operation | Fields | Fit | Notes |
| --- | --- | --- | --- | --- |
| Sheet title "Transaction" (edit) | `getTransaction(id)` | All fields | Direct | `prototype:2381-2386`. |
| Transaction type: Purchase or Sale | `getTransaction` | `category` | Derived | Sale when `category === "Sales"` (the typeahead uses the same rule: `applications/accounts/data/src/handlers/insert-typeahead.ts:49-56`). The prototype derives it from direction (`prototype:1801`), which types a purchase refund as a sale. `prototype:2199-2218`. |
| Empty attachment row: Take photo, Choose file | `requestUpload(id, input: { contentType extension metadata })` | `id url` | Direct | Extensions: `gif`, `jpeg`, `jpg`, `pdf`, `png` (`signed-upload.ts:23`). `prototype:2325-2341`. |
| Attachment file name | none | — | Unsupported | The stored name is a UUID (`signed-upload.ts:62-65`). `prototype:2350-2352`. |
| Attachment type ("PDF", "JPEG") | `getTransaction` | `attachment` | Derived | The extension of `attachment`. `prototype:2353-2355`. |
| Attachment size ("84 KB") | none | — | Unsupported | No field. `prototype:2354`. |
| Thumbnail, Open, Download | `requestDownload(id, path: attachment)` | `url` | Direct | Signed for 30 s (`applications/accounts/storage/src/handlers/signed-download.ts:49`). Served from the download bucket only after the virus scan (`signed-download.ts:29-30`; `applications/accounts/storage/src/handlers/queue-upload.ts:18-47`). `prototype:2343-2362`. |
| Replace | `requestUpload`, then `updateTransaction` | `TransactionInput` | Direct | `prototype:2318`. |
| Remove | `deleteFile(id, path)`, then `updateTransaction` with `attachment: ""` | — | Direct | `prototype:2319`. |
| Category picker and rates | `getSettings` | `categories { name vatRate }` | Direct | `prototype:2020-2086`. |
| Amount, including VAT | `addTransaction` / `updateTransaction` | `amount` | Direct | The client applies the sign. `prototype:2223-2234`. |
| VAT field, auto value | `getSettings` | `categories { vatRate } vat { pay }` | Derived | Purchase: `gross − gross / (1 + rate / 100)`. Sale: `gross × vat.pay / 100` (`prototype:1834-1841`; `TransactionForm.tsx:252`, `:262-269`). |
| VAT help text ("16.67% of the sale… you charge the client 20%"; "Included at 20% · Vehicle") | `getSettings` | `vat { pay charge }`, `categories { vatRate }` | Direct | `prototype:2186-2194`. |
| "This is a refund" | `getTransaction` | `refund` | Direct | `prototype:2247-2257`. |
| Money in / Money out badge | none | — | Derived | `(type is sale) XOR refund`. `prototype:2165-2167`, `2258-2261`. |
| Client select (sale) | `getClients(id, count, nextToken)` | `items { name }` | Direct | Complete only after every page. Stores the name as text (`applications/accounts/api/schema/transaction.graphql:43`). `prototype:2263-2264`. |
| Supplier typeahead (purchase) | `getTypeahead(id)` | `suppliers` | Direct | `prototype:2265`. |
| Description typeahead | `getTypeahead` | `purchases`, `sales` | Direct | `prototype:2266-2272`. |
| Date and calendar | `addTransaction` / `updateTransaction` | `date` | Direct | Submit as `YYYY-MM-DDT00:00:00Z` (Transaction Date). The "today" ring uses the device clock (`prototype:1944`). |
| "When does this count?" | `addTransaction` / `updateTransaction` | `status scheduled` | Direct | Now → `confirmed`/`false`. On its date → `pending`/`true`. Hold → `pending`/`false`. `prototype:2275-2297`. |
| Footer "Adds £139.00 to the balance now / on 3 September, automatically" | none | — | Derived | From amount, type, refund, the "when" choice and date. The date is hard-coded (`prototype:2176`). `prototype:2168-2178`. |
| Delete | `deleteTransaction(id)` | — | Direct | `prototype:2366-2368`. |
| Save | `addTransaction` / `updateTransaction` | `TransactionInput` (all non-null) | Direct | `transaction.graphql:35-48`. `prototype:2375-2377`. |

### Attach paperwork sheet and document viewer

| Element | Operation | Fields | Fit | Notes |
| --- | --- | --- | --- | --- |
| Queue membership | `getTransactions(status: confirmed)` | `attachment` | Derived, Scoped | Loaded confirmed rows with no attachment. `prototype:2395-2397`. |
| "N of M done" and progress bar | none | — | Derived | From the visible queue. `prototype:2402-2415`. |
| Current item: name, detail, category, amount | `getTransactions` | `name description category amount` | Direct | `prototype:2439-2452`. |
| "Next: name"; queue list names and amounts | `getTransactions` | `name amount` | Direct | `prototype:2463-2494`. |
| End states ("N still have no invoice or receipt") | none | — | Derived | From the visible queue. `prototype:2417-2436`. |
| Attach and continue | `requestUpload`, then `updateTransaction` with the full `TransactionInput` | — | Direct | `prototype:2457-2468`. |
| Viewer header file name | none | — | Unsupported | `prototype:2635`, `2639-2641`. |
| Rendered PDF or image | `requestDownload` | `url` | Direct | The PDF/image branch is Derived from the extension. `prototype:2615-2630`. |
| "Prototype · attachment type" toggle | none | — | Not API data | A prototype control. `prototype:2657`. |

### People

| Element | Operation | Fields | Fit | Notes |
| --- | --- | --- | --- | --- |
| Client initials | `getClients` | `name` | Derived | `prototype:1333-1335`. |
| Client name, email, town or city | `getClients(id, count, nextToken)` | `items { name contact { email } address { line3 } }` | Direct | Sorted by name (`applications/accounts/api/mapping-templates/client/createClient/Pipeline.createClient.req.vtl:7`). `prototype:1327-1351`. |
| "Showing N clients" and Load more | `getClients` | `nextToken` | Derived | Rendered rows. `prototype:1352`. |
| Client sheet fields | `getClient`, `createClient`, `updateClient` | `ClientInput { name contact { email telephone } address { line1…line5 } }` | Direct | Email and telephone are required (`applications/accounts/api/schema/contact.graphql:6-9`), and the telephone must be a UK number (`applications/accounts/api/mapping-templates/shared/telephone/Pipeline.telephone.req.vtl:1-5`). The prototype treats both as optional (`prototype:2717-2725`). `prototype:2501-2518`. |
| Delete client | `deleteClient(id)` | — | Direct | `prototype:2516`. |

### Year end and reports

| Element | Operation | Fields | Fit | Notes |
| --- | --- | --- | --- | --- |
| Accounting year ends | `getSettings` | `yearEnd` | Derived | As on Overview. `prototype:1361-1363`. |
| Days remaining | `getSettings` | `yearEnd` | Derived | Clock-based. `prototype:1364-1366`. |
| VAT scheme | `getSettings` | `vat { scheme charge }` | Direct | `prototype:1367-1369`. |
| Report rows: requested, expires, Download | `getReports(id, count, nextToken)` | `items { createdAt ttl downloadUrl }` | Direct | `ttl` is `createdAt` plus one day (`applications/accounts/reports/src/handlers/add-report.ts:41-60`). `prototype:1387-1404`. |
| "Reports are deleted 24 hours after they are created." | `getReports` | `ttl` | Direct | TTL is enabled on the table (`applications/accounts/data/serverless.yml:127-129`), and DynamoDB removes expired items in the background rather than at `ttl`, so hide rows whose `ttl` has passed. `prototype:1405`. |
| "Showing N reports" and Load more | `getReports` | `nextToken` | Derived | `prototype:1406`. |
| Create report: Transactions to include | `createReport(input)` | `ReportInput.status` | Direct | `report.graphql:23-29`. `prototype:2607-2609`. |
| Create report: Accounting year options | `getSettings` | `yearEnd` | Derived | Value is the start year as an `Int`. The range is `<year>-<month+1>-<day+1>` to `<year+1>-<month+1>-<day>` (`applications/accounts/reports/src/handlers/get-transactions.ts:55-63`). `prototype:504-516`, `2610`. |

### Companies, company details and settings

| Element | Operation | Fields | Fit | Notes |
| --- | --- | --- | --- | --- |
| Company rows: name, company number | `getCompanies` | `items { id name companyNumber }` | Direct | `prototype:1426-1447`. |
| Company initials; "Selected" | none | — | Derived | `prototype:1429-1438`. |
| "Showing N companies" and Load more | `getCompanies` | `nextToken` | Derived | `prototype:1448`. |
| Add a company: business, bank and VAT, year end, opening position | `createCompany(input: CreateCompanyInput)` | `company`, `vat`, `yearEnd`, `balance { balance vat { owed paid } }` | Direct | `applications/accounts/api/schema/company.graphql:26-31`; `balance.graphql:25-28`. Email and telephone are required here too. `prototype:2519-2603`. |
| Company details: identity, address, contact, bank fields | `getCompany(id)`, `updateCompany(input)` | `name companyNumber address contact bank { accountNumber sortCode }` | Direct | `company.graphql:7-24`. `prototype:1503-1550`. |
| Bank account caption "Used to match transactions" | none | — | Unsupported | No matching exists. The schema has only `BankDetails`. `prototype:1546`. |
| Delete company | `deleteCompany(id)` | — | Direct | Queued (`serverless.yml:107-113`). `prototype:1553`. |
| VAT scheme chips | `getSettings`, `updateSettings` | `vat { scheme }` | Direct | Standard → `standard`, Flat rate → `flatRate`, Not registered → `none`. `prototype:1610-1624`. |
| VAT to charge %, VAT to pay %, registration | `getSettings`, `updateSettings` | `vat { charge pay registration }` | Direct | `charge` and `pay` are non-null even for `none` (`vat-settings.graphql:14-19`). The prototype hides them for `none` (`prototype:1625-1635`), so the client must still send values. |
| Year end day and month | `getSettings`, `updateSettings` | `yearEnd { day month }` | Direct | `month` is zero-based (`get-transactions.ts:28-29`; `applications/accounts/client/src/components/CommonFields.tsx:192`). The prototype's sample uses one-based months (`prototype:486-488`). `prototype:1638-1645`. |
| Expense categories: name, rate, lock | `getSettings`, `updateSettings` | `categories { name vatRate protect }` | Direct | Five protected categories are seeded (`Pipeline.createCompany.req.vtl:8-34`). `prototype:1563-1604`. |

Login, page not found, loading skeletons and the error panel show no API data.

## DESIGN.md API Fit table check

| `DESIGN.md` row | Verdict there | Schema confirms? | Correction |
| --- | --- | --- | --- |
| Balance, VAT owed, VAT paid (`:469`) | Direct | Yes (`balance.graphql:1-12`) | The prototype shows no VAT paid. `vat.owed` nets off `VAT payment` amounts and ignores `paid` (`balance.ts:71-89`). |
| Currency (`:470`) | Direct | Yes | Always `"GBP"` today (`Pipeline.createCompany.req.vtl:6`). |
| Balance less VAT owed (`:471`) | Derived | Yes | — |
| Live balance after a save (`:472`) | Direct | Yes | Published after each confirmed change (`publish-stream.ts:141-147`). `owner` must match the claim (`applications/accounts/api/mapping-templates/transaction/onTransaction/Subscription.onTransaction.req.vtl:3-5`). |
| Day groups and daily totals (`:473`) | Derived | Partly | Group by UTC date. Totals are Scoped: a day split by a page boundary changes on Load more. The stored daily buckets are not in the schema. |
| Money in / out direction (`:474`) | Derived | Yes | The sign of `amount` alone decides direction. Purchase or Sale is `category === "Sales"`. |
| "No receipt" badge (`:475`) | Direct | No | Derived: `attachment` is null or empty. |
| "N of the transactions below…" (`:476`) | Scoped | Yes | The prototype counts rows that are not "below". |
| "N scheduled transactions coming up" (`:477`) | Direct | **No** | `getTransactions` takes `count` and `nextToken` for any status and returns `nextToken` (`schema.graphql:38-43`; `Query.getTransactions.req.vtl:36-41`; `applications/accounts/api/mapping-templates/transaction/getTransactions/Query.getTransactions.res.vtl:12-14`). Derived, and complete only after paging to a null `nextToken`. The legacy client omits `count` (`applications/accounts/client/src/pages/MyCompanies/Accounts/PendingTransactions.tsx:125-140`), which still caps at one 1 MB DynamoDB page. Fix `DESIGN.md:372` and `prototype:1306` too. |
| Pending and Scheduled chips (`:478`) | Direct | No | The chip counts are Derived, with the same completeness condition. |
| "Publishes 5 Oct" (`:479`) | Direct | Yes | Format `date` in UTC. |
| Category picker and its rates (`:480`) | Direct | Yes | — |
| VAT on a purchase (`:481`) | Derived | Yes | — |
| VAT on a sale (`:482`) | Derived | Yes | — |
| Year end date and days away (`:483`) | Direct | No | Derived from `yearEnd` and today. `month` is zero-based. |
| Reports list (`:484`) | Direct | Yes | Returned oldest first and may include expired rows. Sort newest first and hide `ttl < now`. `DESIGN.md:408` ("never more than a day deep") is not guaranteed. |
| Report expiry (`:485`) | Direct | Yes | `ttl` is epoch seconds. |
| Client picker on a sale (`:486`) | Direct | Yes | Paged; load every page. |
| Supplier field on a purchase (`:487`) | Direct | Yes | Add a row for description suggestions: `getTypeahead { purchases sales }`. |
| Attachment upload (`:488`) | Direct | **No** | `contentType` and `extension` are `StorageUploadInput` fields (`applications/accounts/api/schema/storage.graphql:19-23`). The result is `StorageUpload { id url }` (`storage.graphql:9-12`). The client stores `<companyId>/<id>.<extension>`. |
| PDF viewer vs image viewer (`:489`) | Derived | Yes | — |
| Notification list (`:490`) | Direct | Yes | Newest first. |
| Notification text (`:491`) | Direct | Yes | — |
| Unread dot and count (`:492`) | Scoped | Yes | Read notifications are TTL-deleted once marked. |
| Live arrival (`:493`) | Direct | Yes | `schema.graphql:55-56`. |
| Download from a notification (`:494`) | Direct | Yes | — |
| Company switcher (`:495`) | Direct | Yes | `id` is the Accounts Owner ID. Sorted by name. |

Rows missing from the table: live list refresh (`onTransactionChange` and `getTransactionState`), attachment open and download (`requestDownload`), the VAT scheme chip, and the client, company and settings forms.

Prose that also needs correcting: `DESIGN.md:295` (the filled attachment row shows a file name and size, which have no field) and `DESIGN.md:454` ("Don't offer a filter the API cannot perform"). The Direction and No receipt chips break `:454`, and `DESIGN.md:504` keeps the No receipt chip anyway. The "Cut, and why" list (`DESIGN.md:499-507`) holds. For "Older notifications", the resolver already emits `nextToken` (`applications/accounts/api/mapping-templates/notifications/getNotifications/Query.getNotifications.res.vtl:8-10`), but the type drops it.

## Provable Figure Rule check

| Figure | Source | Traceable? | Scope needed? |
| --- | --- | --- | --- |
| Current balance; VAT owed | `getBalance` | Yes | No |
| Balance less VAT owed | Two figures on screen | Yes | No; the label states the formula |
| "20%" in the VAT scheme chip | `vat.charge` | Yes | No |
| "Needs you" count | Visible rows | Yes | No |
| "N of the transactions below have no invoice or receipt" | Loaded confirmed rows | **No, as built**: it counts rows outside "below" | Yes: count exactly the rendered rows |
| "N scheduled transactions coming up", their amounts and dates | Pending query | Only when `nextToken` is null | Yes, unless pending is paged to the end |
| Pending badge; Scheduled count | Pending query | Only when `nextToken` is null | As above |
| Row amounts and VAT (Overview, Money, paperwork) | `amount`, `vat` | Yes | No |
| Daily totals | Sum of loaded rows | Only for a closed day | Yes: hide on an open day |
| Year end date; days away or remaining; "financial year began" | `yearEnd` and the clock | Yes | No |
| Report requested and expiry times | `createdAt`, `ttl` | Yes | No |
| Report year labels ("2025-26") | `yearEnd` and the clock | Yes | No |
| "Showing N transactions, clients, reports or companies" | Rendered rows | Yes | No; it already says "showing" |
| Unread count in the avatar's accessible name | Loaded notifications | Yes, equal to the unread rows the menu lists | Already scoped by the menu |
| Category rates; VAT help percentages | `vatRate`, `vat.pay`, `vat.charge` | Yes | No |
| Auto VAT value | Amount input and the on-screen rate | Yes | No |
| Record footer amount and date | Amount input; date | Amount yes; **date no** (hard-coded) | Derive from the date field |
| Paperwork "N of M done", %, "N still have no invoice" | The visible queue | Yes | The queue is listed |
| Attachment size | None | **No** | Cut |

## Elements to cut

Cut:

1. **Attachment file name** (the attachment row and the viewer header). No field holds it; the stored key is a UUID. Show the type from the extension instead.
2. **Attachment file size.** No field holds it.
3. **"Used to match transactions"** under Bank account. It claims behaviour the API does not have.
4. **A daily total on a day not known to be complete.** That is the oldest loaded day while `nextToken` is non-null. It would change on Load more.

Keep but rescope or fix:

- The "no invoice or receipt" count and the paperwork queue: count and list exactly the rows rendered beneath them.
- The pending badge, Scheduled count and "N scheduled… coming up": page the pending query to a null `nextToken` before showing a count.
- The Direction and No receipt filters on Confirmed, and their empty state: results cover loaded rows only.
- The record footer: derive the date from the date field.
- Transaction type on edit: derive it from `category`, not from direction.
- The reports list: sort newest first and hide rows whose `ttl` has passed.
- Client and company forms: make email and telephone required.

## Open points

1. Client-side filters on a paged list (Direction, No receipt) break `DESIGN.md:454`. Keep them as scoped filters, or cut them from Confirmed?
2. "Balance less VAT owed" subtracts `vat.owed` only. `vat.paid` (reclaimable VAT) is ignored and not shown. Is this the intended figure?
3. Exposing `Balance.items` (daily totals) or `Notifications.nextToken` would need a schema change. Is either in scope, given the decision to keep the current API?
4. A freshly attached file cannot be opened until the virus scan copies it to the download bucket, and no field reports the scan state. Which state should the attachment row show in the meantime?

# Flowable CMMN properties: Flowable Design side bar versus our packages

This page checks the properties for the side bar rework (#59, inventory issue #60). It
lists, for each CMMN element, the fields Flowable Design shows, the group they sit in, the
XML each one maps to, and what our packages (`flowable-cmmn-moddle`,
`cmmn-js-properties-panel-flowable`) do with it today. It also lists the attributes the
open-source engine reads that Flowable Design doesn't show.

## Sources

| Source | Version | Used for |
|---|---|---|
| Flowable Design side bar, observed | 2026-11-21 | group names, group order and field labels for case plan model, stage, human task, process task, milestone, user and variable event listeners, criteria and connector. Where it differs from the docs, it wins. |
| Flowable CMMN reference docs, [documentation.flowable.com/latest/reactmodel/cmmn/reference/](https://documentation.flowable.com/latest/reactmodel/cmmn/reference/) | "latest", read 2026-11-21 | group order and labels for the other element types, plus field types and a few defaults. The docs give no XML names. |
| Flowable engine, CMMN converter (`flowable-cmmn-converter`) and the engine classes that read its generic extension elements | flowable-engine `055f90ad53` | XML names, accepted values, defaults, and whether the open-source engine reads a property at all |

## Legend

Columns of the element tables:

- **Group**: the Flowable Design group, in the order Flowable Design shows. `A > B` is sub-section B of group A. `—` means Flowable Design doesn't show the property, but the engine reads it. `(docs)` marks a group seen only in the reference docs, not in the observed side bar.
- **Field**: the Flowable Design label, or a short description for `—` rows.
- **XML name**: `@attr` is an attribute, `<el>` a child element, `ext:<el>` an element inside `<extensionElements>`. `flowable:` is `http://flowable.org/cmmn`. "to confirm" means we don't know how Flowable Design writes it yet (no exported model to check).
- **Scope**: `engine` means the open-source engine reads it. `work` means only Flowable Work or Flowable Design uses it and the engine ignores it.
- **Status**:
  - `field`: a moddle property and a panel field.
  - `no field`: a moddle property (flowable or standard CMMN), but no panel field.
  - `kept`: not typed in the moddle, but preserved on save and shown in the read-only Extensions tab.
  - `missing`: lost, or modelled wrong.

  For `work` rows the status is `kept` on the assumption that Flowable Design writes them as attributes or extension elements: a load-and-save check with `flowable-cmmn-moddle` kept unknown `flowable:` attributes and unknown extension elements unchanged. This is to confirm with an exported model.
- **Issue**: the sub-issue that will handle the row:
  - #62: regroup existing fields into Flowable's groups (every `field` row).
  - #65: missing open-source engine attributes and fields (`engine` rows that aren't `field`).
  - #66: Flowable Work fields (`work` rows).
  - #74: draw visual properties. Visual rows also carry #66 for the fields themselves.
  - #79 / #80: palette task / listener types, only on rows that create the type.

Visual properties (font size, font weight, font style, font color, background color, border
color) are `work` and "to confirm": Flowable Design stores them somewhere, probably in DI or
in its own extensions; we don't know where yet.

Shared groups are written once in the next section; element tables point to them with `→`.
Reference rows (`→`) aren't counted as rows.

---

## Shared groups

### SG-Header

Every element starts its General group with these.

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| General | Model Id | `@id` | engine | field | #62 |
| General | Name | `@name` (multi-line names: `ext:<flowable:element-name>`) | engine | field | #62 |
| General | Documentation | `<documentation @textFormat>` | engine | field | #62 |
| — | Multi-line name | `ext:<flowable:element-name>` text replaces `@name` | engine | no field | #65 |

### SG-AI

Group "AI" on stage, tasks and milestone.

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| AI | AI activated | to confirm | work | kept | #66 |
| AI | Activation type (Suggestion / Automatic) | to confirm | work | kept | #66 |
| AI | AI instruction | to confirm | work | kept | #66 |
| AI | AI activation permission groups | to confirm | work | kept | #66 |

### SG-Control-Items

Group "Control" on tasks, stage and milestone. The rules sit in the plan item's
`<itemControl>`, or in `<defaultControl>` of the definition.

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| Control | Required | `<requiredRule>` + `<condition>` | engine | field | #62 |
| Control | Manual activation | `<manualActivationRule>` + `<condition>` | engine | field | #62 |
| Control | Completion neutral | `ext:<flowable:completionNeutralRule>` + `<condition>` (in the control) | engine | field | #62 |
| Control | Manual activation name | to confirm | work | kept | #66 |
| Control | Manual activation icon | to confirm | work | kept | #66 |
| Control | Manual activation priority | to confirm | work | kept | #66 |
| Control | Manual activation permission groups | to confirm | work | kept | #66 |
| Control | Manual activation permission users | to confirm | work | kept | #66 |
| Control | Manual activation channels | to confirm | work | kept | #66 |
| Control | Start form (of the manual activation) | to confirm | work | kept | #66 |
| Control | In same deployment (of that form) | to confirm | work | kept | #66 |
| Control | Validate start form fields (server-side) | to confirm | work | kept | #66 |

### SG-Control-Listeners

Group "Control" on event listeners. The engine reads item controls on any plan item; the
panel offers them only on tasks, stages and milestones.

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| Control | Required | `<requiredRule>` + `<condition>` | engine | no field | #65 |
| Control | Completion neutral | `ext:<flowable:completionNeutralRule>` + `<condition>` | engine | no field | #65 |

### SG-Repetition-Items

Group "Repetition" on tasks, stage and milestone.

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| Repetition | Repetition | `<repetitionRule>` + `<condition>` | engine | field | #62 |
| Repetition | Repetition counter variable | `@flowable:counterVariable` (default `repetitionCounter`) | engine | field | #62 |
| Repetition | Don't create repetition counter variable | `@flowable:ignoreCounterVariable` (`true`) | engine | field | #62 |
| Repetition | Max instance count | `@flowable:maxInstanceCount`: number or `unlimited`; `0` fails the deployment | engine | field | #62 |
| Repetition | Collection variable | `@flowable:collectionVariable` | engine | field | #62 |
| Repetition | Element variable | `@flowable:elementVariable` | engine | field | #62 |
| Repetition | Element index variable | `@flowable:elementIndexVariable` | engine | field | #62 |
| Repetition | Variable aggregations | `ext:<flowable:variableAggregation>` (in the repetition rule) | engine | no field | #65 |
| Repetition > aggregation | Target (variable / expression) | `@target` / `@targetExpression` | engine | no field | #65 |
| Repetition > aggregation | Type (Default / Custom), Class, Delegate expression | `@class` / `@delegateExpression` | engine | no field | #65 |
| Repetition > aggregation | Target variable creation (overview / transient) | `@createOverviewVariable` / `@storeAsTransientVariable` | engine | no field | #65 |
| Repetition > aggregation | Variable definitions: source, target | `<flowable:variable @source @sourceExpression @target @targetExpression>` | engine | no field | #65 |

### SG-Repetition-Listeners

The same XML on event listeners, where the panel offers no repetition fields.

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| Repetition | Repetition | `<repetitionRule>` + `<condition>` | engine | no field | #65 |
| Repetition | Repetition counter variable | `@flowable:counterVariable` | engine | no field | #65 |
| Repetition | Don't create repetition counter variable | `@flowable:ignoreCounterVariable` | engine | no field | #65 |
| Repetition | Max instance count | `@flowable:maxInstanceCount` | engine | no field | #65 |
| Repetition | Collection, element, element index variables | `@flowable:collectionVariable`, `@flowable:elementVariable`, `@flowable:elementIndexVariable` | engine | no field | #65 |
| Repetition | Variable aggregations (and their sub-fields) | `ext:<flowable:variableAggregation>` | engine | no field | #65 |

### SG-Reactivation-Items

Group "Reactivation" on tasks, stage and milestone.

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| Reactivation | Direct activation condition | `ext:<flowable:reactivationRule @activateCondition>` (in the control) | engine | field | #62 |
| Reactivation | Ignore condition | `ext:<flowable:reactivationRule @ignoreCondition>` | engine | field | #62 |
| Reactivation | Default condition | `ext:<flowable:reactivationRule @defaultCondition>` | engine | field | #62 |

### SG-Reactivation-Listeners

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| Reactivation | Direct activation, ignore, default condition | `ext:<flowable:reactivationRule>` conditions | engine | no field | #65 |

### SG-Execution

Group "Advanced > Execution". Each element names the rows it shows.

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| Advanced > Execution | Impact on parent completion | `ext:<flowable:parentCompletionRule @type>` in the control: `default`, `ignore`, `ignoreIfAvailable`, `ignoreIfAvailableOrEnabled`, `ignoreAfterFirstCompletion`, `ignoreAfterFirstCompletionIfAvailableOrEnabled` | engine | field | #62 |
| Advanced > Execution | Asynchronous | `@flowable:async` | engine | field | #62 |
| Advanced > Execution | Exclusive | `@flowable:exclusive` | engine | field | #62 |
| Advanced > Execution | Leave asynchronously | `@flowable:asyncLeave` | engine | field | #62 |
| Advanced > Execution | Leave exclusive | `@flowable:asyncLeaveExclusive` | engine | field | #62 |
| Advanced > Execution | Job category | `ext:<flowable:jobCategory>` (text, expression allowed; read for the plan item's jobs) | engine | kept | #65 |
| Advanced > Execution | Blocking | `@isBlocking` (default true) | engine | no field (cmmn-js replace menu toggles it) | #65 |
| Advanced > Execution | Include in history | to confirm | work | kept | #66 |
| — | Blocking expression | `@flowable:isBlockingExpression` | engine | field | #62 |

### SG-Execution-Listeners

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| Advanced > Execution | Impact on parent completion | `ext:<flowable:parentCompletionRule @type>` | engine | no field | #65 |

### SG-Details-Listeners

Group "Advanced > Details" on event listeners.

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| Advanced > Details | Available condition | `@flowable:availableCondition` | engine | field | #62 |
| Advanced > Details | Include in history | to confirm | work | kept | #66 |

### SG-Listeners

Group "Advanced > Listeners", list "Lifecycle listeners" (`ext:<flowable:planItemLifecycleListener>`).

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| Advanced > Listeners | Lifecycle listeners | `ext:<flowable:planItemLifecycleListener>` | engine | field | #62 |
| Advanced > Listeners > item | Source state, Target state | `@sourceState`, `@targetState` | engine | field | #62 |
| Advanced > Listeners > item | Class, Expression, Delegate expression | `@class` / `@expression` / `@delegateExpression` (first set wins) | engine | field | #62 |
| — | Script listener | `@type="script"` + `<flowable:script @language @resultVariable>` | engine | field | #62 |
| — | Field injection | `<flowable:field>` | engine | field | #62 |
| — | On transaction | `@onTransaction` | engine | no field | #65 |

### SG-Expose

Group "UI Configuration" lists on human, case and process tasks and the user event listener.

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| UI Configuration | Expose as action to object (scope id, scope type, participants, action name, description) | to confirm | work | kept | #66 |
| UI Configuration | Expose as an action message (conversation, users, message, template, sticky) | to confirm | work | kept | #66 |

### SG-Visual

Group "Visual". Text annotation and connector show every row except Background color.

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| Visual | Font size (8 to 72) | to confirm | work | kept | #66, #74 |
| Visual | Font weight (Normal / Bold) | to confirm | work | kept | #66, #74 |
| Visual | Font style (Normal / Italic) | to confirm | work | kept | #66, #74 |
| Visual | Font color | to confirm | work | kept | #66, #74 |
| Visual | Background color | to confirm | work | kept | #66, #74 |
| Visual | Border color | to confirm | work | kept | #66, #74 |

---

## Case and case plan model

The observed side bar for the case plan model shows the case-level groups (the docs' "Case
diagram" page). The docs' "Case plan model" page adds the plan model's own groups; they
follow, marked `(docs)`. The engine splits these between `cmmn:case`, `cmmn:casePlanModel`
and `cmmn:definitions`.

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| General > Common | Model key | `cmmn:case@id` | engine | field | #62 |
| General > Common | Name | `cmmn:case@name` | engine | field | #62 |
| General > Common | Documentation | `<documentation>` | engine | field | #62 |
| General > Common | Creation date | to confirm (maybe `definitions@creationDate`) | work | kept | #66 |
| General > Common | Modification date | to confirm | work | kept | #66 |
| General > Common | Case instance name | to confirm | work | kept | #66 |
| General > Common | Case instance business key | to confirm | work | kept | #66 |
| General > Common | Category | to confirm | work | kept | #66 |
| General > SLA | SLA reference | to confirm | work | kept | #66 |
| Assignment | Assignee | to confirm | work | kept | #66 |
| Assignment | Owner | to confirm | work | kept | #66 |
| Assignment | Potential starter user | `cmmn:case@flowable:candidateStarterUsers` (comma list) | engine | field | #62 |
| Assignment | Potential starter group | `cmmn:case@flowable:candidateStarterGroups` | engine | field | #62 |
| Assignment > Flowable User | Participant users, participant groups, participant candidate groups | to confirm | work | kept | #66 |
| Assignment > Flowable User | Watcher users, watcher groups | to confirm | work | kept | #66 |
| Assignment > Flowable User | Candidate users, candidate groups, task candidates type | to confirm | work | kept | #66 |
| Variable Mapping | Interface parameters | to confirm | work | kept | #66 |
| Details | Author | `definitions@author` | engine | no field | #65 |
| Details | Version | to confirm | work | kept | #66 |
| Security | Security policy | to confirm | work | kept | #66 |
| UI Configuration | Header configuration, default menu navigation size, case view elements | to confirm | work | kept | #66 |
| Audit | History level, allowed historic variables | to confirm | work | kept | #66 |
| Indexing | Indexing filter type, filter variable names, do not propagate to completed sub-instances | to confirm | work | kept | #66 |
| Advanced | Initiator variable (default `initiator`) | `cmmn:case@flowable:initiatorVariableName` | engine | field | #62 |
| Advanced | Case instance business status | to confirm | work | kept | #66 |
| Advanced | Folder path for uploaded content items | to confirm | work | kept | #66 |
| Advanced | Status values | to confirm | work | kept | #66 |
| Advanced | Comments only on root instance, documents only on root instance | to confirm | work | kept | #66 |
| Advanced | Restrict document library to app content models, allowed content models | to confirm | work | kept | #66 |
| Advanced | Case sequence (and its variable name) | to confirm | work | kept | #66 |
| General (docs) | Start form | `cmmn:casePlanModel@flowable:formKey` | engine | field | #62 |
| General (docs) | In same deployment | `cmmn:casePlanModel@flowable:sameDeployment` (default true) | engine | field | #62 |
| General (docs) | Inbound event: event key | `cmmn:case` `ext:<flowable:eventType>` | engine | field | #62 |
| General (docs) | Inbound event: start correlation | `ext:<flowable:startEventCorrelationConfiguration>` (`storeAsUniqueReferenceId`, `manualSubscription`) | engine | field | #62 |
| General (docs) | Inbound event: correlation parameters | `ext:<flowable:eventCorrelationParameter @name @value>` | engine | field | #62 |
| General (docs) | Inbound event: payload to variables | `ext:<flowable:eventOutParameter @source @target @transient>` | engine | field | #62 |
| General (docs) | Inbound channel | to confirm | work | kept | #66 |
| General (docs) | Document event | to confirm | work | kept | #66 |
| General (docs) | Persisting content items (enable, item name, variable, transient, list variable) | to confirm | work | kept | #66 |
| General (docs) | Work form, work form in same deployment | to confirm | work | kept | #66 |
| AI (docs) | Agent model, variable mapping type, variable mappings to the agent | to confirm | work | kept | #66 |
| Advanced Form (docs) | Data mapping of start and work forms | to confirm | work | kept | #66 |
| Advanced Form (docs) | Validate form fields (server-side) | `cmmn:casePlanModel@flowable:formFieldValidation` | engine | field | #62 |
| Advanced Form (docs) | Validate work form fields (server-side) | to confirm | work | kept | #66 |
| Advanced > Details (docs) | Auto complete | `cmmn:casePlanModel@autoComplete` | engine | no field (replace menu) | #65 |
| Advanced > Listeners (docs) | Lifecycle listeners (case) | `cmmn:case` `ext:<flowable:caseLifecycleListener>` (fields as in [SG-Listeners](#sg-listeners)) | engine | field | #62 |
| Visual (docs) | → [SG-Visual](#sg-visual) | | | | |
| — | Asynchronous start | `cmmn:case@flowable:async` | engine | field | #62 |
| — | Auto complete condition | `cmmn:casePlanModel@flowable:autoCompleteCondition` | engine | field | #62 |
| — | Lifecycle listeners on the plan model itself | `cmmn:casePlanModel` `ext:<flowable:planItemLifecycleListener>` | engine | no field | #65 |
| — | Stage overview attributes on the plan model | `@flowable:displayOrder`, `@flowable:includeInStageOverview`, `@flowable:businessStatus` | engine | no field | #65 |

## Stage

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| General | Model Id, Name, Documentation | → [SG-Header](#sg-header) | | | |
| General | Business status | `@flowable:businessStatus` | engine | field | #62 |
| AI | → [SG-AI](#sg-ai) | | | | |
| Control | → [SG-Control-Items](#sg-control-items) | | | | |
| Repetition | → [SG-Repetition-Items](#sg-repetition-items) | | | | |
| Details | Auto complete | `@autoComplete` | engine | no field (replace menu) | #65 |
| Details | Show state | `@flowable:includeInStageOverview` (empty = true; `false` or expression) | engine | field | #62 |
| Details | Display order | `@flowable:displayOrder` (integer) | engine | field | #62 |
| Advanced | Lifecycle listeners → [SG-Listeners](#sg-listeners) | | | | |
| Reactivation | → [SG-Reactivation-Items](#sg-reactivation-items) | | | | |
| Visual | → [SG-Visual](#sg-visual) | | | | |
| — | Auto complete condition | `@flowable:autoCompleteCondition` | engine | field | #62 |
| — | Exit criteria | `<exitCriterion>` (see [Exit criterion](#exit-criterion)) | engine | field | #62 |

## Plan fragment

Docs only. No runtime state in the engine.

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| General | Model Id, Name, Documentation | → [SG-Header](#sg-header) | | | |
| Visual | → [SG-Visual](#sg-visual) | | | | |

## Human task

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| General > Common | Model Id, Name, Documentation | → [SG-Header](#sg-header) | | | |
| General > Common | Due date | `@flowable:dueDate` | engine | field | #62 |
| General > Common | Priority (50 when empty) | `@flowable:priority` | engine | field | #62 |
| General > Common | Category | `@flowable:category` | engine | no field | #65 |
| General > Form | Form reference | `@flowable:formKey` | engine | field | #62 |
| General > Form | In same deployment | `@flowable:sameDeployment` (default true) | engine | field | #62 |
| General > SLA | SLA reference | to confirm | work | kept | #66 |
| AI | → [SG-AI](#sg-ai) | | | | |
| Assignment | Assignee | `@flowable:assignee` | engine | field | #62 |
| Assignment | Owner | `@flowable:owner` | engine | no field | #65 |
| Assignment | Candidate users | `@flowable:candidateUsers` (comma list) | engine | field | #62 |
| Assignment | Task candidates type | to confirm | work | kept | #66 |
| Assignment | Candidate groups | `@flowable:candidateGroups` | engine | field | #62 |
| Assignment | Participant users, participant groups | to confirm | work | kept | #66 |
| Assignment | Watcher users, watcher groups | to confirm | work | kept | #66 |
| Assignment | Disallowed users / groups for assignee, disallowed task completers (and scope) | to confirm | work | kept | #66 |
| Control | → [SG-Control-Items](#sg-control-items) | | | | |
| Repetition | → [SG-Repetition-Items](#sg-repetition-items) | | | | |
| Advanced Form > Data mapping | Input and output mapping type and mappings to form | to confirm | work | kept | #66 |
| Advanced Form > Validation | Validate form fields (server-side) | `@flowable:formFieldValidation` (`true`, `false` or expression) | engine | no field | #65 |
| Security | Security policy | to confirm | work | kept | #66 |
| UI Configuration | Expose to case view (with header configuration, label, icon, index, identity link types, per-state access) | to confirm | work | kept | #66 |
| UI Configuration (docs) | Expose task details → [SG-Expose](#sg-expose) | | | | |
| Advanced > Execution | Asynchronous, Exclusive, Leave asynchronously, Leave exclusive, Job category, Blocking, Include in history, Impact on parent completion → [SG-Execution](#sg-execution) | | | | |
| Advanced > Execution | Task ID variable | `@flowable:taskIdVariableName` | engine | no field | #65 |
| Advanced > Execution | Task completer variable | `@flowable:taskCompleterVariableName` | engine | no field | #65 |
| Advanced > Advanced options | Folder path for uploaded content items | to confirm | work | kept | #66 |
| Advanced > Listeners | Lifecycle listeners → [SG-Listeners](#sg-listeners) | | | | |
| Advanced > Listeners | Task listeners | `ext:<flowable:taskListener>` | engine | field | #62 |
| Advanced > Listeners > task listener | Event (Create / Assignment / Complete / Delete) | `@event` | engine | field | #62 |
| Advanced > Listeners > task listener | Class, Expression, Delegate expression (and script) | `@class` / `@expression` / `@delegateExpression` / `@type="script"` + `<flowable:script>` | engine | field | #62 |
| Advanced > Listeners > task listener | On transaction | `@onTransaction` | engine | kept (not typed on `flowable:TaskListener`) | #65 |
| Advanced > Listeners > task listener | Fields | `<flowable:field>` | engine | field | #62 |
| Reactivation | → [SG-Reactivation-Items](#sg-reactivation-items) | | | | |
| Visual | → [SG-Visual](#sg-visual) | | | | |

## Process task

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| General > Common | Model Id, Name, Documentation | → [SG-Header](#sg-header) | | | |
| General > Process | Process reference | `@processRef` (id of a `cmmn:process`) or `<processRefExpression>` | engine | field | #62 |
| General > Process | In same deployment | `@flowable:sameDeployment` (default false) | engine | field | #62 |
| General > Process | Fallback to default tenant | `@flowable:fallbackToDefaultTenant` | engine | field | #62 |
| General > Process | Process instance name | to confirm | work | kept | #66 |
| General > Process | Business key | `@flowable:businessKey` | engine | field | #62 |
| General > Process | Inherit business key | `@flowable:inheritBusinessKey` | engine | field | #62 |
| General > Process | Process ID variable | `@flowable:idVariableName` | engine | field | #62 |
| AI | → [SG-AI](#sg-ai) | | | | |
| Variable Mapping | In (source, target) | `ext:<flowable:in @source @sourceExpression @sourceType @target @targetExpression @targetType @transient>` | engine | field | #62 |
| Variable Mapping | Out (source, target) | `ext:<flowable:out ...>` (same attributes) | engine | field | #62 |
| Control | → [SG-Control-Items](#sg-control-items) | | | | |
| Repetition | → [SG-Repetition-Items](#sg-repetition-items) | | | | |
| UI Configuration (docs) | → [SG-Expose](#sg-expose) | | | | |
| Advanced > Execution | Asynchronous, Leave asynchronously, Blocking, Include in history, Impact on parent completion (docs add Exclusive, Leave exclusive, Job category) → [SG-Execution](#sg-execution) | | | | |
| Advanced > Listeners | Lifecycle listeners → [SG-Listeners](#sg-listeners) | | | | |
| Reactivation | → [SG-Reactivation-Items](#sg-reactivation-items) | | | | |
| Visual | → [SG-Visual](#sg-visual) | | | | |
| — | Inherit variables | `@flowable:inheritVariables` | engine | field | #62 |
| — | The referenced process key | `cmmn:process@externalRef` (definitions level) | engine | no field | #65 |

## Case task

Docs only. Same layout as the process task.

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| General > Common | Model Id, Name, Documentation | → [SG-Header](#sg-header) | | | |
| General > Case | Case name | to confirm | work | kept | #66 |
| General > Case | Business key | `@flowable:businessKey` | engine | field | #62 |
| General > Case | Inherit business key | `@flowable:inheritBusinessKey` | engine | field | #62 |
| General > Case | Case ID variable | `@flowable:idVariableName` | engine | field | #62 |
| General > Case | Case reference | `@caseRef` (case key) or `<caseRefExpression>` | engine | field | #62 |
| General > Case | In same deployment | `@flowable:sameDeployment` (default false) | engine | field | #62 |
| General > Case | Fallback to default tenant | `@flowable:fallbackToDefaultTenant` | engine | field | #62 |
| AI | → [SG-AI](#sg-ai) | | | | |
| Variable Mapping | In, Out | `ext:<flowable:in>`, `ext:<flowable:out>` | engine | field | #62 |
| Control | → [SG-Control-Items](#sg-control-items) | | | | |
| Repetition | → [SG-Repetition-Items](#sg-repetition-items) | | | | |
| UI Configuration | → [SG-Expose](#sg-expose) | | | | |
| Advanced > Execution | all rows of [SG-Execution](#sg-execution) | | | | |
| Advanced > Listeners | Lifecycle listeners → [SG-Listeners](#sg-listeners) | | | | |
| Reactivation | → [SG-Reactivation-Items](#sg-reactivation-items) | | | | |
| Visual | → [SG-Visual](#sg-visual) | | | | |
| — | Inherit variables | `@flowable:inheritVariables` | engine | field | #62 |

## Decision task

Docs only. The engine reads the decision options from `flowable:field` entries.

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| General | Model Id, Name, Documentation | → [SG-Header](#sg-header) | | | |
| General | Decision table reference / decision service reference | `@decisionRef` (id of a `cmmn:decision`) or `<decisionRefExpression>`; the engine runs a table or a service by key | engine | field | #62 |
| General | In same deployment (also "for decision service") | `ext:<flowable:field name="sameDeployment">` | engine | no field | #65 |
| General | Fallback to default tenant (also "for decision service") | `ext:<flowable:field name="fallbackToDefaultTenant">` | engine | no field | #65 |
| General | Multi-hit output variable name | to confirm | work | kept | #66 |
| AI | → [SG-AI](#sg-ai) | | | | |
| Control | → [SG-Control-Items](#sg-control-items) | | | | |
| Repetition | → [SG-Repetition-Items](#sg-repetition-items) | | | | |
| Details | Throw error if no rules were hit | `ext:<flowable:field name="decisionTaskThrowErrorOnNoHits">` (`true`, `false` or expression) | engine | no field | #65 |
| Advanced > Execution | all rows of [SG-Execution](#sg-execution) except Blocking | | | | |
| Advanced > Listeners | Lifecycle listeners → [SG-Listeners](#sg-listeners) | | | | |
| Reactivation | → [SG-Reactivation-Items](#sg-reactivation-items) | | | | |
| Visual | → [SG-Visual](#sg-visual) | | | | |
| — | The referenced decision key | `cmmn:decision@externalRef` (definitions level) | engine | no field | #65 |

## Plain task (`cmmn:task`) and its `flowable:type`

Flowable Design has one palette entry per type; the engine reads them as `cmmn:task` with
`@flowable:type`. Without a type, or with an unknown one, the task is an untyped (manual) task.

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| — | Task type | `@flowable:type`: `java`, `script`, `http`, `mail`, `send-event`, `external-worker`, `casePage` | engine | field | #62, #79 |

### Service task (`flowable:type="java"`)

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| General | Model Id, Name, Documentation | → [SG-Header](#sg-header) | | | |
| General | Expression | `@flowable:expression` | engine | field | #62 |
| General | Delegate expression | `@flowable:delegateExpression` | engine | field | #62 |
| General | Class | `@flowable:class` (class, then expression, then delegate expression wins) | engine | field | #62 |
| General | Class fields | `ext:<flowable:field @name @stringValue \| @expression>` or `<flowable:string>` / `<flowable:expression>` children | engine | no field | #65 |
| General | Result variable name | `@flowable:resultVariableName` | engine | field | #62 |
| General | Store as transient variable | `@flowable:storeResultVariableAsTransient` | engine | field | #62 |
| AI | → [SG-AI](#sg-ai) | | | | |
| Control | → [SG-Control-Items](#sg-control-items) | | | | |
| Repetition | → [SG-Repetition-Items](#sg-repetition-items) | | | | |
| Advanced > Execution | all rows of [SG-Execution](#sg-execution) except Blocking | | | | |
| Advanced > Listeners | Lifecycle listeners → [SG-Listeners](#sg-listeners) | | | | |
| Reactivation | → [SG-Reactivation-Items](#sg-reactivation-items) | | | | |
| Visual | → [SG-Visual](#sg-visual) | | | | |
| — | Form key (makes it a form-aware service task) | `@flowable:formKey` | engine | field | #62 |
| — | Form field validation (with a form key) | `@flowable:formFieldValidation` | engine | field | #62 |

### Script task (`flowable:type="script"`)

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| General | Model Id, Name, Documentation | → [SG-Header](#sg-header) | | | |
| General | Script format | `@flowable:scriptFormat` (default `juel` at runtime) | engine | field | #62 |
| General | Script | `ext:<flowable:field name="script">` with `<flowable:string>` | engine | no field | #65 |
| AI | → [SG-AI](#sg-ai) | | | | |
| Variable Mapping | In | `ext:<flowable:in>` | engine | no field | #65 |
| Control | → [SG-Control-Items](#sg-control-items) | | | | |
| Repetition | → [SG-Repetition-Items](#sg-repetition-items) | | | | |
| Details | Result variable name | `@flowable:resultVariableName` | engine | field | #62 |
| Details | Auto store variables | `@flowable:autoStoreVariables` | engine | field | #62 |
| Advanced > Execution | all rows of [SG-Execution](#sg-execution) except Blocking | | | | |
| Advanced > Listeners | Lifecycle listeners → [SG-Listeners](#sg-listeners) | | | | |
| Reactivation | → [SG-Reactivation-Items](#sg-reactivation-items) | | | | |
| Visual | → [SG-Visual](#sg-visual) | | | | |
| — | Do not include variables | `@flowable:doNotIncludeVariables` | engine | field | #62 |

### HTTP task (`flowable:type="http"`)

All request settings are `flowable:field` entries.

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| General | Model Id, Name, Documentation | → [SG-Header](#sg-header) | | | |
| General | Request method (GET / POST / PUT / DELETE / PATCH; required) | `ext:<flowable:field name="requestMethod">` | engine | no field | #65 |
| General | Request headers | field `requestHeaders` | engine | no field | #65 |
| General | Request secure headers | field `requestSecureHeaders` | engine | no field | #65 |
| General | Request URL (required) | field `requestUrl` | engine | no field | #65 |
| General | Request body | field `requestBody` | engine | no field | #65 |
| General | Response variable name | field `responseVariableName` | engine | no field | #65 |
| General | Save response as JSON | field `saveResponseVariableAsJson` | engine | no field | #65 |
| General | Save response as a transient variable | field `saveResponseParametersTransient` | engine | no field | #65 |
| General | Fail status codes | field `failStatusCodes` | engine | no field | #65 |
| General | Handle status codes | field `handleStatusCodes` | engine | no field | #65 |
| AI | → [SG-AI](#sg-ai) | | | | |
| Control | → [SG-Control-Items](#sg-control-items) | | | | |
| Repetition | → [SG-Repetition-Items](#sg-repetition-items) | | | | |
| Details | Request body encoding | field `requestBodyEncoding` | engine | no field | #65 |
| Details | Request timeout | field `requestTimeout` | engine | no field | #65 |
| Details | Disallow redirects | field `disallowRedirects` | engine | no field | #65 |
| Details | Save request variables | field `saveRequestVariables` | engine | no field | #65 |
| Details | Save response details | field `saveResponseParameters` | engine | no field | #65 |
| Details | Result variable prefix | field `resultVariablePrefix` | engine | no field | #65 |
| Details | Ignore exception | field `ignoreException` | engine | no field | #65 |
| Advanced > Execution | all rows of [SG-Execution](#sg-execution) except Blocking | | | | |
| Advanced > Execution | Execute parallel in same transaction | `@flowable:parallelInSameTransaction` | engine | field | #62 |
| Advanced > Listeners | Lifecycle listeners → [SG-Listeners](#sg-listeners) | | | | |
| Reactivation | → [SG-Reactivation-Items](#sg-reactivation-items) | | | | |
| Visual | → [SG-Visual](#sg-visual) | | | | |
| — | Custom behavior class | field `httpActivityBehaviorClass` | engine | no field | #65 |
| — | "Behavior Class" field of our panel | writes `@flowable:class`, which the engine stores but never uses | engine | missing (wrong field) | #65 |
| — | Request handler, response handler | `ext:<flowable:httpRequestHandler>` / `ext:<flowable:httpResponseHandler>` `@class \| @delegateExpression` | engine | no field | #65 |

### Email task (`flowable:type="mail"`)

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| General | Model Id, Name, Documentation | → [SG-Header](#sg-header) | | | |
| General | Email properties | fields `to`, `from`, `cc`, `bcc`, `headers`, `subject`, `text`, `textVar`, `html`, `htmlVar`, `charset`, `ignoreException`, `exceptionVariableName`, `attachments` | engine | no field | #65 |
| AI | → [SG-AI](#sg-ai) | | | | |
| Control | → [SG-Control-Items](#sg-control-items) | | | | |
| Repetition | → [SG-Repetition-Items](#sg-repetition-items) | | | | |
| Advanced > Execution | all rows of [SG-Execution](#sg-execution) except Blocking | | | | |
| Advanced > Listeners | Lifecycle listeners → [SG-Listeners](#sg-listeners) | | | | |
| Reactivation | → [SG-Reactivation-Items](#sg-reactivation-items) | | | | |
| Visual | → [SG-Visual](#sg-visual) | | | | |

### Send event task (`flowable:type="send-event"`)

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| General | Model Id, Name, Documentation | → [SG-Header](#sg-header) | | | |
| General | Send on internal channel | `ext:<flowable:systemChannel>` | engine | field | #62 |
| General | Outbound event: event key | `ext:<flowable:eventType>` | engine | field | #62 |
| General | Outbound event: payload from variables | `ext:<flowable:eventInParameter @source @target>` | engine | field | #62 |
| General | Outbound channel | `ext:<flowable:channelKey>` (expression, comma list allowed) | engine | field | #62 |
| AI | → [SG-AI](#sg-ai) | | | | |
| Control | → [SG-Control-Items](#sg-control-items) | | | | |
| Repetition | → [SG-Repetition-Items](#sg-repetition-items) | | | | |
| Advanced > Execution | Asynchronous, Exclusive, Leave asynchronously, Leave exclusive, Job category, Include in history → [SG-Execution](#sg-execution) | | | | |
| Advanced > Listeners | Lifecycle listeners → [SG-Listeners](#sg-listeners) | | | | |
| Reactivation | → [SG-Reactivation-Items](#sg-reactivation-items) | | | | |
| Visual | → [SG-Visual](#sg-visual) | | | | |

### External worker task (`flowable:type="external-worker"`)

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| General | Model Id, Name, Documentation | → [SG-Header](#sg-header) | | | |
| General | Job topic | `@flowable:topic` | engine | field | #62 |
| General | Exclusive | `@flowable:exclusive` | engine | field | #62 |
| General | Candidate users, candidate groups | to confirm | work | kept | #66 |
| AI | → [SG-AI](#sg-ai) | | | | |
| Variable Mapping | In parameter (empty = all variables sent) | `ext:<flowable:externalWorkerInParameter>` (or `ext:<flowable:in>`) | engine | no field | #65 |
| Variable Mapping | Do not include variables | `@flowable:doNotIncludeVariables` | engine | field | #62 |
| Variable Mapping | Out parameter | `ext:<flowable:externalWorkerOutParameter>` (or `ext:<flowable:out>`) | engine | no field | #65 |
| Control | → [SG-Control-Items](#sg-control-items) | | | | |
| Repetition | → [SG-Repetition-Items](#sg-repetition-items) | | | | |
| Advanced > Execution | Impact on parent completion, Include in history → [SG-Execution](#sg-execution) | | | | |
| Advanced > Listeners | Lifecycle listeners → [SG-Listeners](#sg-listeners) | | | | |
| Reactivation | → [SG-Reactivation-Items](#sg-reactivation-items) | | | | |
| Visual | → [SG-Visual](#sg-visual) | | | | |
| — | Job category | `ext:<flowable:jobCategory>` | engine | kept | #65 |

`flowable:field` on an external worker task makes the deployment fail.

### Case page (`flowable:type="casePage"`)

Docs only. No Control or Repetition groups.

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| General | Model Id, Name, Documentation | → [SG-Header](#sg-header) | | | |
| General | Form reference | `@flowable:formKey` | engine | field | #62 |
| General | In same deployment | `@flowable:sameDeployment` (default true) | engine | field | #62 |
| AI | → [SG-AI](#sg-ai) | | | | |
| Assignment | Candidate users | `@flowable:candidateUsers` | engine | field | #62 |
| Assignment | Candidate groups | `@flowable:candidateGroups` | engine | field | #62 |
| Assignment | Watcher users, watcher groups | to confirm | work | kept | #66 |
| Assignment | Assignee | `@flowable:assignee` | engine | field | #62 |
| Assignment | Owner | `@flowable:owner` | engine | field | #62 |
| Advanced Form | Input and output mapping type and mappings to form | to confirm | work | kept | #66 |
| UI Configuration | Header configuration | to confirm | work | kept | #66 |
| UI Configuration | Icon | `@flowable:icon` | engine | field | #62 |
| UI Configuration | Index, hide save button, per-state access, page elements | to confirm | work | kept | #66 |
| Advanced > Execution | Include in history → [SG-Execution](#sg-execution) | | | | |
| Advanced > Listeners | Lifecycle listeners → [SG-Listeners](#sg-listeners) | | | | |
| Reactivation | → [SG-Reactivation-Items](#sg-reactivation-items) | | | | |
| Visual | → [SG-Visual](#sg-visual) | | | | |
| — | Label | `@flowable:label` | engine | field | #62 |

`flowable:field` on a case page makes the deployment fail.

### Untyped task (no `flowable:type`)

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| General | Model Id, Name, Documentation | → [SG-Header](#sg-header) | | | |
| AI | → [SG-AI](#sg-ai) | | | | |
| Control | → [SG-Control-Items](#sg-control-items) | | | | |
| Repetition | → [SG-Repetition-Items](#sg-repetition-items) | | | | |
| Advanced > Execution | Blocking, Include in history → [SG-Execution](#sg-execution) | | | | |
| Advanced > Listeners | Lifecycle listeners → [SG-Listeners](#sg-listeners) | | | | |
| Reactivation | → [SG-Reactivation-Items](#sg-reactivation-items) | | | | |
| Visual | → [SG-Visual](#sg-visual) | | | | |

### RPA Framework task

Docs only. Not an open-source task type (no matching `flowable:type` in the converter).

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| — | Task type | to confirm | work | kept | #66, #79 |
| General | Job topic, RPA Framework task name, exclusive, candidate users and groups | to confirm | work | kept | #66 |
| Variable Mapping | In parameter, out parameter | to confirm | work | kept | #66 |

Its other groups are the same as the external worker task.

## Milestone

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| General | Model Id, Name, Documentation | → [SG-Header](#sg-header) | | | |
| General | Create milestone variable | `@flowable:milestoneVariable` (a variable name; Flowable Design shows a Boolean) | engine | field | #62 |
| General | Business status | `@flowable:businessStatus` | engine | field | #62 |
| General | Show state | `@flowable:includeInStageOverview` | engine | field | #62 |
| General | Display order | `@flowable:displayOrder` | engine | field | #62 |
| AI | → [SG-AI](#sg-ai) | | | | |
| Control | → [SG-Control-Items](#sg-control-items) | | | | |
| Repetition | → [SG-Repetition-Items](#sg-repetition-items) | | | | |
| Advanced > Execution | Include in history, Impact on parent completion → [SG-Execution](#sg-execution) | | | | |
| Advanced > Listeners | Lifecycle listeners → [SG-Listeners](#sg-listeners) | | | | |
| Reactivation | → [SG-Reactivation-Items](#sg-reactivation-items) | | | | |
| Visual | → [SG-Visual](#sg-visual) | | | | |

## Entry criterion

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| General | Model Id, Name, Documentation | → [SG-Header](#sg-header) | | | |
| General | Condition | sentry `<ifPart><condition>` | engine | field | #62 |
| General | Trigger mode (On event / Event deferred) | sentry `@flowable:triggerMode`: `onEvent` / `default` | engine | field | #62 |
| — | Sentry reference | `@sentryRef` (the engine also accepts `flowable:sentryRef`) | engine | field (set by the modeler) | #62 |

## Exit criterion

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| General | Model Id, Name, Documentation, Condition, Trigger mode | as [Entry criterion](#entry-criterion) | | | |
| Advanced | Exit type (default) | `@flowable:exitType`: `default`, `activeInstances`, `activeAndEnabledInstances` | engine | field | #62 |
| Advanced | Exit event type (exit) | `@flowable:exitEventType`: `exit`, `complete`, `forceComplete` | engine | field | #62 |

## Event listener types

The CMMN palette has the event listener, timer event listener and user event listener. The
signal, variable, intent and reactivate listeners are `cmmn:eventListener` with
`@flowable:eventType`.

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| — | Listener type | `cmmn:eventListener@flowable:eventType`: `signal`, `variable`, `intent`, `reactivate`; none = generic or event registry | engine | field | #62, #80 |

### Timer event listener

Docs only.

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| General | Model Id, Name, Documentation | → [SG-Header](#sg-header) | | | |
| General | Timer expression | `<timerExpression>`: ISO 8601 date, duration, repeat, cron or expression | engine | no field | #65 |
| General | Job category | `ext:<flowable:jobCategory>` | engine | kept | #65 |
| Control | → [SG-Control-Listeners](#sg-control-listeners) | | | | |
| Advanced > Execution | → [SG-Execution-Listeners](#sg-execution-listeners) | | | | |
| Advanced > Details | → [SG-Details-Listeners](#sg-details-listeners) | | | | |
| Advanced > Listeners | Lifecycle listeners → [SG-Listeners](#sg-listeners) | | | | |
| Reactivation | → [SG-Reactivation-Listeners](#sg-reactivation-listeners) | | | | |
| Visual | → [SG-Visual](#sg-visual) | | | | |
| — | Start trigger | `<planItemStartTrigger @sourceRef>` + `<standardEvent>` | engine | no field | #65 |

### User event listener

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| General | Model Id, Name, Documentation | → [SG-Header](#sg-header) | | | |
| General | Start form (and in same deployment, validate start form fields) | to confirm | work | kept | #66 |
| Control | → [SG-Control-Listeners](#sg-control-listeners) | | | | |
| Repetition | → [SG-Repetition-Listeners](#sg-repetition-listeners) | | | | |
| UI Configuration | Action icon, action name, priority, channels | to confirm | work | kept | #66 |
| UI Configuration | Expose as action to object (and as an action message, docs) → [SG-Expose](#sg-expose) | | | | |
| Advanced > Execution | → [SG-Execution-Listeners](#sg-execution-listeners) | | | | |
| Advanced > Details | Available condition, Include in history → [SG-Details-Listeners](#sg-details-listeners) | | | | |
| Advanced > Details | Permission users, permission groups | to confirm | work | kept | #66 |
| Advanced > Listeners | Lifecycle listeners → [SG-Listeners](#sg-listeners) | | | | |
| Reactivation | → [SG-Reactivation-Listeners](#sg-reactivation-listeners) | | | | |
| Visual | → [SG-Visual](#sg-visual) | | | | |
| — | Authorized roles | `@authorizedRoleRefs`: the engine reads a comma list; cmmn-moddle models space-separated references | engine | missing (wrong separator) | #65 |

### Signal event listener

Docs only.

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| General | Model Id, Name, Documentation | → [SG-Header](#sg-header) | | | |
| General | Signal reference | `@flowable:signalRef` (with `@flowable:eventType="signal"`) | engine | field | #62 |
| Control | → [SG-Control-Listeners](#sg-control-listeners) | | | | |
| Repetition | → [SG-Repetition-Listeners](#sg-repetition-listeners) | | | | |
| Advanced > Execution | → [SG-Execution-Listeners](#sg-execution-listeners) | | | | |
| Advanced > Details | → [SG-Details-Listeners](#sg-details-listeners) | | | | |
| Advanced > Listeners | Lifecycle listeners → [SG-Listeners](#sg-listeners) | | | | |
| Reactivation | → [SG-Reactivation-Listeners](#sg-reactivation-listeners) | | | | |
| Visual | → [SG-Visual](#sg-visual) | | | | |

### Variable event listener

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| General | Model Id, Name, Documentation | → [SG-Header](#sg-header) | | | |
| General | Variable name | `@flowable:variableName` (with `@flowable:eventType="variable"`) | engine | field | #62 |
| General | Change type (Create and update) | `@flowable:variableChangeType`: `all`, `create`, `update`, `update-create`; the engine also has `delete`, which Flowable Design doesn't offer | engine | field | #62 |
| Control | → [SG-Control-Listeners](#sg-control-listeners) | | | | |
| Repetition | → [SG-Repetition-Listeners](#sg-repetition-listeners) | | | | |
| Advanced > Execution | → [SG-Execution-Listeners](#sg-execution-listeners) | | | | |
| Advanced > Details | → [SG-Details-Listeners](#sg-details-listeners) | | | | |
| Advanced > Listeners | Lifecycle listeners → [SG-Listeners](#sg-listeners) | | | | |
| Reactivation | → [SG-Reactivation-Listeners](#sg-reactivation-listeners) | | | | |
| Visual | → [SG-Visual](#sg-visual) | | | | |

### Intent event listener

Docs only.

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| General | Model Id, Name, Documentation | → [SG-Header](#sg-header) | | | |
| General | AI instruction | to confirm | work | kept | #66 |
| Advanced > Details | → [SG-Details-Listeners](#sg-details-listeners) | | | | |
| Advanced > Listeners | Lifecycle listeners → [SG-Listeners](#sg-listeners) | | | | |
| Visual | → [SG-Visual](#sg-visual) | | | | |

### Reactivate event listener

Docs only. One per case; two fail the deployment.

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| General | Model Id, Name, Documentation | → [SG-Header](#sg-header) | | | |
| General | Start form | to confirm | work | kept | #66 |
| General | Reactivation available for duration | to confirm | work | kept | #66 |
| Security | Permission users, permission groups | to confirm | work | kept | #66 |
| Advanced > Details | → [SG-Details-Listeners](#sg-details-listeners) | | | | |
| Advanced > Listeners | Lifecycle listeners → [SG-Listeners](#sg-listeners) | | | | |
| Visual | → [SG-Visual](#sg-visual) | | | | |
| — | Default reactivation rule (activate, ignore, default condition) | `ext:<flowable:defaultReactivationRule>` | engine | field | #62 |

### Event listener (generic, event registry)

Docs only.

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| General | Model Id, Name, Documentation | → [SG-Header](#sg-header) | | | |
| General | Persisting content items (enable, item name, variable, transient, list variable) | to confirm | work | kept | #66 |
| General | Inbound event: event key | `ext:<flowable:eventType>` | engine | field | #62 |
| General | Inbound event: correlation parameters | `ext:<flowable:eventCorrelationParameter @name @value>` | engine | field | #62 |
| General | Inbound event: payload to variables | `ext:<flowable:eventOutParameter @source @target @transient>` | engine | field | #62 |
| General | Inbound channel | to confirm | work | kept | #66 |
| Control | → [SG-Control-Listeners](#sg-control-listeners) | | | | |
| Repetition | → [SG-Repetition-Listeners](#sg-repetition-listeners) | | | | |
| Advanced > Execution | → [SG-Execution-Listeners](#sg-execution-listeners) | | | | |
| Advanced > Details | → [SG-Details-Listeners](#sg-details-listeners) | | | | |
| Advanced > Listeners | Lifecycle listeners → [SG-Listeners](#sg-listeners) | | | | |
| Reactivation | → [SG-Reactivation-Listeners](#sg-reactivation-listeners) | | | | |
| Visual | → [SG-Visual](#sg-visual) | | | | |

### Document event listener

Docs only (no property table; the configuration is shared with the BPMN document events).

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| — | Listener type and its document event configuration | to confirm | work | kept | #66, #80 |

## Connector

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| General | Model Id, Name, Documentation | → [SG-Header](#sg-header) | | | |
| General | Standard event (Complete) | `<planItemOnPart><standardEvent>` | engine | field | #62 |
| General | Display name in diagram | to confirm | work | kept | #66, #74 |
| Visual | → [SG-Visual](#sg-visual) (without Background color) | | | | |

## Text annotation

Docs only.

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| General | Model Id, Documentation | `@id`, `<documentation>` | engine | field | #62 |
| General | Text | `<text>` | engine | no field (edited on the canvas) | #65 |
| General | Text format | `@textFormat` | engine | no field | #65 |
| Visual | → [SG-Visual](#sg-visual) (without Background color) | | | | |

## Diagram (DI)

Not in the side bar. Listed because the engine reads Flowable attributes here.

| Group | Field | XML name | Scope | Status | Issue |
|---|---|---|---|---|---|
| — | Label rotation | `cmmndi:CMMNLabel@flowable:rotation` | engine | kept (not typed; not shown in the Extensions tab) | #65 |
| — | Edge dockers | `cmmndi:CMMNEdge/di:extension/<flowable:docker @type @x @y>` (`source` / `target`) | engine | no field (typed as `flowable:Docker`; drawn, not a panel field) | #74 |

---

## Gaps for #65

Engine attributes with no field, kept or wrong, by element:

- **Every task, stage, milestone**: job category (`flowable:jobCategory`), multi-line name (`flowable:element-name`), on transaction of lifecycle listeners, blocking and auto complete in the panel (they're only in the replace menu).
- **Repetition rule**: variable aggregations (`flowable:variableAggregation`, `flowable:variable`).
- **Event listeners**: the whole item control (required, completion neutral, repetition, parent completion, reactivation).
- **Case and plan model**: `definitions@author`, lifecycle listeners on the plan model itself, stage overview attributes on the plan model.
- **Human task**: owner, category, task ID variable, task completer variable, validate form fields, task listener on transaction.
- **Process and decision tasks**: `externalRef` of the referenced `cmmn:process` / `cmmn:decision`.
- **Decision task**: fields `sameDeployment`, `fallbackToDefaultTenant`, `decisionTaskThrowErrorOnNoHits`.
- **Service task**: class fields (`flowable:field`).
- **Script task**: the script body (field `script`), input mapping (`flowable:in`).
- **HTTP task**: all 17 request fields, `httpActivityBehaviorClass`, request and response handlers. Also replace the wrong "Behavior Class" field.
- **Email task**: all 14 mail fields.
- **External worker task**: in and out parameters.
- **Timer event listener**: timer expression, start trigger.
- **User event listener**: authorized roles (and fix the separator).
- **Text annotation**: text format.
- **DI**: label rotation.

## Wrong in our packages

- **`authorizedRoleRefs` separator**: the engine reads and writes a comma list (`UserEventListenerXmlConverter`, `UserEventListenerExport`). cmmn-moddle models it as space-separated role references. A comma list survives a load and save today, but a value created through the moddle would be written with spaces.
- **Namespace spelling**: the converter reads many attributes without checking the namespace, so `flowable:sentryRef`, `flowable:autoComplete`, `flowable:isBlocking`, `flowable:class` on listeners, and un-prefixed `eventType` / `signalRef` / `variableName` / `variableChangeType` all work in the engine. The moddle knows one spelling only; the other is kept as an unknown attribute, and a panel field doesn't see it. The listener case is tracked in #16.
- **`flowable:rotation`** on `cmmndi:CMMNLabel` isn't typed. It's kept on save, with an import warning.
- **`onTransaction`** is typed on lifecycle listeners only. The engine reads it on task listeners too, where it's kept as an unknown attribute.
- **`flowable:jobCategory`** isn't typed. It's kept as a generic extension element, although the engine reads it for jobs of every plan item.
- **HTTP "Behavior Class"**: the field writes `@flowable:class`. The converter stores it without an implementation type, so the engine always uses the default HTTP behavior. The override that works is the field `httpActivityBehaviorClass`.

## Panel fields Flowable ignores

Camunda leftovers that our panel still offers and the Flowable engine never reads:

- Case: `flowable:historyTimeToLive`.
- Human task: `flowable:followUpDate`.
- Case task: `flowable:caseBinding`, `flowable:caseVersion`, `flowable:caseTenantId`.
- Process task: `flowable:processBinding`, `flowable:processVersion`, `flowable:processTenantId`.
- Decision task: `flowable:decisionBinding`, `flowable:decisionVersion`, `flowable:decisionTenantId`, `flowable:mapDecisionResult`, `flowable:resultVariable`.
- Repetition rule: `flowable:repeatOnStandardEvent`.
- Script listener: external `resource` (the engine reads only the inline script).

## Deployment pitfalls

The engine rejects these at deployment; the modeler doesn't warn about any of them:

1. `flowable:field` on a case page or external worker task: the converter throws, because only service tasks, decision tasks and listeners take fields.
2. `flowable:maxInstanceCount="0"` on a repetition rule.
3. More than one `reactivate` event listener in a case.
4. A non-integer `flowable:displayOrder` on a stage or milestone (the converter calls `Integer.valueOf`).

Not a failure, but easy to get wrong: `flowable:sameDeployment` defaults to true on human tasks, case pages and the plan model, and to false on process and case tasks.

## Proposed new issues

Gaps that don't fit #62, #65, #66, #74, #79 or #80:

1. **Remove or flag the panel fields Flowable ignores**: drop the Camunda leftover fields listed above from the panel, and add them to the problems check, so old models still show what will be ignored.
2. **Warn about Flowable deployment pitfalls in the problems view**: checks for the four pitfalls above, plus a script task without a script and an HTTP task without a request method or URL.
3. **Accept every attribute spelling the engine accepts**: extend #16 beyond listeners to criteria (`sentryRef`), stage (`autoComplete`), task (`isBlocking`) and event listeners (un-prefixed `eventType`, `signalRef`, `variableName`, `variableChangeType`), so fields show and edit these values whichever spelling a model uses.

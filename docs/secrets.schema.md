
# Secrets Schema

```
https://ns.adobe.com/helix/pipeline/secrets
```

Secrets passed into the pipeline such as API Keys or configuration settings.

| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Stable | No | Forbidden | Forbidden | [secrets.schema.json](secrets.schema.json) |

# Secrets Properties

| Property | Type | Required | Default | Defined by |
|----------|------|----------|---------|------------|
| [REPO_RAW_ROOT](#repo_raw_root) | `string` | Optional | `"https://raw.githubusercontent.com/"` | Secrets (this schema) |
| `[A-Z0-9_]+` | `string` | Pattern |  | Secrets (this schema) |

## REPO_RAW_ROOT

The Base URL for retrieving raw text files from GitHub

`REPO_RAW_ROOT`
* is optional
* type: `string`
* default: `"https://raw.githubusercontent.com/"`
* defined in this schema

### REPO_RAW_ROOT Type


`string`






## Pattern: `[A-Z0-9_]+`
Applies to all properties that match the regular expression `[A-Z0-9_]+`


`[A-Z0-9_]+`
* is a property pattern
* type: `string`
* defined in this schema

### Pattern [A-Z0-9_]+ Type


`string`






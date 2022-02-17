# Untitled undefined type in MDAST Schema

```txt
https://ns.adobe.com/helix/pipeline/mdast#/properties/referenceType
```

Represents the explicitness of a reference.

| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                      |
| :------------------ | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :-------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [mdast.schema.json\*](mdast.schema.json "open original schema") |

## referenceType Type

unknown

## referenceType Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value         | Explanation                                                         |
| :------------ | :------------------------------------------------------------------ |
| `"shortcut"`  | the reference is implicit, its identifier inferred from its content |
| `"collapsed"` | the reference is explicit, its identifier inferred from its content |
| `"full"`      | the reference is explicit, its identifier explicitly set            |

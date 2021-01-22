# Untitled string in MDAST Schema

```txt
https://ns.adobe.com/helix/pipeline/mdast#/properties/code
```

Icon code

| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                     |
| :------------------ | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [mdast.schema.json*](mdast.schema.json "open original schema") |

## code Type

`string`

## code Constraints

**pattern**: the string must match the following regular expression: 

```regexp
:#*[a-zA-Z_-]+[a-zA-Z0-9]*:
```

[try pattern](https://regexr.com/?expression=%3A%23\*%5Ba-zA-Z\_-%5D%2B%5Ba-zA-Z0-9%5D\*%3A "try regular expression with regexr.com")

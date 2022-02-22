# Untitled boolean in Secrets Schema

```txt
https://ns.adobe.com/helix/pipeline/secrets#/properties/SANITIZE_DOM
```

Sanitize the HTML output to guard against XSS attacks.

**Note:** this flag applies a pretty aggressive DOM filtering that will strip out a lot of HTML that your authors might find useful. The setting is meant for processing truly untrusted inputs, such as comments in a social media site.

| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                          |
| :------------------ | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [secrets.schema.json\*](secrets.schema.json "open original schema") |

## SANITIZE\_DOM Type

`boolean`

# hsl-parser
Parse an HSL color string and output its values in an object or in an array, or test if a string is a valid hsl color string.

## Getting started
Install via npm:

```npm i hsl-parser```

Install via yarn:

`yarn add hsl-parser`

## Usage
```javascript
import hslParser from 'hsl-parser';

hslParser.parse('hsl(120, 20%, 30%)');

// output
// { h: 120, s: 20, l: 30, a: 1 }
```

## Methods
- parse(`hslString`, `asArray`) - parse hsl color into an object or as an array if `asArray` is set to `true`
- isValid(`hslString`) - Test if a hsl color string is valid.

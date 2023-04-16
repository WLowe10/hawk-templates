# Hawk Templates

Hawk Templates allows embedded logic inside of a mustache like template. It uses VM2, hence, this library is **ONLY** usable with  Node.js.

Hawk Templates works with:

* Strings
* Objects
* Arrays
## Installation

Install my-project with npm

```bash
  npm install hawk-templates
```
    
## Usage/Examples

### String Template

```javascript
import { parse } from "hawk-templates";

const template = parse("my favorite number is {{number}}");
const result = template({ number: 17 }) // 5
```

### Object Template

```javascript
import { parse } from "hawk-templates";

const template = parse({
    stats: {
        description: "this video is {{duration}} minutes long"
    }
});

const result = template({ duration: 5 }) // -> { stats: { description: "this video is 5 minutes long" } }
```

### Array Template

```javascript
import { parse } from "hawk-templates";

const template = parse([]);

const result = template({ duration: 5 }) // -> { stats: { description: "this video is 5 minutes long" } }
```

## JavaScript expressions

```javascript
import { parse } from "hawk-templates";

const template = parse("my name is {{name}} and i currently make {{money}} dollars per year. I wish i made {{money * 10}}.");

const result = template({ name: "bob", money: "50000" }) // -> "my name is bob and i currently make 50000 dollars per year. I wish i made 500000.
```
### JS expressions work with any template

## References

### To use a reference to a value, you can use a JSON Pointer to get the value in a template.

```javascript
import { parse } from "hawk-templates";

const template = parse({
    script: {
        "$ref": "/scripts/script1"
    }
});

const result = template({ 
    scripts: {
        script1: {
            src: "console.log('script 1')"
        },
        script2: {
            src: "console.log('script 2')"
        }
    }
}) // -> { script: { src: "console.log('script 1')" } }
```






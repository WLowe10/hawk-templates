import jsonpointer from "jsonpointer";
import { VM } from "vm2";
import { safeParse } from "./helpers";

const context = {
    age: 19,
    name: "john",
    test: {
        height: "50"
    }
};

export const parse = (template: string | object) => {
    if (typeof template !== "string" && typeof template !== "object") return template;

    const handleStringTemplate = (str: string) => {
        const rgx = new RegExp(/{{\s*(.*?)\s*}}/g);

        if (str.startsWith("ref$:")) {
            return (context: any) => {
                const ref = str.split("ref$:")[1];
                const value = jsonpointer.get(context, ref);

                return value;
            };
        } else {
            const matches = [...str.matchAll(rgx)];

            return (context: any) => {
                const vm = new VM({
                    sandbox: context
                });

                let newVal = str;

                matches.forEach(([temp, val, idx]) => {
                    if (!val) return;

                    const result = vm.run(val);
                    newVal = newVal.replace(temp, result);
                })

                return safeParse(newVal);
            }
        }
    };
};

const template = parse("hi my name is {{name}} and i am {{ age + 1 }} years old. my height is {{test.height}}");
// const template = parse("ref$:/age")
// const template = parse("/age")
// console.log(template(context))

// const obj = {
//     deps: {
//         scripts: {
//             brow1: "adwadwdwcjdncjdn"
//         }
//     }
// };

// console.log(jsonpointer.get(obj, "/deps/scripts/brow1"))
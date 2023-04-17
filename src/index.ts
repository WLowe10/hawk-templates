import jsonpointer from "jsonpointer";
import { template as tp, traverseEditObject } from "./helpers";

export const parse = (template: string | object) => {
    if (typeof template !== "string" && typeof template !== "object") return template;

    const handleStringTemplate = (strTemplate: string) => {
        return (context: object) => {
            return tp(strTemplate, context);
        }
    };   

    const handleObjectTemplate = (objTemplate: object) => {
        return (context: object): any => {
            if (Array.isArray(objTemplate)) {
                return objTemplate.map((tmp) => {
                    if (typeof tmp == "string") {
                        return handleStringTemplate(tmp)(context);
                    }

                    if (typeof tmp == "object") {
                        return handleObjectTemplate(tmp)(context);
                    }
                })
            };

            return traverseEditObject(objTemplate, (field: { type: "ref" | "string", ref: "string", string: "string" }) => {
                if (field.type == "ref") {
                    return jsonpointer.get(context, field.ref);
                };

                if (field.type == "string") {
                    return tp(field.string, context);
                };
            })
        }
    };

    return typeof template == "string" ? handleStringTemplate(template) : handleObjectTemplate(template);
}

// const template = parse({
//     script: {
//         "$ref": "/scripts/script1"
//     }
// })

// const result = template({ 
//     scripts: {
//         script1: {
//             src: "console.log('script 1')"
//         }
//     }
// });

//doesnt have the number in a string since the safeParse function called in the template
const template = parse(["yes", "{{age || Math.random().toString()}}"])

console.log(template({
    age: 0
}));

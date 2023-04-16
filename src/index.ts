import jsonpointer from "jsonpointer";
import { template as tp, traverseEditObject } from "./helpers";

export const parse = (template: string | object) => {
    if (typeof template !== "string" && typeof template !== "object") return template;

    const handleStringTemplate = (strTemplate: string) => {
        return (context: any) => {
            return tp(strTemplate, context);
        }
    };   

    const handleObjectTemplate = (objTemplate: object) => {
        return (context: any) => {
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

const template = parse({
    script: {
        "$ref": "/scripts/script1"
    }
})

const result = template({ 
    scripts: {
        script1: {
            src: "console.log('script 1')"
        }
    }
});

console.log(result);
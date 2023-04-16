import jsonpointer from "jsonpointer";
import { template as tp, safeParse, traverseEditObject, objectPath } from "./helpers";

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
                } else if (field.type == "string") {
                    return tp(field.string, context);
                }
            })
        }
    };

    return typeof template == "string" ? handleStringTemplate(template) : handleObjectTemplate(template);
}
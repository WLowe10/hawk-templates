import { VM } from "vm2";
import { safeParse } from "./safe-parse.helper";

export const template = (template: string, context: object) => {
    const rgx = new RegExp(/{{\s*(.*?)\s*}}/g);
    const matches = [...template.matchAll(rgx)];
    let newVal = template;

    matches.forEach(([temp, val]) => {
        if (!val) return;
        let result = null;

        try {
            const vm = new VM({
                sandbox: context,
                allowAsync: false,
            });

            result = vm.run(val);
        } catch {}

        newVal = newVal.replace(temp, result);
    })

    return safeParse(newVal);
}
export const traverseEditObject = (obj: Record<string, any>, updateFunc: (field: any) => void): any => {
    let newObj = obj;

    for (const prop in obj) {
        const field = obj[prop];

        if (typeof field === "object") {
            if (field["$ref"]) {
                newObj[prop] = updateFunc({
                    type: "ref",
                    ref: field["$ref"]
                }) 
            } else {
                newObj[prop] = traverseEditObject(field, updateFunc);
            }
        } else {
            newObj[prop] = updateFunc({
                type: "string",
                string: field
            });
        }
    }

    return newObj;
};
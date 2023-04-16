export const traverseEditObject = (obj: any, updateFunc: (field: any) => void): any => {
    let newObj = obj;

    for (const prop in obj) {
        const field = obj[prop];

        if (typeof field === "object") {
            newObj[prop] = traverseEditObject(field, updateFunc);
        } else {
            newObj[prop] = updateFunc(field);
        }
    }

    return newObj;
};
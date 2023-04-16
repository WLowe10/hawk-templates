export const objectPath = (object: any, path: string) => {
    const levels = path.split(".");
    let current = object;

    for (let i = 0; i < levels.length; i++) {
        const lvl = levels[i];

        current = current[lvl];

        if (!current) {
            current = null;
            break;
        }
    }

    return current;
};
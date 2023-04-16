export const safeParse = (target: string) => {
    if (typeof target !== "string") return target;

    const num = Number(target);
    if (!isNaN(num)) {
        return num;
    };

    try {
        const result = JSON.parse(target);
        return result;
    } catch {
        return target;
    }
};
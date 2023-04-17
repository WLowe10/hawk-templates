import { parse } from "./index";

describe("Hawk-templates Test", () => {
    const context = {
        name: "joe",
        age: 50,
        stats: {
            height: 70,
        },
        testArr: ["one", 2, "three"]
    };

    test("String template works", () => {
        const template = parse("my name is {{name}}");
        const result = template(context);

        expect(result).toBe(`my name is ${context.name}`)
    })

    test("String template should resolve a number if there is an alone number", () => {
        const template = parse("{{age}}");
        const result = template(context);

        expect(result).toBe(context.age);
    })

    test("Template works with a nested object", () => {
        const template = parse({
            name: {
                first: "{{name}}"
            },
            age: "{{age}}",
            height: {
                number: "{{stats.height}}",
                description: "{{stats.height}} inches tall"
            }
        });
        const result = template(context);

        expect(result).toEqual({
            name: {
                first: context.name
            },
            age: context.age,
            height: {
                number: context.stats.height,
                description: `${context.stats.height} inches tall`
            }
        });
    });

    test("template works with js expressions", () => {
        const template = parse("{{age + name}}");
        const result = template(context);
    
        expect(result).toBe(context.age + context.name)
    });

    test("template works with js expressions and parsing the number", () => {
        const template = parse("{{age * 50}}");
        const result = template(context);
    
        expect(result).toBe(context.age * 50);
    });

    test("template works using a reference at root level", () => {
        const template = parse({
            "$ref": "/name"
        });
        const result = template(context);

        expect(result).toBe(context.name);
    })

    test("template works using a reference nested in an object", () => {
        const template = parse({
            one: {
                two: {
                    "$ref": "/name"
                }
            }
        });
        const result = template(context);

        expect(result).toEqual({
            one: {
                two: context.name
            }
        });
    })

    test("template works with arrays", () => {
        const template = parse(["one", "{{age}}"]);
        const result = template(context);

        expect(result).toEqual(["one", context.age]);
    })

    // test("template works with editing a object", () => {
    //     const template = parse(["one", "{{age}}"]);
    //     const result = template(context);

    //     expect(result).toEqual(["one", context.age]);
    // })

    test("stress test", () => {
        const template = parse([
            { "$ref": "/name" }, 
            {
                test: {
                    test: {
                        test: {
                            arr: {
                                items: ["age: {{age}}", { "$ref": "/stats" }]
                            },
                            height: {
                                "$ref": "/stats/height"
                            }
                        }
                    }
                }
            }
        ]);
        const result = template(context);

        expect(result).toEqual([
            context.name,
            {
                test: {
                    test: {
                        test: {
                            arr: {
                                items: [`age: ${context.age}`, context.stats]
                            },
                            height: context.stats.height
                        }
                    }
                }
            }
        ]);
    })
})
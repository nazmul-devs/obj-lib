/* ----------------------------------------------------
 * OBJECT UTILITY LIBRARY (Production Ready)
 * Scalable, Modular, Useful for Any TS/Node Project
 * --------------------------------------------------*/

export class ObjectUtils {
    /* ---------------------------------------
     * BASIC CHECKS
     * ------------------------------------- */

    // Check if value is an object (not array, not null)
    static isObject(value: unknown): value is Record<string, any> {
        return typeof value === "object" && value !== null && !Array.isArray(value);
    }

    // Check if value is empty object
    static isEmpty(obj: any): boolean {
        return ObjectUtils.isObject(obj) && Object.keys(obj).length === 0;
    }

    // Removes undefined keys (deep)
    static clean<T>(obj: T): T {
        if (!ObjectUtils.isObject(obj)) return obj;

        return Object.entries(obj).reduce((acc: any, [key, value]) => {
            if (value !== undefined) {
                acc[key] = ObjectUtils.isObject(value) ? ObjectUtils.clean(value) : value;
            }
            return acc;
        }, {}) as T;
    }

    /* ---------------------------------------
     * DEEP CLONE + MERGE
     * ------------------------------------- */

    // Fast deep clone
    static clone<T>(value: T): T {
        return JSON.parse(JSON.stringify(value));
    }

    // Deep merge (obj2 overrides obj1)
    static merge<T extends object, U extends object>(obj1: T, obj2: U): T & U {
        const result = { ...obj1 };

        for (const key of Object.keys(obj2)) {
            const val = (obj2 as any)[key];

            if (ObjectUtils.isObject(val) && ObjectUtils.isObject((obj1 as any)[key])) {
                (result as any)[key] = ObjectUtils.merge((obj1 as any)[key], val);
            } else {
                (result as any)[key] = val;
            }
        }

        return result as T & U;
    }

    /* ---------------------------------------
     * SAFE GET / SET
     * ------------------------------------- */

    static get<T = any>(obj: any, path: string, defaultValue?: T): T {
        try {
            const value = path.split(".").reduce((acc, key) => acc?.[key], obj);
            return value === undefined ? (defaultValue as T) : value;
        } catch {
            return defaultValue as T;
        }
    }

    static set(obj: any, path: string, value: any): any {
        const keys = path.split(".");
        let current = obj;

        keys.forEach((key, index) => {
            if (index === keys.length - 1) {
                current[key] = value;
            } else {
                if (!current[key] || !ObjectUtils.isObject(current[key])) {
                    current[key] = {};
                }
                current = current[key];
            }
        });

        return obj;
    }

    /* ---------------------------------------
     * OBJECT DIFF
     * ------------------------------------- */

    static diff(obj1: any, obj2: any): Record<string, any> {
        const result: any = {};

        const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

        for (const key of keys) {
            if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
                result[key] = { before: obj1[key], after: obj2[key] };
            }
        }
        return result;
    }

    /* ---------------------------------------
     * PICK / OMIT
     * ------------------------------------- */

    static pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
        return keys.reduce((acc, key) => {
            acc[key] = obj[key];
            return acc;
        }, {} as Pick<T, K>);
    }

    static omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
        const result = { ...obj };
        keys.forEach((key) => delete result[key]);
        return result;
    }

    /* ---------------------------------------
     * TYPE GUARDS
     * ------------------------------------- */

    static isNullOrUndefined(value: any): boolean {
        return value === null || value === undefined;
    }

    static isPrimitive(value: any): boolean {
        return value === null || (typeof value !== "object" && typeof value !== "function");
    }

    /* ---------------------------------------
     * TRANSFORMATIONS
     * ------------------------------------- */

    static keysToCamel(obj: any): any {
        if (!ObjectUtils.isObject(obj)) return obj;

        const toCamel = (s: string) => s.replace(/([-_][a-z])/g, g => g.toUpperCase().replace(/[-_]/, ""));

        return Object.fromEntries(
            Object.entries(obj).map(([key, val]) => {
                const newKey = toCamel(key);
                const newVal = ObjectUtils.isObject(val) ? ObjectUtils.keysToCamel(val) : val;
                return [newKey, newVal];
            })
        );
    }

    static keysToSnake(obj: any): any {
        if (!ObjectUtils.isObject(obj)) return obj;

        const toSnake = (s: string) => s.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

        return Object.fromEntries(
            Object.entries(obj).map(([key, val]) => {
                const newKey = toSnake(key);
                const newVal = ObjectUtils.isObject(val) ? ObjectUtils.keysToSnake(val) : val;
                return [newKey, newVal];
            })
        );
    }

    /* ---------------------------------------
     * IMMUTABLE UPDATE (like Redux)
     * ------------------------------------- */

    static update<T extends object>(obj: T, patch: Partial<T>): T {
        return { ...obj, ...patch };
    }

    /* ---------------------------------------
     * DEEP FREEZE (make object immutable)
     * ------------------------------------- */

    static freeze<T>(obj: T): T {
        Object.freeze(obj);

        Object.getOwnPropertyNames(obj).forEach((prop) => {
            const value = (obj as any)[prop];
            if (ObjectUtils.isObject(value) && !Object.isFrozen(value)) {
                ObjectUtils.freeze(value);
            }
        });

        return obj;
    }

    /* ---------------------------------------
     * RANDOM UTILITIES
     * ------------------------------------- */

    static trimStrings(obj: any): any {
        if (!ObjectUtils.isObject(obj)) return obj;

        return Object.fromEntries(
            Object.entries(obj).map(([k, v]) => [
                k,
                typeof v === "string" ? v.trim() : ObjectUtils.isObject(v) ? ObjectUtils.trimStrings(v) : v
            ])
        );
    }

    static flatten(obj: any, prefix = ""): Record<string, any> {
        let result: any = {};

        for (const key in obj) {
            const newKey = prefix ? `${prefix}.${key}` : key;

            if (ObjectUtils.isObject(obj[key])) {
                result = { ...result, ...ObjectUtils.flatten(obj[key], newKey) };
            } else {
                result[newKey] = obj[key];
            }
        }
        return result;
    }

    static unflatten(flatObj: Record<string, any>): any {
        const result: any = {};

        for (const key in flatObj) {
            ObjectUtils.set(result, key, flatObj[key]);
        }
        return result;
    }
}

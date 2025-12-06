/**
 * Checks if a value is a plain object.
 */
export function isObject(value: any): value is Record<string, any> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Checks if a value is an empty object or array.
 */
export function isEmpty(value: any): boolean {
    if (value == null) return true;
    if (Array.isArray(value) || typeof value === 'string') return value.length === 0;
    if (isObject(value)) return Object.keys(value).length === 0;
    return false;
}



// Removes undefined keys (deep)
export const clean = <T>(obj: T): T => {
    if (!isObject(obj)) return obj;

    return Object.entries(obj).reduce((acc: any, [key, value]) => {
        if (value !== undefined) {
            acc[key] = isObject(value) ? clean(value) : value;
        }
        return acc;
    }, {}) as T;
}


/**
 * Creates a deep copy of a value.
 */
export function deepClone<T>(value: T): T {
    if (value === null || typeof value !== 'object') {
        return value;
    }

    if (Array.isArray(value)) {
        return value.map((item) => deepClone(item)) as unknown as T;
    }

    if (value instanceof Date) {
        return new Date(value.getTime()) as unknown as T;
    }

    if (value instanceof RegExp) {
        return new RegExp(value.source, value.flags) as unknown as T;
    }

    const copy = {} as T;
    for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
            (copy as any)[key] = deepClone((value as any)[key]);
        }
    }
    return copy;
}

/**
 * Deeply merges two objects.
 */
export function deepMerge<T extends Record<string, any>, U extends Record<string, any>>(target: T, source: U): T & U {
    const output = deepClone(target) as any;
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    Object.assign(output, { [key]: source[key] });
                } else {
                    output[key] = deepMerge(target[key], source[key]);
                }
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }
    return output;
}

/**
 * Gets a value from an object at a specific path.
 */
export function get(obj: any, path: string | string[], defaultValue?: any): any {
    const keys = Array.isArray(path) ? path : path.replace(/\[(\d+)\]/g, '.$1').split('.');
    let result = obj;
    for (const key of keys) {
        result = result?.[key];
        if (result === undefined) return defaultValue;
    }
    return result === undefined ? defaultValue : result;
}

/**
 * Sets a value on an object at a specific path.
 */
export function set(obj: any, path: string | string[], value: any): void {
    const keys = Array.isArray(path) ? path : path.replace(/\[(\d+)\]/g, '.$1').split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!(key in current) || !isObject(current[key])) {
            current[key] = /^\d+$/.test(keys[i + 1]) ? [] : {};
        }
        current = current[key];
    }
    current[keys[keys.length - 1]] = value;
}







// Fast deep clone
export const clone = <T>(value: T): T => {
    return JSON.parse(JSON.stringify(value));
}








/**
 * Creates an object composed of the picked object properties.
 */
export function pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;
    keys.forEach(key => {
        if (key in obj) {
            result[key] = obj[key];
        }
    });
    return result;
}

/**
 * Creates an object composed of the object properties not omitted.
 */
export function omit<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    const result = { ...obj };
    keys.forEach(key => {
        delete result[key];
    });
    return result;
}

/**
 * Checks if a path exists in an object.
 */
export function has(obj: any, path: string | string[]): boolean {
    const keys = Array.isArray(path) ? path : path.replace(/\[(\d+)\]/g, '.$1').split('.');
    let current = obj;
    for (const key of keys) {
        if (!isObject(current) || !(key in current)) {
            return false;
        }
        current = current[key];
    }
    return true;
}

/**
 * Performs a deep comparison between two values to determine if they are equivalent.
 */
export function isEqual(a: any, b: any): boolean {
    if (a === b) return true;

    if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime();
    }

    if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) {
        return a === b;
    }

    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (!isEqual(a[i], b[i])) return false;
        }
        return true;
    }

    if (isObject(a) && isObject(b)) {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length) return false;
        for (const key of keysA) {
            if (!keysB.includes(key) || !isEqual(a[key], b[key])) return false;
        }
        return true;
    }

    return false;
}




/* ---------------------------------------
 * OBJECT DIFF
 * ------------------------------------- */

export const diff = (obj1: any, obj2: any): Record<string, any> => {
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
 * TYPE GUARDS
 * ------------------------------------- */

export const isNullOrUndefined = (value: any): boolean => {
    return value === null || value === undefined;
}

export const isPrimitive = (value: any): boolean => {
    return value === null || (typeof value !== "object" && typeof value !== "function");
}


/* ---------------------------------------
 * TRANSFORMATIONS
 * ------------------------------------- */

export const keysToCamel = (obj: any): any => {
    if (!isObject(obj)) return obj;

    const toCamel = (s: string) => s.replace(/([-_][a-z])/g, g => g.toUpperCase().replace(/[-_]/, ""));

    return Object.fromEntries(
        Object.entries(obj).map(([key, val]) => {
            const newKey = toCamel(key);
            const newVal = isObject(val) ? keysToCamel(val) : val;
            return [newKey, newVal];
        })
    );
}

export const keysToSnake = (obj: any): any => {
    if (!isObject(obj)) return obj;

    const toSnake = (s: string) => s.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

    return Object.fromEntries(
        Object.entries(obj).map(([key, val]) => {
            const newKey = toSnake(key);
            const newVal = isObject(val) ? keysToSnake(val) : val;
            return [newKey, newVal];
        })
    );
}

/* ---------------------------------------
 * IMMUTABLE UPDATE (like Redux)
 * ------------------------------------- */

export const update = (obj: any, patch: any): any => {
    return { ...obj, ...patch };
}

/* ---------------------------------------
 * DEEP FREEZE (make object immutable)
 * ------------------------------------- */

export const freeze = (obj: any): any => {
    Object.freeze(obj);

    Object.getOwnPropertyNames(obj).forEach((prop) => {
        const value = (obj as any)[prop];
        if (isObject(value) && !Object.isFrozen(value)) {
            freeze(value);
        }
    });

    return obj;
}

/* ---------------------------------------
 * RANDOM UTILITIES
 * ------------------------------------- */

export const trimStrings = (obj: any): any => {
    if (!isObject(obj)) return obj;

    return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [
            k,
            typeof v === "string" ? v.trim() : isObject(v) ? trimStrings(v) : v
        ])
    );
}

export const flatten = (obj: any, prefix = ""): Record<string, any> => {
    let result: any = {};

    for (const key in obj) {
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (isObject(obj[key])) {
            result = { ...result, ...flatten(obj[key], newKey) };
        } else {
            result[newKey] = obj[key];
        }
    }
    return result;
}

export const unflatten = (flatObj: Record<string, any>): any => {
    const result: any = {};

    for (const key in flatObj) {
        set(result, key, flatObj[key]);
    }
    return result;
}
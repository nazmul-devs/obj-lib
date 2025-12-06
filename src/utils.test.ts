import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
    deepClone, deepMerge, get, set, pick, omit, has, isEmpty, isEqual, isObject,
    clean, keysToCamel, keysToSnake, freeze, trimStrings, flatten, unflatten, clone
} from './utils';

describe('obj-lib tests', () => {

    describe('deepClone', () => {
        it('should deep clone an object', () => {
            const original = { a: 1, b: { c: 2 } };
            const cloneObj = deepClone(original);
            assert.notStrictEqual(original, cloneObj);
            assert.deepStrictEqual(original, cloneObj);
            assert.notStrictEqual(original.b, cloneObj.b);
        });

        it('should handle arrays', () => {
            const original = [1, [2, 3]];
            const cloneObj = deepClone(original);
            assert.notStrictEqual(original, cloneObj);
            assert.deepStrictEqual(original, cloneObj);
        });
    });

    describe('clone (fast)', () => {
        it('should clone using JSON parse/stringify', () => {
            const original = { a: 1, b: { c: 2 } };
            const cloned = clone(original);
            assert.deepStrictEqual(original, cloned);
            assert.notStrictEqual(original, cloned);
        });
    });

    describe('deepMerge', () => {
        it('should merge two objects', () => {
            const obj1 = { a: 1, b: { x: 1 } };
            const obj2 = { b: { y: 2 }, c: 3 };
            const merged = deepMerge(obj1, obj2);
            assert.deepStrictEqual(merged, { a: 1, b: { x: 1, y: 2 }, c: 3 });
        });
    });

    describe('get', () => {
        it('should get value from path', () => {
            const obj = { a: { b: { c: 3 } } };
            assert.strictEqual(get(obj, 'a.b.c'), 3);
        });

        it('should return default value if not found', () => {
            const obj = { a: 1 };
            assert.strictEqual(get(obj, 'b', 'default'), 'default');
        });
    });

    describe('set', () => {
        it('should set value at path', () => {
            const obj: any = {};
            set(obj, 'a.b.c', 3);
            assert.deepStrictEqual(obj, { a: { b: { c: 3 } } });
        });
    });


    describe('pick', () => {
        it('should pick keys', () => {
            const obj = { a: 1, b: 2, c: 3 };
            const picked = pick(obj, ['a', 'c']);
            assert.deepStrictEqual(picked, { a: 1, c: 3 });
        });
    });

    describe('omit', () => {
        it('should omit keys', () => {
            const obj = { a: 1, b: 2, c: 3 };
            const omitted = omit(obj, ['b']);
            assert.deepStrictEqual(omitted, { a: 1, c: 3 });
        });
    });

    describe('has', () => {
        it('should return true if path exists', () => {
            const obj = { a: { b: 2 } };
            assert.strictEqual(has(obj, 'a.b'), true);
        });

        it('should return false if path does not exist', () => {
            const obj = { a: 1 };
            assert.strictEqual(has(obj, 'a.b'), false);
        });
    });

    describe('isEmpty', () => {
        it('should return true for empty object', () => {
            assert.strictEqual(isEmpty({}), true);
        });
        it('should return true for empty array', () => {
            assert.strictEqual(isEmpty([]), true);
        });
        it('should return true for null/undefined', () => {
            assert.strictEqual(isEmpty(null), true);
            assert.strictEqual(isEmpty(undefined), true);
        });
        it('should return false for non-empty object', () => {
            assert.strictEqual(isEmpty({ a: 1 }), false);
        });
    });

    describe('isEqual', () => {
        it('should return true for deep equal objects', () => {
            assert.strictEqual(isEqual({ a: 1 }, { a: 1 }), true);
        });
        it('should return false for different objects', () => {
            assert.strictEqual(isEqual({ a: 1 }, { a: 2 }), false);
        });
    });

    describe('isObject', () => {
        it('should return true for plain object', () => {
            assert.strictEqual(isObject({}), true);
        });
        it('should return false for array', () => {
            assert.strictEqual(isObject([]), false);
        });
        it('should return false for null', () => {
            assert.strictEqual(isObject(null), false);
        });
    });

    describe('clean', () => {
        it('should remove undefined keys recursively', () => {
            const obj = { a: 1, b: undefined, c: { d: 2, e: undefined } };
            const cleaned = clean(obj);
            assert.deepStrictEqual(cleaned, { a: 1, c: { d: 2 } });
        });
    });

    describe('keysToCamel', () => {
        it('should convert keys to camelCase recursively', () => {
            const obj = { my_key: 1, nested_obj: { inner_key: 2 } };
            const converted = keysToCamel(obj);
            assert.deepStrictEqual(converted, { myKey: 1, nestedObj: { innerKey: 2 } });
        });
    });

    describe('keysToSnake', () => {
        it('should convert keys to snake_case recursively', () => {
            const obj = { myKey: 1, nestedObj: { innerKey: 2 } };
            const converted = keysToSnake(obj);
            assert.deepStrictEqual(converted, { my_key: 1, nested_obj: { inner_key: 2 } });
        });
    });

    describe('trimStrings', () => {
        it('should trim strings recursively', () => {
            const obj = { a: '  hello  ', b: { c: '  world  ' }, d: 123 };
            const trimmed = trimStrings(obj);
            assert.deepStrictEqual(trimmed, { a: 'hello', b: { c: 'world' }, d: 123 });
        });
    });

    describe('flatten', () => {
        it('should flatten nested object', () => {
            const obj = { a: 1, b: { c: 2, d: { e: 3 } } };
            const flattened = flatten(obj);
            assert.deepStrictEqual(flattened, { 'a': 1, 'b.c': 2, 'b.d.e': 3 });
        });
    });

    describe('unflatten', () => {
        it('should unflatten object', () => {
            const obj = { 'a': 1, 'b.c': 2, 'b.d.e': 3 };
            const unflattened = unflatten(obj);
            assert.deepStrictEqual(unflattened, { a: 1, b: { c: 2, d: { e: 3 } } });
        });
    });

    describe('freeze', () => {
        it('should freeze object recursively', () => {
            const obj = { a: 1, b: { c: 2 } };
            const frozen = freeze(obj);
            assert.strictEqual(Object.isFrozen(frozen), true);
            assert.strictEqual(Object.isFrozen(frozen.b), true);

            try {
                (frozen as any).a = 2;
            } catch (e) {
                // Expected error in strict mode
            }
            assert.strictEqual(frozen.a, 1);
        });
    });

});

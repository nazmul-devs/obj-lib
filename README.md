# obj-lib

A lightweight, zero-dependency object utility library for Node.js and the browser.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **Zero dependencies**: Keeps your project light.
- **TypeScript support**: Built with TypeScript for full type safety.
- **Common utilities**: `deepClone`, `deepMerge`, `get`, `set`, `pick`, `omit`, and more.

## Installation

Install using your preferred package manager:

### npm

```bash
npm install obj-lib
```

### Yarn

```bash
yarn add obj-lib
```

### pnpm

```bash
pnpm add obj-lib
```

## Usage

Import the functions you need from the package:

```typescript
import { deepClone, get, set, deepMerge } from 'obj-lib';

// Deep Clone
const original = { a: 1, b: { c: 2 } };
const copy = deepClone(original);
console.log(copy); // { a: 1, b: { c: 2 } }

// Get
const obj = { a: { b: { c: 3 } } };
const value = get(obj, 'a.b.c');
console.log(value); // 3

// Set
const target = {};
set(target, 'x.y.z', 42);
console.log(target); // { x: { y: { z: 42 } } }

// Deep Merge
const obj1 = { a: 1, b: { x: 1 } };
const obj2 = { b: { y: 2 }, c: 3 };
const merged = deepMerge(obj1, obj2);
console.log(merged); // { a: 1, b: { x: 1, y: 2 }, c: 3 }
```

## API Reference

### `clean<T>(obj: T): T`
Removes `undefined` keys from an object recursively.

### `diff(obj1: any, obj2: any): Record<string, any>`
Returns a difference object showing keys that have changed between two objects.

### `flatten(obj: any, prefix?: string): Record<string, any>`
Flattens a nested object into a single level object with dot-separated keys.

### `unflatten(flatObj: Record<string, any>): any`
Unflattens a dot-separated key object back into a nested object.

### `keysToCamel(obj: any): any`
Recursively transforms object keys to camelCase.

### `keysToSnake(obj: any): any`
Recursively transforms object keys to snake_case.

### `freeze<T>(obj: T): T`
Deeply freezes an object to make it immutable.

### `trimStrings(obj: any): any`
Recursively trims all string values in an object.

### `update<T>(obj: T, patch: Partial<T>): T`
Returns a new object with the patch applied (shallow merge), like Redux.

### `isNullOrUndefined(value: any): boolean`
Checks if a value is `null` or `undefined`.

### `isPrimitive(value: any): boolean`
Checks if a value is a primitive (not object or function, includes null).

### `deepClone<T>(value: T): T`
Creates a deep copy of a value. Handles objects, arrays, Dates, and RegExps.

### `clone<T>(value: T): T`
Fast deep clone using `JSON.parse(JSON.stringify(value))`. Note: Does not handle Dates or RegExps correctly.


### `deepMerge<T, U>(target: T, source: U): T & U`
Deeply merges two objects. Arrays and other non-mergable types are overwritten.

### `get(obj: any, path: string | string[], defaultValue?: any): any`
Gets a value from an object at a specific path. Path can be a dot-separated string or an array of keys.

### `set(obj: any, path: string | string[], value: any): void`
Sets a value on an object at a specific path. Creates nested objects/arrays as needed.

### `pick<T, K>(obj: T, keys: K[]): Pick<T, K>`
Creates an object composed of the picked object properties.

### `omit<T, K>(obj: T, keys: K[]): Omit<T, K>`
Creates an object composed of the object properties not omitted.

### `has(obj: any, path: string | string[]): boolean`
Checks if a path exists in an object.

### `isEmpty(value: any): boolean`
Checks if a value is an empty object, array, or string.

### `isEqual(a: any, b: any): boolean`
Performs a deep comparison between two values.

### `isObject(value: any): boolean`
Checks if a value is a plain object.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

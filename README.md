# Rat

> A module that provides support for fractions and rational number arithmetic

## Usage

### Avoid floating-point error

```js
import { Rat } from "https://deno.land/x/rat/mod.ts";

0.1 + 0.2;                              // 0.30000000000000004
Rat("0.1").add("0.2");                  // 3/10

1 / 49 * 49;                            // 0.9999999999999999
Rat("1").div(49).mul(49); // 1/1
```

### Create a new instance of Rat

```js
import { Rat } from "https://deno.land/x/rat/mod.ts";

const two = Rat("2");           // 2/1
const oneHalf = Rat("1/2");     // 1/2
const oneQuarter = Rat("0.25"); // 1/4
const a = Rat("-2/10");         // -1/5
const b = Rat(3n, -4n);         // -3/4
```

Note that `Rat` instances are immutable and canonical. `Rat` uses `BigInt` internally to represent rational numbers as *numerator / denominator*.

## API

```ts
interface RatInstance {
  /** The numerator of `this` in lowest term. */
  readonly num: bigint;
  /** The denominator of `this` in lowest term; it is always > 0. */
  readonly denom: bigint;
  /** -1 if `this < 0`; 0 if `this = 0`; 1 if `this > 0` */
  readonly sign: -1 | 0 | 1;
  /** Return `|this|` */
  abs(): Rat;
  /** Return `-this` */
  neg(): Rat;
  /** Return `1 / this` */
  inv(): Rat;
  /** Return `this + r` */
  add(r: Rat | bigint | number | string): Rat;
  /** Return `this - r` */
  sub(r: Rat | bigint | number | string): Rat;
  /** Return `this * r` */
  mul(r: Rat | bigint | number | string): Rat;
  /** Return `this / r` */
  div(r: Rat | bigint | number | string): Rat;
  /** Return -1 if `this < r`; 0 if `this = r`; 1 if `this > r` */
  cmp(r: Rat | bigint | number | string): -1 | 0 | 1;
  /** Return the greatest int `<= this` */
  floor(): bigint;
  /** Return the power of `this`, raised to `exp` */
  pow(exp: bigint | number | string): Rat;
}
```

```ts
interface RatConstructor {
  /** Rat("0") */
  zero: Rat;
  /** Rat("1") */
  one: Rat;
  (value: Rat | bigint | number | string): Rat;
  (num: bigint | number | string, denom: bigint | number | string): Rat;
  isRat(r: unknown): r is Rat;
}
```

type BigIntLike = bigint | number | string;
type RatLike = Rat | BigIntLike;

const abs = (a: bigint): bigint => a < 0n ? -a : a;
const cmp = (a: bigint, b: bigint) => a > b ? 1 : a === b ? 0 : -1;
const gcd = (a: bigint, b: bigint): bigint => {
  a = abs(a);
  b = abs(b);
  while (b) {
    const c = b;
    b = a % b;
    a = c;
  }
  return a;
};

export interface Rat {
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
  add(r: RatLike): Rat;
  /** Return `this - r` */
  sub(r: RatLike): Rat;
  /** Return `this * r` */
  mul(r: RatLike): Rat;
  /** Return `this / r` */
  div(r: RatLike): Rat;
  /** Return -1 if `this < r`; 0 if `this = r`; 1 if `this > r` */
  cmp(r: RatLike): -1 | 0 | 1;
  /** Return the greatest int `<= this` */
  floor(): bigint;
  /** Return the power of `this`, raised to `exp` */
  pow(exp: BigIntLike): Rat;
}

class RatImpl implements Rat {
  readonly num: bigint;
  readonly denom: bigint;

  constructor(num: unknown, denom: unknown) {
    this.num = BigInt(num);
    this.denom = BigInt(denom);

    if (this.denom === 0n) throw new RangeError("Division by zero");

    if (this.denom < 0n) {
      this.num = -this.num;
      this.denom = -this.denom;
    }

    const g = gcd(this.num, this.denom);

    this.num /= g;
    this.denom /= g;

    Object.freeze(this);
  }

  get sign(): -1 | 0 | 1 {
    return this.num > 0n ? 1 : this.num === 0n ? 0 : -1;
  }

  abs(): Rat {
    return new RatImpl(abs(this.num), this.denom);
  }

  neg(): Rat {
    return new RatImpl(-this.num, this.denom);
  }

  inv(): Rat {
    return new RatImpl(this.denom, this.num);
  }

  add(r: RatLike): Rat {
    r = Rat(r);
    return new RatImpl(
      this.num * r.denom + r.num * this.denom,
      this.denom * r.denom,
    );
  }

  sub(r: RatLike): Rat {
    r = Rat(r);
    return new RatImpl(
      this.num * r.denom - r.num * this.denom,
      this.denom * r.denom,
    );
  }

  mul(r: RatLike): Rat {
    r = Rat(r);
    return new RatImpl(this.num * r.num, this.denom * r.denom);
  }

  div(r: RatLike): Rat {
    r = Rat(r);
    return new RatImpl(this.num * r.denom, this.denom * r.num);
  }

  cmp(r: RatLike): -1 | 0 | 1 {
    r = Rat(r);
    const leftSign = this.sign;
    const rightSign = r.sign;

    if (leftSign !== rightSign) return leftSign > rightSign ? 1 : -1;
    if (this.denom === r.denom) return cmp(this.num, r.num);
    return cmp(this.num * r.denom, this.denom * r.num);
  }

  floor(): bigint {
    return this.num / this.denom;
  }

  pow(a: BigIntLike): Rat {
    return a > 0n
      ? new RatImpl(this.num ** BigInt(a), this.denom ** BigInt(a))
      : new RatImpl(this.denom ** -BigInt(a), this.num ** -BigInt(a));
  }

  toString(): string {
    return `${this.num}/${this.denom}`;
  }
}

const isRat = (r: unknown): r is Rat => r instanceof RatImpl;

const stringToRat = (s: string): Rat => {
  const strs = s.split("/");
  if (strs.length === 1) {
    const ints = strs[0].split(".");
    if (ints.length === 1) {
      return new RatImpl(ints[0], 1n);
    }
    return new RatImpl(`${ints[0]}${ints[1]}`, 10n ** BigInt(ints[1].length));
  }
  return new RatImpl(strs[0], strs[1]);
};

interface RatConstructor {
  /** Rat("0") */
  zero: Rat;
  /** Rat("1") */
  one: Rat;
  (value: RatLike): Rat;
  (num: BigIntLike, denom: BigIntLike): Rat;
  isRat(r: unknown): r is Rat;
}

export const Rat: RatConstructor = (a: unknown, b?: unknown) => {
  if (b != null) return new RatImpl(a, b);
  if (isRat(a)) return a;
  if (typeof a === "string") return stringToRat(a);
  if (typeof a === "bigint") return new RatImpl(a, 1);

  if (typeof a === "number") {
    if (Number.isInteger(a)) {
      return new RatImpl(a, 1);
    }
    throw new RangeError("Only integers are supported");
  }

  throw new TypeError("Invalid arguments");
};

Rat.isRat = isRat;
Rat.zero = Rat("0");
Rat.one = Rat("1");

Object.freeze(Rat);

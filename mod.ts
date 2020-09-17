type BigIntLike = bigint | number | string;

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
  readonly num: bigint;
  readonly denom: bigint;
  readonly sign: -1 | 0 | 1;
  abs(): Rat;
  neg(): Rat;
  inv(): Rat;
  add(r: Rat): Rat;
  sub(r: Rat): Rat;
  mul(r: Rat): Rat;
  div(r: Rat): Rat;
  cmp(r: Rat): -1 | 0 | 1;
  floor(): bigint;
  pow(a: BigIntLike): Rat;
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

  add(r: Rat): Rat {
    return new RatImpl(
      this.num * r.denom + r.num * this.denom,
      this.denom * r.denom,
    );
  }

  sub(r: Rat): Rat {
    return new RatImpl(
      this.num * r.denom - r.num * this.denom,
      this.denom * r.denom,
    );
  }

  mul(r: Rat): Rat {
    return new RatImpl(this.num * r.num, this.denom * r.denom);
  }

  div(r: Rat): Rat {
    return new RatImpl(this.num * r.denom, this.denom * r.num);
  }

  cmp(r: Rat): -1 | 0 | 1 {
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
  zero: Rat;
  one: Rat;
  (s: string): Rat;
  (num: BigIntLike, denom: BigIntLike): Rat;
  (rat: Rat): Rat;
  isRat(r: unknown): r is Rat;
}

export const Rat: RatConstructor = (a: unknown, b?: unknown) => {
  if (b) return new RatImpl(a, b);
  if (isRat(a)) return a;
  if (typeof a === "string") return stringToRat(a);
  throw new TypeError();
};

Rat.isRat = isRat;
Rat.zero = Rat("0");
Rat.one = Rat("1");

Object.freeze(Rat);

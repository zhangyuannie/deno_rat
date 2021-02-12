import { Rat } from "./mod.ts";
import {
  assert,
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.69.0/testing/asserts.ts";

Deno.test("[constructor] should work with 2 BigInts", () => {
  assertEquals(Rat(2n, 3n).num, 2n);
  assertEquals(Rat(2n, 3n).denom, 3n);
  assertEquals(Rat(1n, -4n).num, -1n);
  assertEquals(Rat(1n, -4n).denom, 4n);
});

Deno.test("[constructor] should work with string", () => {
  assertEquals(Rat("2/3"), Rat(2n, 3n));
  assertEquals(Rat("-2/3"), Rat(-2n, 3n));
  assertEquals(Rat("23"), Rat(23n, 1n));
  assertEquals(Rat("2.3"), Rat(23n, 10n));
  assertEquals(Rat(".23"), Rat(23n, 100n));
  assertEquals(Rat("0.23"), Rat(23n, 100n));
  assertEquals(Rat("0"), Rat(0n, 1n));
  assertEquals(Rat(""), Rat(0n, 1n));
  assertEquals(Rat("4/8"), Rat(1n, 2n));
});

Deno.test("[constructor] should work with two strings", () => {
  assertEquals(Rat("2", "3"), Rat(2n, 3n));
});

Deno.test("[constructor] should work with Rat", () => {
  assertEquals(Rat(Rat("3/4")), Rat("3/4"));
});

Deno.test("[constructor] should throw when the denominator is zero", () => {
  assertThrows(() => Rat("2", "0"));
  assertThrows(() => Rat(1, 0));
});

Deno.test("[constructor] should throw when the arguments are invalid", () => {
  assertThrows(() => Rat(true as unknown as number));
  assertThrows(() => Rat(Math.PI));
});

Deno.test("[constructor] should work with integers", () => {
  assertEquals(Rat(123), Rat("123"));
  assertEquals(Rat(321n), Rat("321/1"));
});

Deno.test("[sign] should work", () => {
  assertEquals(Rat("2/3").sign, 1);
  assertEquals(Rat("-2/3").sign, -1);
  assertEquals(Rat("0").sign, 0);
});

Deno.test("[abs] should work", () => {
  assertEquals(Rat("2/3").abs(), Rat("2/3"));
  assertEquals(Rat("-2/3").abs(), Rat("2/3"));
});

Deno.test("[neg] should work", () => {
  assertEquals(Rat("2/3").neg(), Rat("-2/3"));
  assertEquals(Rat("-2/3").neg(), Rat("2/3"));
});

Deno.test("[inv] should work", () => {
  assertEquals(Rat("2/3").inv(), Rat("3/2"));
  assertEquals(Rat("-3/2").inv(), Rat("-2/3"));
});

Deno.test("[add] should work", () => {
  assertEquals(Rat("2/3").add(Rat("1/2")), Rat("7/6"));
  assertEquals(Rat("2/3").add("1/3"), Rat("1"));
});

Deno.test("[sub] should work", () => {
  assertEquals(Rat("2/3").sub("1/2"), Rat("1/6"));
});

Deno.test("[mul] should work", () => {
  assertEquals(Rat("2/3").mul("1/2"), Rat("2/6"));
});

Deno.test("[div] should work", () => {
  assertEquals(Rat("2/3").div("1/2"), Rat("4/3"));
});

Deno.test("[cmp] should work", () => {
  assertEquals(Rat("2/3").cmp(Rat("1/2")), 1);
  assertEquals(Rat("2/3").cmp(1), -1);
  assertEquals(Rat("2/3").cmp("2/3"), 0);
  assertEquals(Rat("1/3").cmp(Rat("2/3")), -1);
  assertEquals(Rat("-2/3").cmp(Rat("2/3")), -1);
});

Deno.test("[floor] should work", () => {
  assertEquals(Rat("2/3").floor(), 0n);
  assertEquals(Rat("8/3").floor(), 2n);
  assertEquals(Rat("-8/3").floor(), -2n);
});

Deno.test("[pow] should work", () => {
  assertEquals(Rat("2/3").pow(0), Rat("1"));
  assertEquals(Rat("2/3").pow(1), Rat("2/3"));
  assertEquals(Rat("-8/3").pow(2), Rat("64/9"));
  assertEquals(Rat("-8/3").pow(-2), Rat("9/64"));
  assertEquals(Rat("0").pow(1), Rat("0"));
});

Deno.test("[pow] should return 0 for 0 ** 0", () => {
  assertEquals(Rat("0").pow(0), Rat("1"));
});

Deno.test("[toString] should work", () => {
  assertEquals(Rat("-8/3").toString(), "-8/3");
  assertEquals(Rat("2/3").toString(), "2/3");
});

Deno.test("[isRat] should work", () => {
  assert(Rat.isRat(Rat("1")));
});

Deno.test("[zero] should be equal to 0", () => {
  assertEquals(Rat.zero, Rat("0"));
});

Deno.test("[one] should be equal to 1", () => {
  assertEquals(Rat.one, Rat("1"));
});

Deno.test("[one] should be readonly", () => {
  assertThrows(() => {
    Rat.one = Rat("2");
  });
});

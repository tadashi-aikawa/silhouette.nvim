import { assertEquals } from "jsr:@std/assert@1";
import { toHHmmss } from "./times.ts";
import { parameterizedTest } from "./tests.ts";

parameterizedTest<
  [Parameters<typeof toHHmmss>[0], ReturnType<typeof toHHmmss>]
>(
  "toHHmmss",
  // deno-fmt-ignore
  // prettier-ignore
  [
    [1            , "00:00:01"],
    [59           , "00:00:59"],
    [60           , "00:01:00"],
    [60 * 60 - 1  , "00:59:59"],
    [60 * 60      , "01:00:00"],
    [60 * 60 * 25 , "25:00:00"],
  ] as const,
  ([seconds, expected]) => {
    assertEquals(toHHmmss(seconds), expected);
  },
);

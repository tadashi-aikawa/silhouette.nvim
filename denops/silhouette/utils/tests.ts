export function parameterizedTest<T>(
  name: string,
  cases: T[],
  testFn: (input: T) => void,
  toTitle?: (name: string, input: T) => string,
) {
  for (const testCase of cases) {
    Deno.test(
      toTitle?.(name, testCase) ?? `${name} -> ${JSON.stringify(testCase)}`,
      () => {
        testFn(testCase);
      },
    );
  }
}

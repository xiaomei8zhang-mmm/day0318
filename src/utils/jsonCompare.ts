export type CompareType = "missing" | "extra" | "mismatch";

export interface CompareItem {
  path: string;
  type: CompareType;
  expected?: unknown;
  actual?: unknown;
}

export interface CompareSummary {
  missing: number;
  extra: number;
  mismatch: number;
}

export interface CompareResult {
  items: CompareItem[];
  summary: CompareSummary;
}

function joinPath(parent: string, key: string): string {
  return parent ? `${parent}.${key}` : key;
}

function isObjectLike(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function pushDiff(items: CompareItem[], item: CompareItem): void {
  items.push(item);
}

function compareValues(expected: unknown, actual: unknown, path: string, items: CompareItem[]): void {
  if (Array.isArray(expected) && Array.isArray(actual)) {
    const maxLen = Math.max(expected.length, actual.length);
    for (let i = 0; i < maxLen; i += 1) {
      const itemPath = `${path}[${i}]`;
      if (i >= expected.length) {
        pushDiff(items, { path: itemPath, type: "extra", actual: actual[i] });
      } else if (i >= actual.length) {
        pushDiff(items, { path: itemPath, type: "missing", expected: expected[i] });
      } else {
        compareValues(expected[i], actual[i], itemPath, items);
      }
    }
    return;
  }

  if (isObjectLike(expected) && isObjectLike(actual)) {
    const expectedKeys = Object.keys(expected);
    const actualKeys = Object.keys(actual);

    for (const key of expectedKeys) {
      const childPath = joinPath(path, key);
      if (!(key in actual)) {
        pushDiff(items, { path: childPath, type: "missing", expected: expected[key] });
      } else {
        compareValues(expected[key], actual[key], childPath, items);
      }
    }

    for (const key of actualKeys) {
      if (!(key in expected)) {
        const childPath = joinPath(path, key);
        pushDiff(items, { path: childPath, type: "extra", actual: actual[key] });
      }
    }
    return;
  }

  if (!Object.is(expected, actual)) {
    pushDiff(items, { path, type: "mismatch", expected, actual });
  }
}

export function compareJsonData(expected: unknown, actual: unknown): CompareResult {
  const items: CompareItem[] = [];
  compareValues(expected, actual, "$", items);

  const summary: CompareSummary = { missing: 0, extra: 0, mismatch: 0 };
  for (const item of items) {
    summary[item.type] += 1;
  }

  return { items, summary };
}

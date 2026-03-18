export interface TimestampResult {
  timestampMs: number;
  local: string;
  iso: string;
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function formatLocal(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function parseTimestamp(input: string, unit: "seconds" | "milliseconds"): TimestampResult {
  const raw = Number(input.trim());
  if (!Number.isFinite(raw)) {
    throw new Error("时间戳必须是数字");
  }

  const timestampMs = unit === "seconds" ? raw * 1000 : raw;
  const date = new Date(timestampMs);

  if (Number.isNaN(date.getTime())) {
    throw new Error("时间戳无效");
  }

  return {
    timestampMs,
    local: formatLocal(date),
    iso: date.toISOString()
  };
}

export function datetimeToTimestamp(datetimeLocal: string): { seconds: number; milliseconds: number } {
  if (!datetimeLocal.trim()) {
    throw new Error("请选择时间");
  }

  const date = new Date(datetimeLocal);
  if (Number.isNaN(date.getTime())) {
    throw new Error("时间格式无效");
  }

  const milliseconds = date.getTime();
  return {
    milliseconds,
    seconds: Math.floor(milliseconds / 1000)
  };
}

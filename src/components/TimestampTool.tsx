import { useState } from "react";
import { datetimeToTimestamp, parseTimestamp } from "../utils/timestamp";

export function TimestampTool() {
  const [timestampInput, setTimestampInput] = useState("");
  const [timestampUnit, setTimestampUnit] = useState<"seconds" | "milliseconds">("seconds");
  const [datetimeInput, setDatetimeInput] = useState("");
  const [error, setError] = useState("");
  const [parsedResult, setParsedResult] = useState<{ local: string; iso: string; timestampMs: number } | null>(
    null
  );
  const [generatedResult, setGeneratedResult] = useState<{ seconds: number; milliseconds: number } | null>(null);

  const handleTimestampToDate = () => {
    setError("");
    setParsedResult(null);
    try {
      const result = parseTimestamp(timestampInput, timestampUnit);
      setParsedResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "时间戳转换失败");
    }
  };

  const handleDateToTimestamp = () => {
    setError("");
    setGeneratedResult(null);
    try {
      setGeneratedResult(datetimeToTimestamp(datetimeInput));
    } catch (err) {
      setError(err instanceof Error ? err.message : "时间转换失败");
    }
  };

  return (
    <section className="tool-card">
      <h2>时间戳转换</h2>
      <p className="tool-desc">支持秒/毫秒时间戳互转，输出本地时间和 ISO 格式，便于接口联调排查。</p>

      <div className="grid-two-cols">
        <div className="sub-card">
          <h3>时间戳 → 日期</h3>
          <label className="input-block">
            <span>时间戳</span>
            <input
              type="text"
              value={timestampInput}
              onChange={(e) => setTimestampInput(e.target.value)}
              placeholder="例如：1710460800"
            />
          </label>
          <div className="inline-fields">
            <label>
              <input
                type="radio"
                name="timestampUnit"
                checked={timestampUnit === "seconds"}
                onChange={() => setTimestampUnit("seconds")}
              />
              秒
            </label>
            <label>
              <input
                type="radio"
                name="timestampUnit"
                checked={timestampUnit === "milliseconds"}
                onChange={() => setTimestampUnit("milliseconds")}
              />
              毫秒
            </label>
          </div>
          <button type="button" onClick={handleTimestampToDate}>
            转换为日期
          </button>

          {parsedResult && (
            <div className="result-list">
              <p>本地时间：{parsedResult.local}</p>
              <p>ISO 时间：{parsedResult.iso}</p>
              <p>毫秒值：{parsedResult.timestampMs}</p>
            </div>
          )}
        </div>

        <div className="sub-card">
          <h3>日期 → 时间戳</h3>
          <label className="input-block">
            <span>日期时间</span>
            <input type="datetime-local" value={datetimeInput} onChange={(e) => setDatetimeInput(e.target.value)} />
          </label>
          <button type="button" onClick={handleDateToTimestamp}>
            转换为时间戳
          </button>

          {generatedResult && (
            <div className="result-list">
              <p>秒：{generatedResult.seconds}</p>
              <p>毫秒：{generatedResult.milliseconds}</p>
            </div>
          )}
        </div>
      </div>

      {error && <p className="msg msg--error">{error}</p>}
    </section>
  );
}

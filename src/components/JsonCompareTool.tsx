import { useMemo, useState } from "react";
import { compareJsonData } from "../utils/jsonCompare";

function formatValue(value: unknown): string {
  if (typeof value === "string") {
    return `"${value}"`;
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export function JsonCompareTool() {
  const [expectedText, setExpectedText] = useState('{\n  "name": "demo",\n  "count": 1\n}');
  const [actualText, setActualText] = useState('{\n  "name": "Demo",\n  "extra": true\n}');
  const [error, setError] = useState("");
  const [result, setResult] = useState<ReturnType<typeof compareJsonData> | null>(null);

  const hasDiff = useMemo(() => (result ? result.items.length > 0 : false), [result]);

  const handleCompare = () => {
    setError("");
    setResult(null);

    if (!expectedText.trim() || !actualText.trim()) {
      setError("请输入左右两侧 JSON 数据");
      return;
    }

    let expectedJson: unknown;
    let actualJson: unknown;

    try {
      expectedJson = JSON.parse(expectedText);
    } catch {
      setError("左侧 JSON 不合法，请检查格式");
      return;
    }

    try {
      actualJson = JSON.parse(actualText);
    } catch {
      setError("右侧 JSON 不合法，请检查格式");
      return;
    }

    setResult(compareJsonData(expectedJson, actualJson));
  };

  return (
    <section className="tool-card">
      <h2>JSON 数据对比</h2>
      <p className="tool-desc">区分字段缺失、字段多余、字段值不一致，结果按路径高亮展示。</p>

      <div className="grid-two-cols">
        <label className="input-block">
          <span>期望 JSON（基准）</span>
          <textarea value={expectedText} onChange={(e) => setExpectedText(e.target.value)} rows={12} />
        </label>
        <label className="input-block">
          <span>实际 JSON（被测）</span>
          <textarea value={actualText} onChange={(e) => setActualText(e.target.value)} rows={12} />
        </label>
      </div>

      <div className="tool-actions">
        <button type="button" onClick={handleCompare}>
          开始对比
        </button>
      </div>

      {error && <p className="msg msg--error">{error}</p>}

      {result && (
        <div className="result-panel">
          <div className="summary-grid">
            <div className="summary-item summary-item--missing">字段缺失：{result.summary.missing}</div>
            <div className="summary-item summary-item--extra">字段多余：{result.summary.extra}</div>
            <div className="summary-item summary-item--mismatch">值不一致：{result.summary.mismatch}</div>
          </div>

          {!hasDiff && <p className="msg msg--ok">对比完成：未发现差异</p>}

          {hasDiff && (
            <ul className="diff-list">
              {result.items.map((item) => (
                <li key={`${item.type}-${item.path}`} className={`diff-item diff-item--${item.type}`}>
                  <div className="diff-item__title">
                    <strong>{item.path}</strong>
                    <span>
                      {item.type === "missing" && "字段缺失"}
                      {item.type === "extra" && "字段多余"}
                      {item.type === "mismatch" && "字段值不一致"}
                    </span>
                  </div>
                  {item.type === "missing" && <p>期望值：{formatValue(item.expected)}</p>}
                  {item.type === "extra" && <p>实际值：{formatValue(item.actual)}</p>}
                  {item.type === "mismatch" && (
                    <p>
                      期望值：{formatValue(item.expected)} | 实际值：{formatValue(item.actual)}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

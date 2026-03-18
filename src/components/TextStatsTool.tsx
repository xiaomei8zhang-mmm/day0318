import { useMemo, useState } from "react";
import { getTextStats, STATS_RULE_NOTES } from "../utils/textStats";

export function TextStatsTool() {
  const [text, setText] = useState("");
  const stats = useMemo(() => getTextStats(text), [text]);

  return (
    <section className="tool-card">
      <h2>数据统计</h2>
      <p className="tool-desc">提供文本统计结果，适用于测试文案、接口返回文本和日志片段核对。</p>

      <label className="input-block">
        <span>输入文本</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={12}
          placeholder="请输入待统计文本..."
        />
      </label>

      <div className="result-panel">
        <div className="summary-grid">
          <div className="summary-item">字符数（含空格）：{stats.charsWithSpaces}</div>
          <div className="summary-item">字符数（不含空格）：{stats.charsWithoutSpaces}</div>
          <div className="summary-item">中文字符数：{stats.chineseChars}</div>
          <div className="summary-item">英文单词数：{stats.englishWords}</div>
          <div className="summary-item">行数：{stats.lines}</div>
        </div>

        <div className="note-block">
          <h3>统计规则说明</h3>
          <ul>
            {STATS_RULE_NOTES.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

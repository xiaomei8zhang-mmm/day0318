import { useState } from "react";
import { AesDecryptTool } from "./components/AesDecryptTool";
import { AesEncryptTool } from "./components/AesEncryptTool";
import { JsonCompareTool } from "./components/JsonCompareTool";
import { TimestampTool } from "./components/TimestampTool";

type ToolKey = "aesDecrypt" | "aesEncrypt" | "jsonCompare" | "timestamp";

const TOOL_TABS: { key: ToolKey; label: string }[] = [
  { key: "aesDecrypt", label: "AES 参数解密" },
  { key: "aesEncrypt", label: "AES 参数加密" },
  { key: "jsonCompare", label: "JSON 数据对比" },
  { key: "timestamp", label: "时间戳转换" }
];

function App() {
  const [activeTool, setActiveTool] = useState<ToolKey>("aesDecrypt");

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>测试工具网站</h1>
        <p>面向测试人员的前端工具站点，支持 AES 参数处理、JSON 数据对比与时间戳转换。</p>
      </header>

      <nav className="tool-tabs" aria-label="工具切换菜单">
        {TOOL_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`tab-btn ${activeTool === tab.key ? "tab-btn--active" : ""}`}
            onClick={() => setActiveTool(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="tool-panel">
        {activeTool === "aesDecrypt" && <AesDecryptTool />}
        {activeTool === "aesEncrypt" && <AesEncryptTool />}
        {activeTool === "jsonCompare" && <JsonCompareTool />}
        {activeTool === "timestamp" && <TimestampTool />}
      </main>
    </div>
  );
}

export default App;

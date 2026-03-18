import { useState } from "react";
import { decryptJavaAesEcbParams, type UrlDecodeEncoding } from "../utils/aes";

const SAMPLE_URL_PARAMS =
  "b5rmIuYwZ7R65UeIX4SzUmZgkIGA7lwJuRC6RaCLTxOQrBEW6C%2BFh1N3oDzgb5PLCNVGXiFxYGRmo6KC63m2qPzX9GlKuKJS5IMf7LILn0NyxWi57Qc%2BOoWkzOYERj6fEnoRNT2gqB5SuvLA3kMGyaUVZPiOsDF0I7Zu9o0euSF%2FpENTJmhhwXpW1eVOYdlwbC%2Fn3QvJkwI4Dipeku6KNiznzrt5Daa556kPxWULvBzda86LWQfCbeZUtwo64TB2LMLR0TMhzIYxCFGRJJ7MwaXOdYnEckQLn75nWacz993z85wKeB490B%2FoERIAaTb4w199nRVFMypO9HesGBvmAvU8Yh26JoB%2FlZltSyb1E52kgh8%2FkCvtBjChnbq7jMPsoJvqnZpijIS%2F2BfT8XZwFMU0t1h75DWAToS11Loj%2BSPEVNShmpuVMD7poWEoggpZ7oiXwISVe9WPHzSP2R4Dg%2B1TgUMexB7VBc9m5rXJpTONTZSOrRyFFKLxghr1dZ2NcFKYsz6Hx6b6A0FPmED1hQ%3D%3D";

export function AesDecryptTool() {
  const [urlParams, setUrlParams] = useState("");
  const [keyText, setKeyText] = useState("H9846F3UTOXBW05SIEGKD2CVIKLKLPAN");
  const [urlDecodeEncoding, setUrlDecodeEncoding] = useState<UrlDecodeEncoding>("gbk");
  const [plainText, setPlainText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDecrypt = () => {
    setError("");
    setPlainText("");
    setLoading(true);
    try {
      const result = decryptJavaAesEcbParams({
        urlEncodedParams: urlParams,
        key: keyText,
        urlDecodeEncoding
      });
      setPlainText(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "AES 解密失败");
    } finally {
      setLoading(false);
    }
  };

  const handleUseSample = () => {
    setUrlParams(SAMPLE_URL_PARAMS);
    setKeyText("H9846F3UTOXBW05SIEGKD2CVIKLKLPAN");
    setUrlDecodeEncoding("gbk");
    setError("");
    setPlainText("");
  };

  return (
    <section className="tool-card">
      <h2>AES 参数解密</h2>
      <p className="tool-desc">
        按 Python 示例流程执行：URL 解码（可选 gbk）→ Base64 密文 → AES-ECB 解密（PKCS7）。
      </p>

      <div className="inline-fields">
        <label>
          URL 解码字符集
          <select value={urlDecodeEncoding} onChange={(e) => setUrlDecodeEncoding(e.target.value as UrlDecodeEncoding)}>
            <option value="gbk">gbk</option>
            <option value="utf-8">utf-8</option>
          </select>
        </label>
      </div>

      <div className="grid-single">
        <label className="input-block">
          <span>URL 编码的 params</span>
          <textarea
            value={urlParams}
            onChange={(e) => setUrlParams(e.target.value)}
            rows={8}
            placeholder="请输入 URL 编码的参数字符串（例如包含 %2B、%2F、%3D）"
          />
        </label>

        <label className="input-block">
          <span>AES Key（字符串）</span>
          <input
            type="text"
            value={keyText}
            onChange={(e) => setKeyText(e.target.value)}
            placeholder="请输入 16/24/32 字符的 AES Key"
          />
        </label>
      </div>

      <div className="tool-actions">
        <button type="button" onClick={handleUseSample}>
          载入示例参数
        </button>
        <button type="button" onClick={handleDecrypt} disabled={loading}>
          {loading ? "解密中..." : "执行解密"}
        </button>
      </div>

      {error && <p className="msg msg--error">{error}</p>}
      {plainText && (
        <div className="result-panel">
          <h3>解密结果</h3>
          <textarea value={plainText} readOnly rows={6} />
        </div>
      )}

      <div className="note-block">
        <h3>测试提示</h3>
        <ul>
          <li>当前逻辑固定为 AES-ECB + PKCS7（对齐你的 Python 代码）。</li>
          <li>输入应为 URL 编码后的 Base64 密文字符串。</li>
          <li>默认 Key 已预置为示例值，可自行修改。</li>
          <li>若浏览器不支持 gbk 解码，可切换为 utf-8 重试。</li>
        </ul>
      </div>
    </section>
  );
}

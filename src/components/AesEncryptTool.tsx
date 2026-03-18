import { useState } from "react";
import { encryptJavaAesEcbParams } from "../utils/aes";

export function AesEncryptTool() {
  const [plainText, setPlainText] = useState("");
  const [keyText, setKeyText] = useState("H9846F3UTOXBW05SIEGKD2CVIKLKLPAN");
  const [base64Cipher, setBase64Cipher] = useState("");
  const [urlEncodedParams, setUrlEncodedParams] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEncrypt = () => {
    setError("");
    setBase64Cipher("");
    setUrlEncodedParams("");
    setLoading(true);
    try {
      const result = encryptJavaAesEcbParams({
        plainText,
        key: keyText
      });
      setBase64Cipher(result.base64Cipher);
      setUrlEncodedParams(result.urlEncodedParams);
    } catch (err) {
      setError(err instanceof Error ? err.message : "AES 加密失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="tool-card">
      <h2>AES 参数加密</h2>
      <p className="tool-desc">
        作为 AES 参数解密的反向流程：明文 → AES-ECB(PKCS7) → Base64 → URL 编码，可直接用于接口参数传输。
      </p>

      <div className="grid-single">
        <label className="input-block">
          <span>待加密文本（UTF-8）</span>
          <textarea
            value={plainText}
            onChange={(e) => setPlainText(e.target.value)}
            rows={8}
            placeholder="请输入待加密参数内容"
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
        <button type="button" onClick={handleEncrypt} disabled={loading}>
          {loading ? "加密中..." : "执行加密"}
        </button>
      </div>

      {error && <p className="msg msg--error">{error}</p>}

      {(base64Cipher || urlEncodedParams) && (
        <div className="result-panel">
          <label className="input-block">
            <span>Base64 密文</span>
            <textarea value={base64Cipher} readOnly rows={4} />
          </label>
          <label className="input-block">
            <span>URL 编码 params</span>
            <textarea value={urlEncodedParams} readOnly rows={6} />
          </label>
        </div>
      )}

      <div className="note-block">
        <h3>测试提示</h3>
        <ul>
          <li>当前逻辑固定为 AES-ECB + PKCS7，与解密模块完全对称。</li>
          <li>输出的 URL 编码 params 可直接粘贴到 AES 参数解密模块验证回环。</li>
          <li>Key 长度必须是 16/24/32 字符。</li>
        </ul>
      </div>
    </section>
  );
}

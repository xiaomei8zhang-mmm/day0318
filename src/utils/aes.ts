import CryptoJS from "crypto-js";

export type UrlDecodeEncoding = "gbk" | "utf-8";

export interface JavaAesEcbDecryptOptions {
  urlEncodedParams: string;
  key: string;
  urlDecodeEncoding: UrlDecodeEncoding;
}

export interface JavaAesEcbEncryptOptions {
  plainText: string;
  key: string;
}

export interface JavaAesEcbEncryptResult {
  base64Cipher: string;
  urlEncodedParams: string;
}

function percentDecodeToBytes(input: string): Uint8Array {
  const bytes: number[] = [];
  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];
    if (ch === "%") {
      const hex = input.slice(i + 1, i + 3);
      if (!/^[0-9a-fA-F]{2}$/.test(hex)) {
        throw new Error("URL 编码参数不合法");
      }
      bytes.push(Number.parseInt(hex, 16));
      i += 2;
    } else {
      bytes.push(ch.charCodeAt(0));
    }
  }
  return new Uint8Array(bytes);
}

function decodeUrlParams(value: string, encoding: UrlDecodeEncoding): string {
  if (!value.trim()) {
    throw new Error("请输入 URL 编码的 params");
  }

  const bytes = percentDecodeToBytes(value.trim());
  try {
    const decoder = new TextDecoder(encoding);
    return decoder.decode(bytes);
  } catch {
    throw new Error(`浏览器不支持 ${encoding} 解码`);
  }
}

function assertKeyLength(key: string): void {
  const keyLen = key.length;
  if (![16, 24, 32].includes(keyLen)) {
    throw new Error("Key 长度必须为 16/24/32 字符（对应 AES-128/192/256）");
  }
}

export function decryptJavaAesEcbParams(options: JavaAesEcbDecryptOptions): string {
  const { urlEncodedParams, key, urlDecodeEncoding } = options;
  if (!key.trim()) {
    throw new Error("请输入 AES Key");
  }
  assertKeyLength(key);

  // 测试用途：对齐 Python 流程，先 URL 解码，再将得到的 Base64 字符串做 AES-ECB + PKCS7 解密。
  const base64Cipher = decodeUrlParams(urlEncodedParams, urlDecodeEncoding);

  try {
    const keyWordArray = CryptoJS.enc.Utf8.parse(key);
    const cipherWordArray = CryptoJS.enc.Base64.parse(base64Cipher);
    const cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext: cipherWordArray });
    const decrypted = CryptoJS.AES.decrypt(cipherParams, keyWordArray, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });

    const plainText = CryptoJS.enc.Utf8.stringify(decrypted);
    if (!plainText) {
      throw new Error("EMPTY_RESULT");
    }
    return plainText;
  } catch {
    throw new Error("AES-ECB 解密失败，请检查 params 与 Key 是否匹配");
  }
}

export function encryptJavaAesEcbParams(options: JavaAesEcbEncryptOptions): JavaAesEcbEncryptResult {
  const { plainText, key } = options;
  if (!plainText.trim()) {
    throw new Error("请输入待加密文本");
  }
  if (!key.trim()) {
    throw new Error("请输入 AES Key");
  }
  assertKeyLength(key);

  try {
    // 测试用途：对齐解密反向流程，先 AES-ECB+PKCS7 加密，再转 Base64，最后进行 URL 编码。
    const keyWordArray = CryptoJS.enc.Utf8.parse(key);
    const plainWordArray = CryptoJS.enc.Utf8.parse(plainText);
    const encrypted = CryptoJS.AES.encrypt(plainWordArray, keyWordArray, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });

    const base64Cipher = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
    return {
      base64Cipher,
      urlEncodedParams: encodeURIComponent(base64Cipher)
    };
  } catch {
    throw new Error("AES-ECB 加密失败，请检查输入参数");
  }
}

export interface TextStats {
  charsWithSpaces: number;
  charsWithoutSpaces: number;
  chineseChars: number;
  englishWords: number;
  lines: number;
}

export const STATS_RULE_NOTES = [
  "字符数（含空格）：按字符串总长度计算。",
  "字符数（不含空格）：移除所有空白字符后计算。",
  "中文字符数：匹配 CJK 统一表意文字范围。",
  "英文单词数：按英文单词边界匹配（支持 apostrophe）。",
  "行数：空文本记 0 行，否则按换行符拆分。"
];

export function getTextStats(text: string): TextStats {
  const charsWithSpaces = text.length;
  const charsWithoutSpaces = text.replace(/\s/g, "").length;
  const chineseChars = (text.match(/[\u3400-\u9fff]/g) ?? []).length;
  const englishWords = (text.match(/\b[a-zA-Z]+(?:'[a-zA-Z]+)?\b/g) ?? []).length;
  const lines = text.length === 0 ? 0 : text.split(/\r\n|\r|\n/).length;

  return {
    charsWithSpaces,
    charsWithoutSpaces,
    chineseChars,
    englishWords,
    lines
  };
}

// src/utils/cleanCodeBlock.ts
export default function cleanCodeBlock(content: string) {
  // Regex robusta para capturar o primeiro array JSON ou bloco de código em string suja
  const jsonRegex = /```json\s*([\s\S]*?)\s*```|(\[\s*{[\s\S]*}\s*\])/;
  const match = content.match(jsonRegex);
  
  let cleaned = match ? (match[1] || match[2]) : content;

  cleaned = cleaned.replace(/^\uFEFF/, '');
  cleaned = cleaned.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F-\u009F]/g, '');
  
  return { cleaned: cleaned.trim() };
}
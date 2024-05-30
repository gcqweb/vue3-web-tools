/**
 * 随机生成颜色
 */
export function randColor() {
  const r = parseInt(Math.random() * 255);
  const g = parseInt(Math.random() * 255);
  const b = parseInt(Math.random() * 255);
  return `rgb(${r},${g},${b})`;
}

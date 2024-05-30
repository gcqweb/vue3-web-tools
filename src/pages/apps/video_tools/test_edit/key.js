/**
 * 生成UUID
 * @return {string}
 */
export function uuid() {
  return (
    +new Date() +
    Math.random() * 10 +
    Math.random() * 10 +
    Math.random() * 10 +
    Math.random() * 10 +
    "a"
  );
}

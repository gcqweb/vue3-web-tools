/**
 * ======================================
 * 说明：string处理
 * 作者：SKY
 * 文件：string.js
 * 日期：2022/11/22 16:30
 * ======================================
 */
export function clearEmpty(val) {
  val = val.replace(" ", "");
  if (val.indexOf(" ") !== -1) {
    return clearEmpty(val);
  } else {
    return val;
  }
}

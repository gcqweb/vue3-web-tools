// localStorage.js
const localStorageUtil = {
  /**
   * 设置存储项
   * @param {String} key - 存储键
   * @param {Object} value - 存储值，将自动转换为字符串
   */
  set(key, value) {
    if (value === undefined) {
      console.error("无法存储未定义的值");
      return;
    }
    localStorage.setItem(key, JSON.stringify(value));
  },

  /**
   * 获取存储项
   * @param {String} key - 存储键
   * @return {Object|null} - 解析后的存储值，如果项不存在则返回 null
   */
  get(key) {
    const item = localStorage.getItem(key);
    try {
      return JSON.parse(item);
    } catch (e) {
      console.error("分析localStorage中的数据时出错", e);
      return null;
    }
  },

  /**
   * 删除存储项
   * @param {String} key - 存储键
   */
  remove(key) {
    localStorage.removeItem(key);
  },

  /**
   * 清空所有存储项
   */
  clear() {
    localStorage.clear();
  },
};

export default localStorageUtil;

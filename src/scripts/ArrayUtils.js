import ObjectUtils from './ObjectUtils';
/**
 * 筛选掉重复元素后返回一个新的数组，不影响原数组
 * @param {Array} arr
 */
function Unique(arr) {
  let res = [],
    obj = {};
  if (arr instanceof Array) {
    arr.forEach(item => {
      let hashcode = ObjectUtils.Hashcode(item);
      if (!obj[hashcode]) {
        res.push(item);
        obj[hashcode] = true;
      }
    });
  }
  return res;
}
export default { Unique };

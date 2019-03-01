/**
 * 计算对象的Hashcode码，可用于判断两个对象是否内容相等
 * @param {*} obj
 */
function Hashcode(obj) {
  var hash = 0,
    i,
    chr,
    len;
  if (obj.length === 0) return hash;
  for (i = 0, len = obj.length; i < len; i++) {
    chr = obj.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
}
/**
 * 深度克隆对象
 * @param {*} obj
 */
function Clone(obj) {
  var res = obj instanceof Array ? [] : {};
  for (var k in obj) {
    let v = obj[k];
    if (typeof v === 'object') {
      res[k] = Clone(v);
    } else if (v instanceof Date) {
      res[k] = new Date(v.getTime());
    } else {
      res[k] = v;
    }
  }
  return res;
}
export default { Hashcode, Clone };

const char = '`MY-[po2”《uyAVXb=1]i7.,mn，~！@#B*0（LQFa4s{x9z·；‘g5￥…hCZj(&^）qk—TS+|：“3rGN}e"vc’、。HJKwl6;\'/》？<tIOUDERW8df>?:_)%$P!'.split('');
const separator = '-';
export function encode(str) {
  let res = [];
  let arr = (str || '').split('');
  arr.forEach(item => {
    if (/^[\u4E00-\u9FFF]$/.test(item)) {
      res.push(parseInt(escape(item).substring(2), 16));
    } else if (/^\s$/.test(item) || char.indexOf(item) === -1) {
      res.push(item);
    } else {
      let index = char.indexOf(item);
      res.push(index);
    }
  });
  return res.join(separator);
}
export function decode(str) {
  let res = [];
  let arr = (str || '').split(separator);
  arr.forEach(item => {
    if (!Number.isNaN(new Number(item)) && +item >= char.length) {
      res.push(unescape('%u' + new Number(item).toString(16)));
    } else if (/^\s$/.test(item) || Number.isNaN(new Number(item))) {
      res.push(item);
    } else {
      res.push(char[+item]);
    }
  });
  return res.join('');
}

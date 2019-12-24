export default {
  Format(date, format) {
    let res = '未知';
    if (typeof date === 'number') {
      try {
        date = new Date(date);
      } catch (e) {}
    }
    if (date instanceof Date) {
      format = format || 'yyyy-MM-dd HH:mm:ss';
      res = format;
      const opts = {
        'y+': date => {
          return date.getFullYear();
        },
        'M+': date => {
          return date.getMonth() + 1;
        },
        'd+': date => {
          return date.getDate();
        },
        'H+': date => {
          return date.getHours();
        },
        'm+': date => {
          return date.getMinutes();
        },
        's+': date => {
          return date.getSeconds();
        }
      };
      for (let pattern in opts) {
        let reg = new RegExp(pattern, 'g');
        let value = opts[pattern](date);
        if (value < 10) {
          value = '0' + value;
        }
        res = res.replace(reg, value);
      }
    }
    return res;
  }
};

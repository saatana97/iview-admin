import { Post } from './ajax';
import Base from './base';
const api = {
  ...Base('role'),
  Dispatch(id, ids) {
    return Post('role/dispatch/' + id, ids);
  },
  Undispatch(id, ids) {
    return Post('role/undispatch/' + id, ids);
  }
};
export default api;

import { Post } from './ajax';
import Base from './base';
const api = {
  ...Base('menu'),
  TreeByRole(roleId) {
    return Post('menu/tree/' + roleId);
  }
};
export default api;

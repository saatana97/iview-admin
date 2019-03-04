import { Post } from './ajax';
import Base from './base';
const api = {
  ...Base('org'),
  TreeByRole(roleId) {
    return Post('org/tree/' + roleId);
  }
};
export default api;

import { Post } from './ajax';
import Base from './base';
const api = {
  ...Base('authorizer'),
  Login(data) {
    return Post('authorizer/login', data);
  },
  Logout() {
    return Post('authorizer/logout');
  },
  CheckRepeat(username) {
    return Post('authorizer/checkRepeat/' + username);
  }
};
export default api;

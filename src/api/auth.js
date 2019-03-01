import { Post } from './ajax';
import Base from './base';
const api = {
  ...Base('auth'),
  Login(data) {
    return Post('auth/login', data);
  },
  Logout() {
    return Post('auth/logout');
  }
};
export default api;

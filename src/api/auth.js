import { Post } from './ajax';
import Base from './base';
const api = {
  ...Base('auth'),
  Login(data) {
    return Post('auth/login', data);
  },
  Logout() {
    return Post('auth/logout');
  },
  Permission(permission) {
    return Post('auth/permission/' + permission);
  }
};
export default api;

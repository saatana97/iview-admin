import { Post } from './ajax';
import Base from './base';
const api = {
  ...Base('authorizer'),
  Login(data) {
    return Post('authorizer/login', data);
  }
};
export default api;

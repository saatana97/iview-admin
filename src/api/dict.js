import { Post } from './ajax';
import Base from './base';
const api = {
  ...Base('dict'),
  Query(data) {
    return Post('dict/query', data);
  }
};
export default api;

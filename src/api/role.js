import { Post } from './ajax';
export function Page(data) {
  return Post('role/page', data);
}

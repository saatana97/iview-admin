import { Post } from './ajax';
import Base from './base';
export default {
	...Base('user'),
	Repwd(data) {
		return Post('user/repwd',  data);
	},
	Login(data) {
		return Post('user/login',  data);
	}
};

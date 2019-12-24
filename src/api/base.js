import { Post,Get,Put,Delete } from './ajax';
export default controller => {
	return {
		Tree() {
			return Post(controller + '/tree');
		},
		Get(id) {
			return Get(controller + '/get/' + id);
		},
		All() {
			return Get(controller + '/all');
		},
		Check(data) {
			return Post(controller + '/check', data);
		},
		List(data) {
			return Post(controller + '/list', data);
		},
		Page(data) {
			return Post(controller + '/page', data);
		},
		Create(data) {
			return Post(controller + '/create', data);
		},
		Update(data) {
			return Put(controller + '/update', data);
		},
		Remove(id) {
			return Delete(controller + '/remove/' + id);
		},
		RemoveAll(data) {
			return Delete(controller + '/removeAll', data.join(","));
		},
		Restore(id) {
			return Put(controller + '/restore/' + id);
		},
		RestoreAll(data) {
			return Put(controller + '/restoreAll', data.join(","));
		},
		Delete(id) {
			return Delete(controller + '/delete/' + id);
		},
		DeleteAll(data) {
			return Delete(controller + '/deleteAll', data.join(","));
		}
	};
};

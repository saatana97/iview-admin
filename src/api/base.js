import { Post } from './ajax';
export default controller => {
  return {
    Tree() {
      return Post(controller + '/tree');
    },
    All() {
      return Post(controller + '/all');
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
      return Post(controller + '/update', data);
    },
    Remove(id) {
      return Post(controller + '/remove/' + id);
    },
    RemoveAll(data) {
      return Post(controller + '/removeAll', data);
    },
    Restore(id) {
      return Post(controller + '/restore/' + id);
    },
    RestoreAll(data) {
      return Post(controller + '/restoreAll', data);
    },
    Delete(id) {
      return Post(controller + '/delete/' + id);
    },
    DeleteAll(data) {
      return Post(controller + '/deleteAll', data);
    }
  };
};

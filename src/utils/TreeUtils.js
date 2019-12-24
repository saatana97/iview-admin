export default {
	/**
	 * 构建树结构
	 * @param {Array} arr 数据源
	 * @param {String} id 唯一标识属性名
	 * @param {String} parentId 父节点唯一标识属性名
	 * @param {String} children 子节点集合属性名
	 */
	Build(arr, id, parentId, children) {
		let res = [];
		if (arr instanceof Array) {
			arr = [...arr];
			id = id || 'id';
			parentId = parentId || 'parentId';
			children = children || 'children';
			let map = new Map();
			arr.forEach(item => {
				map.set(item[id], { ...item });
			});
			arr.forEach(item => {
				item = map.get(item[id]);
				let parent = map.get(item[parentId]);
				if (parent) {
					let temp = parent[children] || [];
					temp.push(item);
					parent[children] = temp;
				} else {
					res.push(item);
				}
			});
		}
		return res;
	},
	Filter(tree, fn, find = false) {
		let res = [];
		if (tree instanceof Array && tree.length > 0) {
			for (let index in tree) {
				let item = tree[index];
				if (fn(item)) {
					res.push(item);
				} else {
					res.push.apply(res, this.Filter(item.children, fn, find));
				}
				if (res.length > 0 && find) {
					break;
				}
			}
		}
		if (find) {
			res = res[0];
		}
		return res;
	}
};

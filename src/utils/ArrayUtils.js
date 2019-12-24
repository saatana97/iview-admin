export default {
	Unique(arr, compare) {
		compare = compare || ((obj1, obj2) => obj1 === obj2);
		let res = [];
		if (arr instanceof Array && arr.length > 0) {
			res = [arr[0]];
			for (let i = 1; i < arr.length; i++) {
				let item = arr[i];
				if (!res.find(temp => compare(temp, item))) {
					res.push(item);
				}
			}
		}
		return res;
	}
};

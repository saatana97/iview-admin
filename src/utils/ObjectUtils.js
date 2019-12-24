export default {
	isNull(obj) {
		return typeof obj === 'undefined' || obj === null;
	},
	/**
	 * 复制属性
	 * @param {Object} source 源对象
	 * @param {Object} target 目标对象
	 * @param {Boolean} ignore 是否忽略目标对象没有的属性
	 * @param {Boolean} overwrite 是否用空值覆盖目标的值
	 */
	Copy(source, target, ignore, overwrite) {
		if (source != null && target != null) {
			ignore = ignore === true;
			overwrite = overwrite === true;
			if (ignore) {
				for (let p in target) {
					if (source.hasOwnProperty(p)) {
						let v = source[p];
						if (
							!overwrite &&
							!this.isNull(target[p]) &&
							this.isNull(v)
						) {
							continue;
						}
						target[p] = v;
					}
				}
			} else {
				for (let p in source) {
					let v = source[p];
					if (
						!overwrite &&
						!this.isNull(target[p]) &&
						this.isNull(v)
					) {
						continue;
					}
					target[p] = v;
				}
			}
		}
	}
};

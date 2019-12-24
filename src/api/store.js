import { encode, decode } from '@/api/code';
export default {
	debug: true,
	platform: ['admin', 'customer'],
	baseURL: '/api/',
	session(key, value) {
		let prefix = window.location.host.split(':').join('-') + '-';
		key = prefix + key;
		if (!this.debug) {
			key = encode(key);
		}
		if (typeof value === 'undefined') {
			value = sessionStorage[key];
			if (!this.debug && typeof value !== 'undefined') {
				value = decode(value);
			}
		} else {
			if (typeof value !== 'string') {
				value = JSON.stringify(value);
			}
			value = this.debug ? value : encode(value);
			sessionStorage[key] = value;
		}
		return value;
	},
	local(key, value) {
		let prefix = window.location.host.split(':').join('-') + '-';
		key = prefix + key;
		if (!this.debug) {
			key = encode(key);
		}
		if (typeof value === 'undefined') {
			value = localStorage[key];
			if (!this.debug && typeof value !== 'undefined') {
				value = decode(value);
			}
		} else {
			if (typeof value !== 'string') {
				value = JSON.stringify(value);
			}
			value = this.debug ? value : encode(value);
			localStorage[key] = value;
		}
		return value;
	},
	clearSession() {
		let key = '';
		let prefix = window.location.host.split(':').join('-') + '-';
		key = prefix + key;
		let remove = [];
		for (let i = 0; i < sessionStorage.length; i++) {
			let item = sessionStorage.key(i);
			if (item.startsWith(key)) {
				sessionStorage.removeItem(item);
				i--;
				remove.push(item);
			}
		}
		this.debug && console.info('[store]', `clear ${remove.length} items`, remove);
		return remove;
	},
	hasPermission(permission) {
		let arr = JSON.parse(this.session('permission') || '[]');
		return arr.indexOf(permission) !== -1;
	},
	logout() {
		this.clearSession();
		window.app.$router.push({ name: 'Login' });
	}
};

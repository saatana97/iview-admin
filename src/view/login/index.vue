<template>
	<div>
		<h1>登陆</h1>
		<p>暂时使用的TOKEN检测机制为：</p>
		<code>['/login'].indexOf(to.fullPath) === -1 && !sessionStorage['token'] && !localStorage['token']</code>
		<p>F12打开控制台输入：</p>
		<code>localStorage.token='admin'</code>
		<p>之后即可访问其他页面</p>
		<p>访问登录页面也会自动跳转到首页</p>
	</div>
</template>
<script>
export default {
	data() {
		return {};
	}
};
</script>

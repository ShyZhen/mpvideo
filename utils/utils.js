/**
 * 防抖：只触发最后一次
 * @param {Function} fn 要执行的回调函数 
 * @param {Number} delay 延时的时间
 * @return {Function}
 */
function debounce(fn, delay) {
	var timer = null;
	return function() {
		var context = this;
		var args = arguments;
		clearTimeout(timer);
		timer = setTimeout(function() {
			fn.apply(context, args)
		}, delay)
	}
}

export default {
	debounce,
}

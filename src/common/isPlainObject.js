// 真object判断
function isPlainObject(obj) {
    return Object.prototype.toString.call( obj ) === "[object Object]";
}

export {isPlainObject}
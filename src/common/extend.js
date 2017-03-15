/**
 * object合并函数 copy form zepto
 * @param target 合并目标项
 * @param source 要合并项
 * @param deep 是否深度合并 默认true
 */

import {isArray} from "./isArray";
import {isPlainObject} from "./isPlainObject";

function extend(target, source, deep) {
    if(typeof deep != 'boolean')deep = true;
    for (let key in source) {
        if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
            if (isPlainObject(source[key]) && !isPlainObject(target[key]))
                target[key] = {};
            if (isArray(source[key]) && !isArray(target[key]))
                target[key] = [];
            extend(target[key], source[key], deep)
        }
        else if (source[key] !== undefined) target[key] = source[key]
    }
    return target
}

export {extend}
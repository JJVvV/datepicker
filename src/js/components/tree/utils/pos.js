/**
 * Created by AlexLiu on 2015/9/19.
 */

export const posLength = (pos) => {
    return pos.split('-').length;
}

export const parentPos = (_pos) => {
    return _pos.substring(0, _pos.lastIndexOf('-'));
}
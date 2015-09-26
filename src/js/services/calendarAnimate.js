/**
 * Created by AlexLiu on 2015/9/23.
 */

import $ from 'jquery';

const init = (id, className, callback) => {
    let ele = $(id);
    if(ele.length === 0) return;

    var height = ele[0].offsetHeight;
    ele.addClass(className);
    ele.one('transitionend', (e) => {
        ele.removeClass(className);
    });

}

export const right = (id, callback) => {
    init(id, 'right');
}

export const wrong = (id) => {
    init(id, 'wrong');
}








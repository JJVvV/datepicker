/**
 * Created by AlexLiu on 2015/9/23.
 */


export  default throttle = (method, delay, duration) => {
    var timer = null,
        begin = new Date(),
        delay = delay || 300,
        duration = duration || 300
    return function () {
        var context = this, args = arguments, current = new Date();
        clearTimeout(timer);
        if (current - begin >= duration) {
            method.apply(context, args);
            begin = current;
        } else {
            timer = setTimeout(function () {
                method.apply(context, args);
            }, delay);
        }
    }
}
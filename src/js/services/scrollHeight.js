/**
 * Created by AlexLiu on 2015/9/24.
 */


export default function getScrollHeight(allHeight){
    var children;
    var childrenHeight = 0;
    if(typeof allHeight === 'object'){
        allHeight = allHeight.offsetHeight || allHeight.innerHeight
    }

    if(Array.isArray(arguments[1])){
        children = arguments[1];
    }else{
        children = Array.prototype.slice.call(arguments, 1);
    }

    childrenHeight =  children.reduce((prev, current, index, arr) => {

        if(typeof prev === 'object'){
            prev = prev.offsetHeight || prev.innerHeight;
        }
        if(typeof current === 'object'){
            current = current.offsetHeight || prev.innerHeight;
        }
        return prev + current;
    });

    return allHeight - (childrenHeight ? childrenHeight : 0);
}
/**
 * Created by BennetWang on 2015/8/24.
 */
export function arrayfind(array,callback){
    for(let i=0;i<array.length;i++){
        if(callback(array[i],i,array)){
            return array[i];
        }
    }
    return undefined;
}
export function arrayfindArray(array,callback){
    let retArray=[];
    for(let i=0;i<array.length;i++){
        if(callback(array[i],i,array)){
            retArray.push(array[i]);
        }
    }
    return retArray;
}

export function arrayRemove(array,item){
    let retArray=[];
    for(let i=0;i<array.length;i++){
        if(array[i]!=item){
            retArray.push(array[i]);
        }
    }
    return retArray;
}
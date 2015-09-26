/**
 * Created by BennetWang on 2015/8/21.
 */


export default function generateUniqueID(){
    var b = '';
    var a=1000000;
    for(let i=0; i<4; i++){
        b += Math.floor(a*Math.random()).toString(16);
    }
    return b;
}
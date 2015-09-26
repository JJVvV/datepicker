/**
 * Created by Administrator on 2015/7/25.
 */

// 操作node

function getNextElement(node){
  var nextElement;
  if(typeof node.nextElementSibling){
    nextElement = node.nextElementSibling
  }else{
    do{
      nextElement = node.nextSibling;
    }while(nextElement && nextElement.nodeType !== 1)
  }
  return nextElement;
}



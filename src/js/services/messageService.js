/**
 * Created by Administrator on 2015/7/24.
 */
import {arrayfind} from './arrayService.js'
import {THREAD_TYPE} from '../constants/launchr'
import React, {PropTypes} from 'react';
export function getMessagesByThreadID(chatMessages, currentThreadID){
  return chatMessages.filter(message => (message.threadID === currentThreadID));
}

export function getThreadByThreadID(threadList,currentThreadID){
    return arrayfind(threadList,(value,index,array)=>{
        return value.threadID==currentThreadID;
    });
}


export function sortThreadList(threadList){
     threadList.sort(function(a,b){
        if(a.type==THREAD_TYPE.APP){
            return -1;
        }
        else if(b.type==THREAD_TYPE.APP){
            return 1;
        }
        else{
            return b.longDate-a.longDate;
        }
    });
}


export function contentSubstring(content,index){
        index=(index==null || index==undefined)?20:index;
        if(content.length>index){
            return content.substring(0,index)+'...';
        }
         return content;

}


export function splitTitle(title,content){
    let array= content.split(title);
    let titlearray=[];
    for(let i=0;i<array.length;i++){
        if(i!=0){
            titlearray.push(title);
        }
        if(array[i]!=''){
            titlearray.push(array[i]);
        }

    }
    return titlearray;
}

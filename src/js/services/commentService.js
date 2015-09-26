/**
 * Created by BennetWang on 2015/8/31.
 */

import request from 'reqwest';

export function getCommentList(data){
    return request({
        url:'/Base-Module/Comment/GetList',
        method:'Get',
        type:'json',
        contentType: "application/json",
        data:{
            appShowID:data.appShowID,
            rm_ShowID:data.rm_ShowID,
            pageIndex:data.pageIndex,
            pageSize:data.pageSize,
            timeStamp:data.timeStamp
        }
    });
}

export function sendComment(data){
    return request({
        url:'/Base-Module/Comment',
        method:'PUT',
        type:'json',
        contentType: "application/json",
        data:JSON.stringify({
            appShowID:data.appShowID,
            rm_ShowID:data.rm_ShowID,
            comment:data.comment,
            fileShowID:data.fileShowID,
            filePath:data.filePath,
            toUsers:data.toUsers,
            toUserNames:data.toUserNames,
            Title:data.Title,
            messageAppType:data.messageAppType,
            isNotSubscribe:data.isNotSubscribe
        })
    });
}

export function removeComment(data){
    return request({
        url:'/Base-Module/Comment',
        method:'DELETE',
        type:'json',
        contentType: "application/json",
        data:JSON.stringify({
            showID:data.showID
        })
    });
}
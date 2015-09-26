/**
 * Created by AllenFeng on 2015/8/24.
 */

//与事件相关
import request from 'reqwest';
import $ from 'jquery';
import moment from 'moment';
import {EVENT_TIME_FORMAT} from '../constants/launchr.js';
import React from 'react';
import {packRespnseData,checkRespnseSuccess} from './msbService.js';
//import PubSub from 'pubsub-js';
//import {REFRESH_EVENT, CHANGE_SLIDER, S,NEWMEETING_ID} from '../constants/launchr.js';

const occupiedMeetingClass = 'occupied';

//获得白板list
export function getWhiteBoards(data) {
        return request({
            url:'/Task-Module/Task/GetWhiteBoardList',
            method:'Get',
            type:"json",
            contentType:"application/json",
            data:{showId:data}
        })
}

//新增任务
export function addTask(data) {
    let memberData=transferMember(data.attendMembers);
    return request({
        url: '/Task-Module/Task/AddTask',
        method: 'Put',
        type: "json",
        contentType: "application/json",
        data: JSON.stringify({
            TITLE: data.title,
            P_SHOW_ID: data.project,
            T_PRIORITY: data.priority,
            T_USERS: memberData.memberNames,
            T_USERS_NAME: memberData.memberTrueName,
            T_END_TIME: data.endTime,
            T_IS_ANNEX: 0,
            T_PARENT_SHOW_ID: data.parentId,
            T_BACKUP: data.detail,
            fileShowIds: data.fileShowIds,
            methodType: "Put"
        })
    })
}

//更新任务
export function updateTask(data,type) {
    let memberData = {};
    if (!type) {
        memberData = transferMember(data.attendMembers);
    };
    return request({
        url: '/Task-Module/Task/UpdateTask',
        method: 'Post',
        type: "json",
        contentType: "application/json",
        data: JSON.stringify({
            SHOW_ID: data.showId,
            TITLE: data.title,
            P_SHOW_ID: data.project,
            T_PRIORITY: data.priority,
            T_USERS: memberData.memberNames,
            T_USERS_NAME: memberData.memberTrueName,
            T_END_TIME: data.endTime,
            T_IS_ANNEX: 0,
            T_PARENT_SHOW_ID: data.parentId,
            T_BACKUP: data.detail,
            S_SHOW_ID: data.statusId,
            fileShowIds: data.fileShowIds,
            UpdateType: type,
            methodType: "Post"
        })
    })
}

//删除任务
export function deleteTask(data) {
    return request({
        url:'/Task-Module/Task/DeleteTask',
        method:'Delete',
        type:"json",
        contentType:"application/json",
        data:JSON.stringify({
            SHOW_ID:data,
            methodType:"Delete"
        })
    })
}

//获得项目详情
export function getProjectDetail(data){
    return request({
        url:'/Task-Module/Task/GetProjectDetail',
        method:'Get',
        type:"json",
        contentType:"application/json",
        data:{
            showId:data
        }
    })
}


//获得任务详情
export function getTaskDetail(data) {
    return request({
        url:'/Task-Module/Task/GetTask',
        method:'Get',
        type:"json",
        contentType:"application/json",
        data:{
            showId:data.showId
        }
    })
}

//获得任务列表
export function getTaskList(data) {
    return request({
        url:'/Task-Module/Task/GetTaskList',
        method:'Get',
        type:"json",
        contentType:"application/json",
        data:{
            pageIndex:data.pageIndex,
            pageSize:15,
            type:2,
            statusId:data.statusId
        }
    })
}

//获得项目列表
export function getProjectList() {
    return request({
        url:'/Task-Module/Task/GetProjectList',
        method:'Get',
        type:"json",
        contentType:"application/json",
        data:{
            pageIndex:0
        }
    })
}

//获得未读任务消息列表
export function getUnReadMessageList() {
    return request({
        url:'/Base-Module/Message/MessageList',
        method:'Get',
        type:"json",
        contentType:"application/json",
        data:{
            pageIndex:0,
            timeStamp:new Date().getTime(),
            appShowID:'PWP56jQLLjFEZXLe',
            messageType:0
        }
    })
}

export function  _splitArray(arraylist,index) {
    var newArraylist=arraylist.slice();
    var retArray=[];
    if(newArraylist.length>0)
    {
        let cpm=arraylist.length%index;
        if(cpm!=0)
        {
            var arrayCpm=[];
            for(let j=0;j<cpm;j++ )
            {
                var object=newArraylist.pop();
                if(object)
                {
                    arrayCpm.push(object);
                }
            }
            retArray.push(arrayCpm.reverse());
        }
        while(newArraylist.length>0)
        {
            var array=[];
            for(let i=0;i<index;i++)
            {
                var object=newArraylist.pop();
                if(object)
                {
                    array.push(object);
                }
            }
            retArray.push(array.reverse());
        }
        retArray.reverse();//反转数组对象
    }
    return retArray;
}

//转换成员
function transferMember(members) {
    let memberStr = {
        memberNames: '',
        memberTrueName: ''
    };
    members.map((item, index)=> {
        memberStr.memberNames += (index == 0 ? '' : '●') + item.name;
        memberStr.memberTrueName += (index == 0 ? '' : '●') + item.trueName;
    });
    return memberStr;
}



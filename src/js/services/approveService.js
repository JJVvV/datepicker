/**
 * Created by RichardJi on 2015/9/7.
 */

import React, { PropTypes , Component} from 'react/addons.js';
import request from 'reqwest';
import $ from 'jquery';
import moment from 'moment';
import {sliderShow} from './slider.js';
import {REFRESH_APPROVE, CHANGE_SLIDER, S } from '../constants/launchr.js';
import PubSub from 'pubsub-js';
import {checkRespnseSuccess,packRespnseData} from '../services/msbService.js';

//滑出审批详情
export function sliderApproveDetail(approve) {
    getApprovalDetail(approve.id).then((res)=> {
        let retData = packRespnseData(res);
        if (checkRespnseSuccess(res)) {
            sliderShow({
                type: S.APPROVAL_DETAIL,
                approval: retData.Data
            });
        }
    });
}
//获取审批类型列表
export function getTypeList(){

    return request({
        url:'/Approve-Module/Approve/GetApproveTypeList',
        method: 'Get',
        type: "json",
        contentType: "application/json",
        data: {}
    })
}


//获取审批类型对应字段列表
export function getFieldList(showid){

    return request({
        url:'/Approve-Module/Approve/GetApproveTypeField',
        method: 'Get',
        type: "json",
        contentType: "application/json",
        data: {
            T_SHOW_ID:showid
        }
    })
}


//获取审批类型详情
export function getApproveTypeDetail(showid){

    return request({
        url:'/Approve-Module/Approve/ApproveTypeDetail',
        method: 'Get',
        type: "json",
        contentType: "application/json",
        data: {
            SHOW_ID:showid
        }
    })
}

//新增审批
export function putApprove(data) {
    let resData={},url='/Approve-Module/Approve', approve = getPersonString(data.A_APPROVE), cc = getPersonString(data.A_CC);
    
        resData={
            A_TITLE: data.A_TITLE,
            T_SHOW_ID: data.T_SHOW_ID,
            A_APPROVE: approve.user,
            A_APPROVE_NAME: approve.username,
            A_CC: cc.user,
            A_CC_NAME: cc.username,
            A_BACKUP: data.A_BACKUP,
            A_START_TIME: data.A_START_TIME,
            A_END_TIME: data.A_END_TIME,
            A_FEE: data.A_FEE,
            A_IS_URGENT: data.A_IS_URGENT,
            IS_DEADLINE_ALL_DAY: data.IS_DEADLINE_ALL_DAY,
            IS_TIMESLOT_ALL_DAY: data.IS_TIMESLOT_ALL_DAY,
            A_DEADLINE: data.A_DEADLINE,
            fileShowIds:data.fileShowIds
        };


    return request({
        url:url,
        method: 'Put',
        type: "json",
        contentType: "application/json",
        data: JSON.stringify(resData)
    }).then(res=>{
        
        PubSub.publish(REFRESH_APPROVE, res);
    return res;
        
        })
}

//更新审批
export function postApprove(data) {
    let resData={},url='/Approve-Module/Approve', cc = getPersonString(data.A_CC);
    resData={
        SHOW_ID: data.SHOW_ID,
        A_TITLE: data.A_TITLE,
        T_SHOW_ID: data.T_SHOW_ID,
        A_CC: cc.user,
        A_CC_NAME: cc.username,
        A_BACKUP: data.A_BACKUP,
        A_START_TIME: data.A_START_TIME,
        A_END_TIME: data.A_END_TIME,
        A_FEE: data.A_FEE,
        A_IS_URGENT: data.A_IS_URGENT,
        IS_DEADLINE_ALL_DAY: data.IS_DEADLINE_ALL_DAY,
        IS_TIMESLOT_ALL_DAY: data.IS_TIMESLOT_ALL_DAY,
        A_DEADLINE: data.A_DEADLINE,
        fileShowIds:data.fileShowIds
    };
    return request({
        url:url,
        method: 'Post',
        type: "json",
        contentType: "application/json",
        data: JSON.stringify(resData)
    }).then(res=>{
        
        PubSub.publish(REFRESH_APPROVE, res);
    return res; 
    })
        
}


//更新审批评论字段
export function postApproveComment(data) {
    let resData={},url='/Approve-Module/Approve/PostComment';
    resData={
        SHOW_ID: data.SHOW_ID,
        HAS_COMMENT: data.HAS_COMMENT
    };
    return request({
        url:url,
        method: 'Post',
        type: "json",
        contentType: "application/json",
        data: JSON.stringify(resData)
    }).then(res=>{

        PubSub.publish(REFRESH_APPROVE, res);
        return res;
    })

}

//搜索审批列表
export function getApproveSearchList(keyword)
{
    return request({
        url: '/Approve-Module/Approve/ApproveSearch',
        method: 'Get',
        type: "json",
        contentType: "application/json",
        data: {
            A_KEYWORD: keyword
        }
    })
}

//删除
export function deleteApprove(showid)
{
    return request({
        url: '/Approve-Module/Approve',
        method: 'Delete',
        type: "json",
        contentType: "application/json",
        data: JSON.stringify({
            SHOW_ID: showid,
        })
    }).then(res=>{

        PubSub.publish(REFRESH_APPROVE, res);
        return res;
    })
}

//获取详情
export function getApprovalDetail(showid)
{
    return request({
        url:'/Approve-Module/Approve',
        method:'get',
        data:{
            SHOW_ID:showid
        }
    }).then(res=>{
        PubSub.publish(REFRESH_APPROVE, res);
        return res;
    })
}

//转交审批
export function approveTransmit(showid, approveList, reason)
{
    let approve = getPersonString(approveList);
    return request({
        url:"/Approve-Module/Approve/ApproveTransmit",
        method:'post',
        type: "json",
        contentType: "application/json",
        data: JSON.stringify({
            SHOW_ID:showid,
            A_APPROVE: approve.user,
            A_APPROVE_NAME: approve.username,
            A_REASON: reason
        })
    }).then(res=>{

        PubSub.publish(REFRESH_APPROVE, res);
        return res;
    })
}

//操作审批
export function approveProcess(showid, result, reason)
{
    return request({
        url:"/Approve-Module/Approve/ApproveProcess",
        method:'post',
        type: "json",
        contentType: "application/json",
        data: JSON.stringify({
            SHOW_ID:showid,
            A_STATUS: result,
            A_REASON: reason
        })
    }).then(res=>{

        PubSub.publish(REFRESH_APPROVE, res);
        return res;
    })
}

//获取审批状态显示组件
export function getApproveStatus(status)
{
    switch(status)
    {
        case 'APPROVE':
            return <div className="approval">同意</div>;
        case 'WAITING':
            return <div className="wait">待审批</div>;
        case 'IN_PROGRESS':
            return <div className="proceed">进行中</div>;
        case 'DENY':
            return <div className="reject">否决</div>;
        case 'CALL_BACK':
            return <div className="return">打回</div>;
    }
}

//获取审批接收列表
export function getApproveReceiveList(atype, isProcess)
{
    return request({
        url:"/Approve-Module/Approve/GetApproveReceiveList",
        method:'get',
        data:{
            A_TYPE : atype,
            "pageIndex":0,
            "pageSize":0,
            "timeStamp":new Date().getTime() + 5000,
            "IS_PROCESS":isProcess
        }
    })    
}

//获取发出列表
export function getApproveSendList()
{
    return request({
        url:"/Approve-Module/Approve/GetApproveSendList",
        method:'get',
        data:{
            "pageIndex":0,
            "pageSize":0,
            "timeStamp":new Date().getTime() + 5000
        }
    })
}

export function getApproveUnreadMsg(readStatus, handleStatus, messageType, messageAppType)
{
    return request({
        url:"/Base-Module/Message/MessageList",
        method:'get',
        data:{
            "pageIndex":0,
            "pageSize":0,
            "timeStamp":new Date().getTime(),
            "appShowID":"ADWpPoQw85ULjnQk",
            "searchKey":"",
            "readStatus":readStatus,
            "handleStatus":handleStatus,
            "messageType":messageType,
            "messageAppTypes":messageAppType
        }
    })
}

//审批显示时间
export function approveShowDate(start,end,isAllDay, isDeadLine){
    let dateStr = '';
    if (start && end) {
        start = Number(start);
        end = Number(end);
        let dateStart = new Date(start);
        let dateEnd = new Date(end);
        let now = new Date();
        if (dateStart.getFullYear() == now.getFullYear() && dateStart.getFullYear() == dateEnd.getFullYear() && dateStart.getMonth() == dateEnd.getMonth() && dateStart.getDate() == dateEnd.getDate()) {
            if (isAllDay == 1) {
                dateStr = '今天';
                if(dateStart.getMonth() == now.getMonth() && dateStart.getDate() == now.getDate()){
                    dateStr =  '今天';
                } else{
                    dateStr =  (dateStart.getMonth() + 1) + '月' + dateStart.getDate() + '日';
                }
            }
            else {
                if(dateStart.getMonth() == now.getMonth() && dateStart.getDate() == now.getDate()){
                    dateStr =  '今天' + timeFormat(dateStart.getHours()) + ':' + timeFormat(dateStart.getMinutes()) + '~' + timeFormat(dateEnd.getHours()) + ':' + timeFormat(dateEnd.getMinutes());
                } else{
                    dateStr =  (dateStart.getMonth() + 1) + '月' + dateStart.getDate() + '日' + timeFormat(dateStart.getHours()) + ':' + timeFormat(dateStart.getMinutes()) + '~' + timeFormat(dateEnd.getHours()) + ':' + timeFormat(dateEnd.getMinutes());
                }
            }
        }
        else if (dateStart.getFullYear() == now.getFullYear() && dateStart.getFullYear() == dateEnd.getFullYear() && dateStart.getMonth() == dateEnd.getMonth() && dateStart.getDate() != dateEnd.getDate()) {
            if (isAllDay == 1) {
                dateStr = (dateStart.getMonth() + 1) + '月' + dateStart.getDate() + '日' + '~' + dateEnd.getDate() + '日';
            } else {
                dateStr = (dateStart.getMonth() + 1) + '月' + dateStart.getDate() + '日' + timeFormat(dateStart.getHours()) + ':' + timeFormat(dateStart.getMinutes()) + '~' + dateEnd.getDate() + '日' + timeFormat(dateEnd.getHours()) + ':' + timeFormat(dateEnd.getMinutes());
            }
        }
        else if (dateStart.getFullYear() == now.getFullYear() && dateStart.getFullYear() == dateEnd.getFullYear() && dateStart.getMonth() != dateEnd.getMonth()) {
            if (isAllDay == 1) {
                dateStr = (dateStart.getMonth() + 1) + '月' + dateStart.getDate() + '日' + '~' + (dateEnd.getMonth() + 1) + '月' + dateEnd.getDate() + '日';
            } else {
                dateStr = (dateStart.getMonth() + 1) + '月' + dateStart.getDate() + '日' + timeFormat(dateStart.getHours()) + ':' + timeFormat(dateStart.getMinutes()) + '~' + (dateEnd.getMonth() + 1) + '月' + dateEnd.getDate() + '日' + timeFormat(dateEnd.getHours()) + ':' + timeFormat(dateEnd.getMinutes());
            }
        }
        else {
            if (isAllDay == 1) {
                dateStr = dateStart.getFullYear() + '年' + (dateStart.getMonth() + 1) + '月' + dateStart.getDate() + '日' +  '~' + dateEnd.getFullYear() + '年' + (dateEnd.getMonth() + 1) + '月' + dateEnd.getDate() + '日';
            } else {
                dateStr = dateStart.getFullYear() + '年' + (dateStart.getMonth() + 1) + '月' + dateStart.getDate() + '日' + timeFormat(dateStart.getHours()) + ':' + timeFormat(dateStart.getMinutes()) + '~' + dateEnd.getFullYear() + '年' + (dateEnd.getMonth() + 1) + '月' + dateEnd.getDate() + '日' + timeFormat(dateEnd.getHours()) + ':' + timeFormat(dateEnd.getMinutes());
            }
        }
    }else if (start){
        start = Number(start);
        let dateStart = new Date(start);
        let now = new Date();
        if (dateStart.getFullYear() == now.getFullYear() && dateStart.getMonth() == now.getMonth() && dateStart.getDate() == now.getDate()) {
            if (isAllDay == 1) {
                dateStr = '今天';
            }
            else if (isDeadLine == 1){
                dateStr =  '今天' + timeFormat(dateStart.getHours()) + ':' + timeFormat(dateStart.getMinutes());
            }else{
                dateStr =  timeFormat(dateStart.getHours()) + ':' + timeFormat(dateStart.getMinutes());
            }
        }
        else if (dateStart.getFullYear() == now.getFullYear() && dateStart.getMonth() == now.getMonth()){
            if (isAllDay == 1) {
                dateStr = (dateStart.getMonth() + 1) + '月' + dateStart.getDate() + '日';
            } else {
                dateStr = (dateStart.getMonth() + 1) + '月' + dateStart.getDate() + '日 ' + timeFormat(dateStart.getHours()) + ':' + timeFormat(dateStart.getMinutes());
            }
        } else if (dateStart.getFullYear() == now.getFullYear()){
            if (isAllDay == 1) {
                dateStr = (dateStart.getMonth() + 1) + '月' + dateStart.getDate() + '日';
            } else {
                dateStr = (dateStart.getMonth() + 1) + '月' + dateStart.getDate() + '日 ' + timeFormat(dateStart.getHours()) + ':' + timeFormat(dateStart.getMinutes());
            }
        } else {
            if (isAllDay == 1) {
                dateStr = dateStart.getFullYear() + '年' + (dateStart.getMonth() + 1) + '月' + dateStart.getDate() + '日';
            } else {
                dateStr = dateStart.getFullYear() + '年' + (dateStart.getMonth() + 1) + '月' + dateStart.getDate() + '日 ' + timeFormat(dateStart.getHours()) + ':' + timeFormat(dateStart.getMinutes());
            }
        }
    }
    return dateStr;
}

function timeFormat(time){
    if(time.toString().length==1)
    {
        return '0'+time;
    }
    else
    {
        return time
    }
}

function getPersonString(list){
    let strPerson = {
        user:'',
        username:''
    };
    list.map((item, index)=>{
        if (index == 0){
            if (item.USER){
                strPerson.user = item.USER;
                strPerson.username = item.USER_NAME;
            }else{
                strPerson.user = item.name;
                strPerson.username = item.trueName;
            }
        }else{
            if (item.USER){
                strPerson.user +=  '●' + item.USER;
                strPerson.username += '●' + item.USER_NAME;
            }else{
                strPerson.user += '●' +  item.name;
                strPerson.username += '●' +  item.trueName;
            }
        }
    });
    return strPerson;
}



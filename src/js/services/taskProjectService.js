/**
 * Created by ArnoYao on 2015/9/11.
 */

import request from 'reqwest';
import $ from 'jquery';
//import moment from 'moment';
import {checkRespnseSuccess,packRespnseData} from '../services/msbService.js';

//展示的模块
export function getShowModule(data) {
    /*    isHasHistory(data).then((res)=> {
     let data = packRespnseData(res);
     if (checkRespnseSuccess(res)) {
     }
     else {
     }
     });*/
}

//获取上一次浏览记录
function isHasHistory(data) {
    /*    return request({
     url:"/Schedule-Module/Task/",
     method:'get',
     data:{
     user: data.currentname
     }
     })*/
}

//获取查询的任务列表
export function getTaskSearchList(data) {
    switch (data.type) {
        case 100:
            data.type=5;
            data.endStartTime = getEndNowDate();
            data.endEndTime = getEndNowDate()+1000*60*60*24;
            break;
        case 101:
            data.type=5;
            data.endStartTime = Number(new Date());
            data.endEndTime = Number(new Date()) + 1000 * 60 * 60 * 24 * 7;
            break;
        default :
            break;
    }

    return request({
        url: "/Task-Module/Task/GetTaskList",
        method: 'Get',
        data: {
            pageIndex: data.pageIndex,
            pageSize: data.pageSize,
            searchKey: data.searchKey || '',
            type: data.type,
            projectId: data.projectId || '',
            statusType: data.statusType || '',
            statusId: data.statusId || '',
            attendUser: data.attendUser || '',
            sendUser: data.sendUser || '',
            endStartTime: data.endStartTime || 0,
            endEndTime: data.endEndTime || 0
        }
    })
}

//获取项目列表
export function getProjectList(data)
{
    return request({
        url: "/Task-Module/Task/GetProjectList",
        method: 'Get',
        data: {
            pageIndex: data.pageIndex || 0,
            pageSize: data.pageSize || 0,
            searchKey: data.searchKey || ''
        }
    })
}

//编辑或新增项目
export function postNewProject(data) {
    let reqData = {}, url = '', method = '';
    if (data.showId) {
        url = "/Task-Module/Task/ProjectEdit";
        method = 'Post';
        reqData = {
            showId: data.showId,
            name: data.name || '',
            members: data.members
        };
    } else {
        url = "/Task-Module/Task/ProjectAdd";
        method = 'Put';
        reqData = {
            name: data.name || '',
            members: data.members
        };
    }
    return request({
        url: url,
        method: method,
        type: "json",
        contentType: "application/json",
        data: JSON.stringify(reqData)
    })
}

//获取项目详情
export function getProjectDatail(data)
{
    return request({
        url:'/Task-Module/Task/GetProjectDetail',
        method:'Get',
        data:{
            showId:data.showId
        }
    })
}

//删除项目
export function deleteProject(data)
{
    return request({
        url: '/Task-Module/Task/ProjectDelete',
        method: 'Delete',
        type: "json",
        contentType: "application/json",
        data: JSON.stringify({
            showId: data.showId
        })
    })
}

//第二天
function getEndNowDate()
{
    let nowDate=new Date();
    let endDate= new Date(nowDate.getFullYear(),nowDate.getMonth(),nowDate.getDate());
    return Number(endDate);
}
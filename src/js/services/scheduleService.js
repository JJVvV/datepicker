/**
 * Created by ArnoYao on 2015/8/24.
 */

import request from 'reqwest';
import $ from 'jquery';
import moment from 'moment';
import {sliderShow} from './slider.js';
import {S} from '../constants/launchr.js';
import reduxContainer from './reduxContainer.js';
import {schedule} from '../i18n/index.js';

//滑出事件和会议的详情
export function sliderDetail(param){
    switch(param.type) {
        case 'event':
        case 'event_sure':
            sliderShow({
                    type:S.EVENT_DETAIL,
                    event:
                    {
                        id:param.id,
                        startTime:param.startTime,
                        type:param.type,
                        isAllDay:param.isAllDay,
                        relateId:param.relateId
                    }
                }
            );
            break;
        case 'meeting':
            sliderShow({
                    type:S.MEETING_DETAIL,
                    meeting:
                    {
                        id:param.relateId,
                        startTime:param.startTime,
                        type:param.type,
                        repeatType:param.repeatType,
                        msgID:param.msgID
                    }
                }
            );
            break;
        default :break;
    }
}

//新增/修改事件和候补事件
export function postNewEvent(data) {
    let start=[],end=[];
    $.each(data.standbyTimerList,function(index,item){
        start.push(item.start);
        end.push(item.end);
    });

    let type='event';
    if(start.length>1) {
        type = 'event_sure'
    };

    let resData={},url='';
    if(data.showId)
    {
        url='/Schedule-Module/Schedule/Edit';
        resData={
            showId:data.showId,
            title: data.title,
            place: data.place,
            lngx: data.lngx ||'',
            laty: data.laty||'',
            isImportant: data.important ? 1 : 0,
            isAllDay: data.allDay ? 1 : 0,
            start: start,
            end: end,
            content: data.content,
            type: type,
            repeatType:data.repeatCycle,
            remindType: data.remindTimer,
            relateId:data.relateId,
            initialStartTime:data.initialStartTime,
            saveType:data.saveType
        }
    }else
    {
        url= '/Schedule-Module/Schedule/Save';
        resData={
            title: data.title,
            place: data.place,
            lngx: data.lngx ||'',
            laty: data.laty||'',
            isImportant: data.important ? 1 : 0,
            isAllDay: data.allDay ? 1 : 0,
            start: start,
            end: end,
            content: data.content,
            type: type,
            repeatType:data.repeatCycle,
            remindType: data.remindTimer
        };
    }

    return request({
        url:url,
        method: 'Post',
        type: "json",
        contentType: "application/json",
        data: JSON.stringify(resData)
    })
}

//确定候补事件
export function postSureEvent(data)
{
    return request({
        url: '/Schedule-Module/Schedule/Sure',
        method: 'Post',
        type: "json",
        contentType: "application/json",
        data: JSON.stringify({
            showId: data
        })
    })
}

//删除
export function postDeleteEvent(data)
{
    return request({
        url: '/Schedule-Module/Schedule',
        method: 'Delete',
        type: "json",
        contentType: "application/json",
        data: JSON.stringify({
            showId: data.showId,
            initialStartTime:data.initialStartTime,
            saveType:data.saveType
            //relateId:'',
        })
    })
}

//获取详情
export function GetEventDatail(data)
{
    return request({
        url:'/Schedule-Module/Schedule',
        method:'get',
        data:{
            showId:data.id,
            initialStartTime:data.startTime
        }
    })
}

//获取日程列表
export function GetEventList(data)
{
    return request({
        url:"/Schedule-Module/Schedule/GetList",
        method:'get',
        data:{
            startTime: moment(data.start).format("X").toString() + "000",
            endTime: moment(data.end).format("X").toString() + "000",
            user: data.user
        }
    })
}

//获取当前登录用户相关信息
export function getCurrentInfo() {
    let currentInfo = reduxContainer.get().getState().userinfo.me;
    let userInfo={
        url: currentInfo.avator||'',
        name: currentInfo.loginName ||'',
        trueName: currentInfo.name||''
    };
    return userInfo;
}

//处理日历显示时间
export function calendarShowDate(start,end,isAllDay){
    let dateStr = '';
    if (start != '' && end != '') {
        start = Number(start);
        end = isAllDay!=1? Number(end):Number(end)-1000*60*60*24;
        let dateStart = new Date(start);
        let dateEnd = new Date(end);

        if (dateStart.getFullYear() == new Date().getFullYear() && dateStart.getFullYear() == dateEnd.getFullYear() && dateStart.getMonth() == dateEnd.getMonth() && dateStart.getDate() == dateEnd.getDate()) {
            if (isAllDay == 1) {
                dateStr = schedule.AllDay;
            }
            else {
                dateStr =  timeFormat(dateStart.getHours()) + ':' + timeFormat(dateStart.getMinutes());
            }
        }
        else if (dateStart.getFullYear() == new Date().getFullYear() && dateStart.getFullYear() == dateEnd.getFullYear() && dateStart.getMonth() == dateEnd.getMonth() && dateStart.getDate() != dateEnd.getDate()) {
            if (isAllDay == 1) {
                dateStr = dateStart.getMonth() + 1 + schedule.Month + dateStart.getDate() + schedule.Day + '~' + dateEnd.getDate() + schedule.Day;
            } else {
                dateStr = dateStart.getMonth() + 1 + schedule.Month + dateStart.getDate() + schedule.Day + timeFormat(dateStart.getHours()) + ':' + timeFormat(dateStart.getMinutes()) + '~' + dateEnd.getDate() + schedule.Day + timeFormat(dateEnd.getHours()) + ':' + timeFormat(dateEnd.getMinutes());
            }
        }
        else if (dateStart.getFullYear() == new Date().getFullYear() && dateStart.getFullYear() == dateEnd.getFullYear() && dateStart.getMonth() != dateEnd.getMonth()) {
            if (isAllDay == 1) {
                dateStr = dateStart.getMonth() + 1 + schedule.Month + dateStart.getDate() + schedule.Day + '~' + (dateEnd.getMonth() + 1) + schedule.Month + dateEnd.getDate() + schedule.Day;
            } else {
                dateStr = dateStart.getMonth() + 1 + schedule.Month + dateStart.getDate() + schedule.Day + timeFormat(dateStart.getHours()) + ':' + timeFormat(dateStart.getMinutes()) + '~' + (dateEnd.getMonth() + 1) +schedule.Month + dateEnd.getDate() + schedule.Day + timeFormat(dateEnd.getHours()) + ':' + timeFormat(dateEnd.getMinutes());
            }
        }
        else {
            if (isAllDay == 1) {
                dateStr = dateStart.getFullYear() + schedule.Year + dateStart.getMonth() + 1 + schedule.Month + dateStart.getDate() + schedule.Day +  '~' + dateEnd.getFullYear() + schedule.Year + dateEnd.getMonth() + 1 + schedule.Month + dateEnd.getDate() + schedule.Day;
            } else {
                dateStr = dateStart.getFullYear() + schedule.Year + dateStart.getMonth() + 1 + schedule.Month + dateStart.getDate() + schedule.Day + timeFormat(dateStart.getHours()) + ':' + timeFormat(dateStart.getMinutes()) + '~' + dateEnd.getFullYear() + schedule.Year + dateEnd.getMonth() + 1 + schedule.Month + dateEnd.getDate() + schedule.Day + timeFormat(dateEnd.getHours()) + ':' + timeFormat(dateEnd.getMinutes());
            }
        }
    }
    return dateStr;
}

function timeFormat(time)
{
    if(time.toString().length==1)
    {
        return '0'+time;
    }
    else
    {
        return time
    }
}

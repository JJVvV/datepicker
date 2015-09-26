/**
 * Created by AllenFeng on 2015/8/24.
 */

//与事件相关
import request from 'reqwest';
import $ from 'jquery';
import moment from 'moment';
import {EVENT_TIME_FORMAT} from '../constants/launchr.js';
import React from 'react';
import {packRespnseData} from './msbService.js';
import PubSub from 'pubsub-js';
import {REFRESH_EVENT, CHANGE_SLIDER, S,NEWMEETING_ID} from '../constants/launchr.js';

const occupiedMeetingClass = 'occupied';

//新增会议
export function postNewMeeting(data) {
    let must=transferMember(data.mustAttend);
    let optional=transferMember(data.optionalAttend);

    if(data.showId!='')
    {
        postEditOneMeeting(data);
    }
    else
    {
        return request({
            url:'/Schedule-Module/Meeting',
            method:'Post',
            type:"json",
            contentType:"application/json",
            data:JSON.stringify({
                M_TITLE:data.title,
                M_CONTENT:data.note,
                M_START:data.start,
                M_END:data.end,
                R_SHOW_ID:data.currentRoom,
                M_EXTERNAL:data.outMeetingRoom,
                M_LNGX:'',
                M_LATY:'',
                M_REQUIRE_JOIN:must.memberNames,
                M_REQUIRE_JOIN_NAME:must.memberTrueNames,
                M_JOIN:optional.memberNames,
                M_JOIN_NAME:optional.memberTrueNames,
                M_RESTART_TYPE:data.repeatCycle,
                M_REMIND_TYPE:data.remindTimer,
                methodType:"Put"
            })
        })
    }

}

//获得会议室
export function getMeetingRooms() {
    return request({
        url:'/Schedule-Module/Meeting/GetMeetingRoom',
        method:'Get',
        type:'json',
        contentType:'application/json'
    });
}

//获得非空会议室
export function getUnfreeRoomList(data) {
    return request({
        url:'/Schedule-Module/Schedule/GetUnFreeMeetingRoomList',
        method:'Get',
        type:'json',
        contentType: "application/json",
        data:{
            startTime:data.startTime,
            endTime:data.endTime,
            M_SHOW_ID:data.showId,
            meetingStartTime:data.meetingStart,
            meetingEndTime:data.meetingEnd,
            editType:data.editType
        }
    });

}

//获取会议详情
export function getMeetingDetail(data) {
    return request({
        url:'/Schedule-Module/Meeting',
        method:'Get',
        type:'json',
        contentType:'application/json',
        data:{
               SHOW_ID:data.id,
               OWNER_USER:data.createUser
             }
    })
}

//获得不可选时间段的日程
export function getScheduleForMeeting(data) {
    return request({
        url:'/Schedule-Module/Schedule/GetList',
        method:'Get',
        type:'json',
        contentType:'application/json',
        data:{
            user:data.user,
            startTime:data.startTime,
            endTime:data.endTime
        }
    }).then(res=>{
        if(res.Header.IsSuccess && res.Body.response!=null && res.Body.response.IsSuccess)
        {
            return res.Body.response.Data.map(function(item,index){
                return {
                    user:item.createUser,
                    name:item.createUserName,
                    title:item.title,
                    time:timeReversal(item.startTime,item.endTime).currentDate,
                    place:item.place
                }
            })
        }
        else
        {
            return [];
        }
    })
}

//删除会议
export function deleteMeeting(data) {
    return request({
        url:'/Schedule-Module/Meeting',
        method:'Delete',
        type:'json',
        contentType:'application/json',
        data:JSON.stringify({
            SHOW_ID: data.id,
            MEETING_START:data.startTime
        })
    })
}

//删除此条重复会议
export function postDeleteOneEvent(data) {
     return request({
        url: '/Schedule-Module/Schedule',
        method: 'Delete',
        type: "json",
        contentType: "application/json",
        data: JSON.stringify({
            relateId: data.showId,
            initialStartTime:data.initialStartTime,
            saveType:0
        })
    }).then(res=>{
        if(res.Body.response.IsSuccess)
        {
            if(res.Body.response.Data.isNeedEdit===1)
            {
                let must=transferMember(data.mustAttend);
                let optional=transferMember(data.optionalAttend);

                if(data.showId!='')
                {
                    return request({
                        url:'/Schedule-Module/Meeting',
                        method:'Post',
                        type:"json",
                        contentType:"application/json",
                        data:JSON.stringify({
                            SHOW_ID:data.showId,
                            M_TITLE:data.title,
                            M_CONTENT:data.note,
                            R_SHOW_ID:data.currentRoom,
                            M_EXTERNAL:data.outMeetingRoom,
                            M_LNGX:'',
                            M_LATY:'',
                            M_REQUIRE_JOIN:must.memberNames,
                            M_REQUIRE_JOIN_NAME:must.memberTrueNames,
                            M_JOIN:optional.memberNames,
                            M_JOIN_NAME:optional.memberTrueNames,
                            M_RESTART_TYPE:0,
                            M_REMIND_TYPE:data.remindTimer,
                            S_START_TIME:data.s_startTime,
                            UPDATE_TYPE:1,
                            methodType:"Post"
                        })
                    })
                            .then(res=>{
                            PubSub.publish(REFRESH_EVENT, res);
                            return res;
                        })
                }
            }
            else
            {
                PubSub.publish(REFRESH_EVENT, res);
                return res;
            }
        }
         else
        {
            alert(res.Body.response.Reason);
            return res;
        }
    })
}

//删除此条所有的重复会议
export function postDeleteAllEvent(data) {
    return request({
        url: '/Schedule-Module/Schedule',
        method: 'Delete',
        type: "json",
        contentType: "application/json",
        data: JSON.stringify({
            relateId: data.showId,
            initialStartTime:data.initialStartTime,
            saveType:1
        })
    }).then(res=>{

            if(res.Body.response.IsSuccess)
            {
                if(res.Body.response.Data.isNeedEdit===1)
                {
                    let must=transferMember(data.mustAttend);
                    let optional=transferMember(data.optionalAttend);


                    if(data.showId!='')
                    {
                        return request({
                            url:'/Schedule-Module/Meeting',
                            method:'Post',
                            type:"json",
                            contentType:"application/json",
                            data:JSON.stringify({
                                SHOW_ID:data.showId,
                                M_TITLE:data.title,
                                M_CONTENT:data.note,
                                R_SHOW_ID:data.currentRoom,
                                M_EXTERNAL:data.outMeetingRoom,
                                M_LNGX:'',
                                M_LATY:'',
                                M_REQUIRE_JOIN:must.memberNames,
                                M_REQUIRE_JOIN_NAME:must.memberTrueNames,
                                M_JOIN:optional.memberNames,
                                M_JOIN_NAME:optional.memberTrueNames,
                                M_RESTART_TYPE:0,
                                M_REMIND_TYPE:data.remindTimer,
                                S_START_TIME:data.s_startTime,
                                UPDATE_TYPE:1,
                                methodType:"Post"
                            })
                        }).then(res=>{
                            if(res.Body.response.IsSuccess)
                            {
                                PubSub.publish(REFRESH_EVENT, res);
                                return res;
                            }
                        })
                    }
                }
                else
                {
                    PubSub.publish(REFRESH_EVENT, res);
                    return res;
                }
            }
            else
            {
                return res;
            }
        })
}

//编辑此条会议
export function postEditOneMeeting(data) {
    return request({
        url: '/Schedule-Module/Schedule',
        method: 'Delete',
        type: "json",
        contentType: "application/json",
        data: JSON.stringify({
            relateId: data.showId,
            initialStartTime:data.s_startTime,
            saveType:0
        })
    }).then(res=>{
        if(res.Body.response.IsSuccess)
        {
            let must=transferMember(data.mustAttend);
            let optional=transferMember(data.optionalAttend);

            return request({
                url:'/Schedule-Module/Meeting',
                method:'Post',
                type:"json",
                contentType:"application/json",
                data:JSON.stringify({
                    endTime:res.Body.response.Data.endTime,
                    M_TITLE:data.title,
                    M_CONTENT:data.note,
                    M_START:data.start,
                    M_END:data.end,
                    R_SHOW_ID:data.currentRoom,
                    M_EXTERNAL:data.outMeetingRoom,
                    M_LNGX:'',
                    M_LATY:'',
                    M_REQUIRE_JOIN:must.memberNames,
                    M_REQUIRE_JOIN_NAME:must.memberTrueNames,
                    M_JOIN:optional.memberNames,
                    M_JOIN_NAME:optional.memberTrueNames,
                    M_RESTART_TYPE:data.repeatCycle,
                    M_REMIND_TYPE:data.remindTimer,
                    methodType:"Put"
                })
            }).then(res=>{
                if(res.Body.response.IsSuccess)
                {
                    PubSub.publish(REFRESH_EVENT, res);
                    return res;
                }
                else
                {
                    alert(res.Body.response.Reason);
                }
            })
        }
        else
        {
            return res;
        }
    })
}

//编辑所有会议
export function postEditAllMeeting(data) {
    return request({
        url: '/Schedule-Module/Schedule',
        method: 'Delete',
        type: "json",
        contentType: "application/json",
        data: JSON.stringify({
            relateId: data.showId,
            initialStartTime:data.s_startTime,
            saveType:1
        })
    }).then(res=>{
        let must=transferMember(data.mustAttend);
        let optional=transferMember(data.optionalAttend);

        if(res.Body.response.IsSuccess)
        {
            return request({
                url:'/Schedule-Module/Meeting',
                method:'Post',
                type:"json",
                contentType:"application/json",
                data:JSON.stringify({
                    endTime:res.Body.response.Data.endTime,
                    M_TITLE:data.title,
                    M_CONTENT:data.note,
                    M_START:data.start,
                    M_END:data.end,
                    R_SHOW_ID:data.currentRoom,
                    M_EXTERNAL:data.outMeetingRoom,
                    M_LNGX:'',
                    M_LATY:'',
                    M_REQUIRE_JOIN:must.memberNames,
                    M_REQUIRE_JOIN_NAME:must.memberTrueNames,
                    M_JOIN:optional.memberNames,
                    M_JOIN_NAME:optional.memberTrueNames,
                    M_RESTART_TYPE:data.repeatCycle,
                    M_REMIND_TYPE:data.remindTimer,
                    methodType:"Put"
                })
            }).then(res=>{
                if(res.Body.response.IsSuccess)
                {
                    PubSub.publish(REFRESH_EVENT, res);
                }
                else
                {
                    return res.Body.response.Reason;
                }
            })
        }
        else
        {
            return res;
        }
    })
}

//处理会议
export function handleMeeting(meeting){
    return request({
        url: '/Schedule-Module/Meeting/MeetingConfirm',
        method: 'POST',
        type: "json",
        contentType: "application/json",
        data: JSON.stringify({
            M_SHOW_ID: meeting.showId,
            O_IS_AGREE:meeting.isAgree,
            O_REASON:meeting.reason
        })
    })
}


//时间段
export function timeReversal(start,end,isAllDay) {
    var timeStr = {currentDate: '', intervalTime: ''};
    if (start != '' && end != '') {
        start = Number(start);
        end = Number(end);
        let timeSpan = end - start;
        let days = Math.floor(timeSpan / (24 * 3600 * 1000));
        let leave1 = timeSpan % (24 * 3600 * 1000);
        let hrs = Math.floor(leave1 / (3600 * 1000));
        let leave2 = leave1 % (3600 * 1000);
        let min = Math.floor(leave2 / (60 * 1000));

        let weekDayStart = '';
        let weekDayEnd = '';
        let dateStart = new Date(start);
        let dateEnd = new Date(end);
        let diff = isAllDay == 1 ? '' : (moment(dateEnd).diff(moment(dateStart), 'minutes') / 60).toFixed(1);
        weekDayStart = getWeekDay(dateStart);
        weekDayEnd = getWeekDay(dateEnd);

        let date = '';
        if (dateStart.getFullYear() == new Date().getFullYear() && dateStart.getFullYear() == dateEnd.getFullYear() && dateStart.getMonth() == dateEnd.getMonth() && dateStart.getDate() == dateEnd.getDate()) {
            if (isAllDay == 1) {
                date = dateStart.getMonth() + 1 + '月' + dateStart.getDate() + '日(' + weekDayStart + ')';
            }
            else {
                date = dateStart.getMonth() + 1 + '月' + dateStart.getDate() + '日(' + weekDayStart + ')' + timeFormat(dateStart.getHours()) + ':' + timeFormat(dateStart.getMinutes()) + '~' + timeFormat(dateEnd.getHours()) + ':' + timeFormat(dateEnd.getMinutes());
            }
        }
        else if (dateStart.getFullYear() == new Date().getFullYear() && dateStart.getFullYear() == dateEnd.getFullYear() && dateStart.getMonth() == dateEnd.getMonth() && dateStart.getDate() != dateEnd.getDate()) {
            if (isAllDay == 1) {
                date = dateStart.getMonth() + 1 + '月' + dateStart.getDate() + '日' + '~' + dateEnd.getDate() + '日';
            } else {
                date = dateStart.getMonth() + 1 + '月' + dateStart.getDate() + '日' + timeFormat(dateStart.getHours()) + ':' + timeFormat(dateStart.getMinutes()) + '~' + dateEnd.getDate() + '日' + timeFormat(dateEnd.getHours()) + ':' + timeFormat(dateEnd.getMinutes());
            }
        }
        else if (dateStart.getFullYear() == new Date().getFullYear() && dateStart.getFullYear() == dateEnd.getFullYear() && dateStart.getMonth() != dateEnd.getMonth()) {
            if (isAllDay == 1) {
                date = dateStart.getMonth() + 1 + '月' + dateStart.getDate() + '日' + '~' + (dateEnd.getMonth() + 1) + '月' + dateEnd.getDate() + '日';
            } else {
                date = dateStart.getMonth() + 1 + '月' + dateStart.getDate() + '日' + timeFormat(dateStart.getHours()) + ':' + timeFormat(dateStart.getMinutes()) + '~' + (dateEnd.getMonth() + 1) + '月' + dateEnd.getDate() + '日' + timeFormat(dateEnd.getHours()) + ':' + timeFormat(dateEnd.getMinutes());
            }
        }
        else {
            if (isAllDay == 1) {
                date = dateStart.getFullYear() + '年' + dateStart.getMonth() + 1 + '月' + dateStart.getDate() + '日' +  '~' + dateEnd.getFullYear() + '年' + dateEnd.getMonth() + 1 + '月' + dateEnd.getDate() + '日';
            } else {
                date = dateStart.getFullYear() + '年' + dateStart.getMonth() + 1 + '月' + dateStart.getDate() + '日' + timeFormat(dateStart.getHours()) + ':' + timeFormat(dateStart.getMinutes()) + '~' + dateEnd.getFullYear() + '年' + dateEnd.getMonth() + 1 + '月' + dateEnd.getDate() + '日' + timeFormat(dateEnd.getHours()) + ':' + timeFormat(dateEnd.getMinutes());
            }
        }

        timeStr.currentDate = date;
        timeStr.intervalTime = diff;
    }
    return timeStr;
}

//会议时间显示
export function getTimeReversalDetail(start,end){
    let data=timeReversal(start,end);
    return (<div className="meeting-detail-line" >
        <i className=" toolbar icon-glyph-89"></i>
        <span>{data.currentDate}</span>
        <span className="time">&nbsp;{data.intervalTime}小时</span>
    </div>);
}

function timeFormat(time) {
    if(time.toString().length==1)
    {
        return '0'+time;
    }
    else
    {
        return time
    }
}

function getWeekDay(day) {
    let weekDay='';
    switch (new Date(day).getDay()) {
            case 0:
                weekDay = '周日';
                break;
            case 1:
                weekDay = '周一';
                break;
            case 2:
                weekDay = '周二';
                break;
            case 3:
                weekDay = '周三';
                break;
            case 4:
                weekDay = '周四';
                break;
            case 5:
                weekDay = '周五';
                break;
            case 6:
                weekDay = '周六';
                break;
        default :weekDay='未知';break;
    }
    return weekDay;
}

export function getOccupiedTimeList(data){
    return request({
        url:'/Schedule-Module/Schedule/GetUnFreeMeetingListForWeb',
        method:'Get',
        type:'json',
        contentType: "application/json",
        data:{
            user:data.user,
            startTime:data.start,
            endTime:data.end,
            M_SHOW_ID:data.meetingId,
            meetingStartTime:data.meetingStart,
            meetingEndTime:data.meetingEnd,
            editType:data.editType
        }
    }).then((res) => {
            if(!res.Body.response.IsSuccess) throw new Error(res.Body.response.Reason);

            return res.Body.response.Data;
        })
        .then(revertTimerUsedOnCalendarEvent)


        .catch((err) => {
        console.log(err);
    });
}

function addID(events){
    if(events.length <= 1) return {...events, id:0};
    let i=0, j=0;



    while(i < events.length){
        if(i === 0){
            events[i].id = i;
        }else if(events[i-1].endTime === events[i].startTime){
            events[i].id = events[i-1].id;
        }
        i++;
    }
    return events;
}

export function revertTimerUsedOnCalendarEvent(timerList){
    return timerList.map(function(timer,index){
            if(timer.isFree)
            {
                return {
                    start: getTimerUsedOnCalendarEvent(timer.startTime),
                    end: getTimerUsedOnCalendarEvent(timer.endTime),
                    id: NEWMEETING_ID,
                    editable: true
                }
            }
            else
            {
                return{
                    start: getTimerUsedOnCalendarEvent(timer.startTime),
                    end:getTimerUsedOnCalendarEvent(timer.endTime),
                    className:occupiedMeetingClass,
                    id:timer.id
                }
            }
        }
    );
}

function getTimerUsedOnCalendarEvent(timer){
    return moment(timer).format(EVENT_TIME_FORMAT);
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
        memberTrueNames: ''
    };
    members.map((item, index)=> {
        memberStr.memberNames += (index == 0 ? '' : '●') + item.name;
        memberStr.memberTrueNames += (index == 0 ? '' : '●') + item.trueName;
    });
    return memberStr;
}



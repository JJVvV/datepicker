/**
 * Created by Administrator on 2015/7/10.
 */




import fetch from 'isomorphic-fetch';
import RouterContainer from '../services/routerContainer.js';
import ReduxContainer from '../services/reduxContainer.js';
import testJSON from '../test/json_test.js';
import request from 'reqwest';
import moment from 'moment';
import $ from 'jquery';


import {arrayfind,arrayfindArray} from '../services/arrayService.js';
import generateUniqueID from '../services/uniqueIDService.js';
import {getThreadByThreadID,sortThreadList} from '../services/messageService.js';
import {getcontractUserInfoByID} from '../services/contractService.js';
import {ThreadListDate} from '../services/dateService.js';
import {checkRespnseSuccess,packRespnseData} from '../services/msbService.js';
import SignalR from  '../lib/jquery.signalR-2.2.0.js';
import {GetEventDatail} from '../services/scheduleService.js';
import{getMeetingDetail,handleMeeting} from '../services/meetingService.js';
import {getApprovalDetail,getApproveTypeDetail} from '../services/approveService.js';
import {getTaskDetail} from '../services/taskService.js';

const MAIN_URL = '';

import {CHAT_URL,
    LOAD_THREADLIST,
    ADD_CHATMESSAGES,
    CHANGE_THREADID,
    CHANGE_THREAD,
    GETCURRENT_USER,
    REMOVE_CHATMESSAGES,
    MODIFY_MESSAGE,
    THREAD_TYPE,
    MESSAGE_TYPE,
    MESSAGE_APP_TYPE,
    DEFAULT_AVATAR
} from '../constants/launchr.js';



//加载App应用的会话
export function loadThreadAppList() {
    return (dispatch, getState)=> {
        return request({
            url: '/Base-Module/CompanyApp/GetAppList',
            method: 'get',
            type: 'json',
            contentType: 'application/json'
        }).then(res=> {
            if (checkRespnseSuccess(res)) {
                var response = packRespnseData(res);
                let chatState = getState().chat;
                let currentThreadList = $.extend(true, [], chatState.threadList);
                let threadList = response.Data.map(function (item, index) {
                    return {
                        avator: "/redux-launchr/public/img/zhangqiuyan.jpg",
                        threadID: item.appShowID,
                        title: item.appName,
                        info: "",
                        timer: "",
                        longDate: 0,
                        type: THREAD_TYPE.APP,
                        code: item.appCode,
                        count: 0

                    }
                });
                currentThreadList = currentThreadList.concat(threadList);
                sortThreadList(currentThreadList);
                return dispatch({
                    type: LOAD_THREADLIST,
                    threadList: currentThreadList
                })
            }
        })
    }

}

//加载App应用最后一条消息
export function loadAppLastMsg() {
    return (dispatch, getState)=> {
        let chatState = getState().chat;
        var appThreadList = arrayfindArray(chatState.threadList, function (value, index, array) {
            return value.type == THREAD_TYPE.APP;
        });
        appThreadList = appThreadList.map(function (item, index) {
            return item.threadID;
        });
        return request({
            url: '/Base-Module/Message/LastMessageList',
            method: 'post',
            type: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                appShowIDs: appThreadList
            })
        }).then(res=> {
            if (checkRespnseSuccess(res)) {
                var response = packRespnseData(res);
                let chatState = getState().chat;
                let currentThreadList = $.extend(true, [], chatState.threadList);
                response.Data.map(function (item, index) {
                    if (item.lastMessage != null) {
                        var thread = arrayfind(currentThreadList, function (value, index, array) {
                            return value.threadID == item.appShowID;
                        });
                        thread != undefined ? thread.info = item.lastMessage.title : "";
                        thread != undefined ? thread.longDate = item.lastMessage.createTime : "";
                        thread != undefined ? thread.timer = ThreadListDate(item.lastMessage.createTime) : "";
                        thread != undefined ? thread.count = item.count : "";
                    }
                });
                return dispatch({
                    type: LOAD_THREADLIST,
                    threadList: currentThreadList
                })
            }
        })
    }
}

//load appMessages
export function loadAppMessage(threadID, name, count) {

    return (dispatch, getState) => {
        return request({
            url: '/Base-Module/Message/GetMessageList',
            method: 'get',
            type: 'json',
            contentType: 'application/json',
            data: {
                "appShowID": threadID,
                "limit": 8,
                "endTimestamp": +new Date()
            }
        }).then(res=> {
            if (checkRespnseSuccess(res)) {

                var response = packRespnseData(res);
                response.Data.sort(function (a, b) {
                    return a.createDate - b.createDate;
                });

                let messages = response.Data.map(function (item, index) {

                    return {
                        avator: DEFAULT_AVATAR,
                        threadID: threadID,
                        me: false,
                        user:item.from,
                        name: item.fromuserName,
                        info: item.detail,
                        id: item.msgShowID,
                        messageType: item.messageType == 1 ? MESSAGE_TYPE.BUSINESS : MESSAGE_TYPE.SYSTEM,
                        messageAppType: item.messageAppType,
                        clientMsgId: 0,
                        timer: ThreadListDate(item.createDate),
                    }


                });

                request({
                    url: '/Base-Module/Message/BatchModifyRead',
                    method: 'post',
                    type: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        "appShowID": threadID
                    })
                });


                dispatch({
                    threadID,
                    type: ADD_CHATMESSAGES,
                    messages: messages,
                    chatRoomName: name
                })
            }
        }).catch(err => {
            console.log(err);
            console.error('load chat Messages failed');

        });
    }
}

export function loadAppPush() {
    return (dispatch, getState)=> {
        var connection = SignalR.hubConnection();
        var messageProxy = connection.createHubProxy('messageHub');
        messageProxy.on('broadcastMessage', function (message) {

            let shouldUpdate = false;
            let chatState = getState().chat;
            let messages = [];
            let threadList = $.extend(true, [], chatState.threadList);
            for (let i = 0; i < message.list.length; i++) {
                let item = message.list[i];
                let thread = getThreadByThreadID(threadList, item.appShowID);
                thread != null ? thread.timer = ThreadListDate(item.createDate) : '';
                thread != null ? thread.info = item.detail.title : '';
                thread != null ? thread.longDate = item.createDate : '';

                if (item.appShowID != chatState.currentThreadID) {
                    thread != null ? thread.count = thread.count + 1 : '';
                }
                else {
                    let currentMessage = arrayfind(messages, function (value, index, array) {
                        return value.id == item.msgShowID;
                    });

                    if (currentMessage == null) {
                        shouldUpdate = true;
                        messages.push({
                            avator: DEFAULT_AVATAR,
                            threadID: chatState.currentThreadID,
                            me: false,
                            user:item.from,
                            name: item.fromuserName,
                            info: item.detail,
                            id: item.msgShowID,
                            messageType: item.messageType == 1 ? MESSAGE_TYPE.BUSINESS : MESSAGE_TYPE.SYSTEM,
                            messageAppType: item.messageAppType,
                            clientMsgId: 0,
                            timer: ThreadListDate(item.createDate),
                        });
                    }

                }
            }
            dispatch({
                type: LOAD_THREADLIST,
                threadList: threadList
            });
            if (shouldUpdate) {
                request({
                    url: '/Base-Module/Message/BatchModifyRead',
                    method: 'post',
                    type: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        "appShowID": chatState.currentThreadID
                    })
                });
            }
            let currentThread = getThreadByThreadID(threadList, chatState.currentThreadID);
            let currentchatRoomName = currentThread == null ? "" : currentThread.title;
            dispatch({
                threadID: chatState.currentThreadID,
                type: ADD_CHATMESSAGES,
                messages: messages,
                chatRoomName: currentchatRoomName
            })


        });
        connection.logging = true;
        connection.start().done(function () {
            console.log("已连接");
        });
    }

}

// change ThreadID
export function changeThreadID(threadID) {

    return dispatch => {

        return dispatch({
            type: CHANGE_THREADID,
            threadID
        })
    }
}

// change Thread 切换聊天室
export function changeThread(threadID, name) {

    return dispatch => {

        return dispatch(getNowThread(threadID, name))
    }
}

//删除会话的消息
export function removeMessageByThread(threadID) {
    return dispatch => {

        return dispatch({
            type: REMOVE_CHATMESSAGES,
            threadID
        })
    }
}

function getNowThread(threadID, chatRoomName) {
    return {
        type: CHANGE_THREAD,
        threadID,
        chatRoomName
    }
}

//获取当前用户信息，包括联系人
export function getCurrentUserInfo() {

    return dispatch => {
        return request({
            url: '/Base-Module/CompanyUser/GetUser',
            method: 'Get',
            type: 'json',

            contentType: 'application/json'
        }).then(res=> {
            if (res.Header.IsSuccess && res.Body.response.IsSuccess) {
                var me = {
                    id: res.Body.response.Data.user.userShowID,
                    loginName: res.Body.response.Data.user.userLoginName,
                    name: res.Body.response.Data.user.userTrueName,
                    companyCode:res.Body.response.Data.user.companyCode,
                    avator: DEFAULT_AVATAR
                };
                var contracts = res.Body.response.Data.contracts.map(function (item, index) {
                    return {
                        id: item.userShowID,
                        loginName: item.userLoginName,
                        name: item.userTrueName,
                        companyCode:item.companyCode,
                        avator: DEFAULT_AVATAR
                    }
                });
                return dispatch({
                    type: GETCURRENT_USER,
                    me: me,
                    contacts: contracts
                })
            }

        }).catch(err => {
            console.error(err);
            console.error('load worklist failed');

        });
    }
}


//获取日程详情
export function getChatScheduleDetail(request, msgID) {
    return (dispatch, getState)=> {
        return GetEventDatail(request).then(res=> {
            let chatState = getState().chat;
            let messages = $.extend(true, [], chatState.chatMessages);
            let currentMessage = arrayfind(messages, function (value, index, array) {
                return value.id == msgID;
            });
            if (currentMessage == undefined) {
                return;
            }
            currentMessage.info.show = true;

            if (checkRespnseSuccess(res)) {
                let response = packRespnseData(res);
                let times = response.Data.times;
                //会议暂时无后补时间
                let time = times.length > 0 ? times[0] : {};
                let detail = {
                    id: response.Data.showId,
                    place: response.Data.place,
                    start: time.start,
                    end: time.end,
                    type: response.Data.type,
                    relateId: response.Data.relateId,
                    isAllDay: response.Data.isAllDay,

                };
                currentMessage.info.detail = detail;
                return dispatch({
                    type: MODIFY_MESSAGE,
                    msgID,
                    message: currentMessage
                })
            } else {
                return dispatch({
                    type: MODIFY_MESSAGE,
                    msgID,
                    message: currentMessage
                })
            }
        });
    }
}

//获取会议详情
export function getChatMeetingDetail(request, msgID) {
    return (dispatch, getState)=> {
        return getMeetingDetail(request).then(res=> {
            let chatState = getState().chat;
            let messages = $.extend(true, [], chatState.chatMessages);

            let currentMessage = arrayfind(messages, function (value, index, array) {
                return value.id == msgID;
            });

            if (currentMessage == undefined) {
                return;
            }
            currentMessage.info.show = true;
            if (checkRespnseSuccess(res)) {
                let response = packRespnseData(res);
                let detail = {
                    id: response.Data.SHOW_ID,
                    place: response.Data.R_SHOW_ID != null ? response.Data.R_SHOW_NAME : response.Data.M_EXTERNAL,
                    start: response.Data.M_START,
                    end: response.Data.M_END,
                    type: 'meeting'
                };
                currentMessage.info.detail = detail;
                return dispatch({
                    type: MODIFY_MESSAGE,
                    msgID,
                    message: currentMessage
                })
            } else {
                return dispatch({
                    type: MODIFY_MESSAGE,
                    msgID,
                    message: currentMessage
                })
            }
        });
    }
}

//处理会议（成功后调用）
export function handleChatMeeting(request, msgID) {
    return (dispatch, getState)=> {
/*        return handleMeeting(request).then(res=> {
            let chatState = getState().chat;
            let messages = $.extend(true, [], chatState.chatMessages);
            let currentMessage = arrayfind(messages, function (value, index, array) {
                return value.id == msgID;
            });
            if (currentMessage == undefined) {
                return;
            }
            if (checkRespnseSuccess(res)) {

                currentMessage.info.isHandled = true;

                return dispatch({
                    type: MODIFY_MESSAGE,
                    msgID,
                    message: currentMessage
                })

            } else {
                return dispatch({
                    type: MODIFY_MESSAGE,
                    msgID,
                    message: currentMessage
                })
            }
        });*/
        let chatState = getState().chat;
        let messages = $.extend(true, [], chatState.chatMessages);
        let currentMessage = arrayfind(messages, function (value, index, array) {
            return value.id == msgID;
        });
        if (currentMessage == undefined) {
            return;
        }
        currentMessage.info.isHandled = true;

        return dispatch({
            type: MODIFY_MESSAGE,
            msgID,
            message: currentMessage
        })
    }
}

//获取任务详情
export function getChatTaskDetail(request, msgID) {
    return (dispatch, getState)=> {
        return getTaskDetail(request).then(res=> {
            let chatState = getState().chat;
            let messages = $.extend(true, [], chatState.chatMessages);
            let currentMessage = arrayfind(messages, function (value, index, array) {
                return value.id == msgID;
            });
            if (currentMessage == undefined) {
                return;
            }
            currentMessage.info.show = true;

            if (checkRespnseSuccess(res)) {
                let response = packRespnseData(res);
                let detail = {
                    taskId: response.Data.SHOW_ID,
                    projectId: response.Data.P_SHOW_ID,
                    projectName: response.Data.P_NAME,
                    title: response.Data.T_TITLE,
                    priority: response.Data.T_PRIORITY,
                    endTime: response.Data.T_END_TIME,
                    statustype: response.Data.S_TYPE,
                    statusName: response.Data.S_NAME,
                    finishedTask: response.Data.FINISHTASK,
                    allTask: response.Data.ALLTASK,
                    level: response.Data.T_LEVEL
                };
                currentMessage.info.detail = detail;
                return dispatch({
                    type: MODIFY_MESSAGE,
                    msgID,
                    message: currentMessage
                })
            } else {
                return dispatch({
                    type: MODIFY_MESSAGE,
                    msgID,
                    message: currentMessage
                })
            }
        });
    }
}


//删除会话
//export function removeThread(threadID){
//    return (dispatch, getState)=>{
//        return request({
//            url: '/chat/sendmsg',
//            method: 'post',
//            type: 'json',
//            contentType: 'application/json',
//            data:JSON.stringify({
//                "sessionName":threadID
//            })
//        }).then(res=>{
//
//
//        }).catch(err => {
//            console.error(err);
//            console.error('load worklist failed');
//
//        });
//    }
//}

////轮询
//function loopRequest(){
//    request({
//
//    }).then((req) => {
//        if(!req.success) throw error;
//        dispatch({})
//        loopRequest();
//    }).catch((err) => {
//        console.log(err);
//    });
//}

//获取审批详情
export function getChatApprovalDetail(request, msgID) {
    return (dispatch, getState)=> {
        return getApprovalDetail(request).then(res=> {
            let chatState = getState().chat;
            let messages = $.extend(true, [], chatState.chatMessages);

            let currentMessage = arrayfind(messages, function (value, index, array) {
                return value.id == msgID;
            });

            if (currentMessage == undefined) {
                return;
            }
            currentMessage.info.show = true;
            if (checkRespnseSuccess(res)) {
                let response = packRespnseData(res);

                getApproveTypeDetail(response.Data.T_SHOW_ID).then((res2)=> {
                    let retData2 = packRespnseData(res2);
                    if (checkRespnseSuccess(res2)) {
                        response.Data.T_NAME = retData2.Data.T_NAME;

                        let detail = {
                            id: response.Data.SHOW_ID,
                            title: response.Data.A_TITLE,
                            start: response.Data.A_START_TIME || 0,
                            end: response.Data.A_END_TIME || 0,
                            deadline: response.Data.A_DEADLINE,
                            fee: response.Data.A_FEE,
                            tname: response.Data.T_NAME,
                            backup: response.Data.A_BACKUP,
                            isCanApprove: response.Data.IS_CAN_APPROVE,
                            isDeadlineAllday: response.Data.IS_DEADLINE_ALL_DAY,
                            isTimeslotAllday: response.Data.IS_TIMESLOT_ALL_DAY
                        };
                        currentMessage.info.detail = detail;
                        return dispatch({
                            type: MODIFY_MESSAGE,
                            msgID,
                            message: currentMessage
                        })

                    }
                });

            } else {
                return dispatch({
                    type: MODIFY_MESSAGE,
                    msgID,
                    message: currentMessage
                })
            }
        });
    }
}


//// user login
//export function login(username, password){
//
//  return dispatch => {
//
//    Promise.resolve( reqwest({
//      url: `${MAIN_URL}/admin/login`,
//      method:'POST',
//
//      type: 'json',
//
//      headers:{
//        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
//      },
//      data:{
//        username,
//        password
//      }
//    }))
//
//      //.then(res => JSON.parse)
//      .then(res => {
//
//        if(res.result){
//          dispatch({
//            type: constant.USER,
//            user: {
//              username:'alex',
//              jwt: res.id_token
//            }
//          });
//          RouterContainer.get().transitionTo('index');
//        }
//
//        //dispatch({
//        //  type: constant.USER,
//        //  user: {
//        //    username: 'alex'
//        //  }
//        //})
//        //RouterContainer.get().transitionTo('index');
//
//      })
//
//      .catch(err => {
//
//        const res = {
//          result: true,
//          user:{
//            username: 'alex',
//            jwt: 'alexjwt'
//          }
//        }
//        dispatch({
//          type: constant.USER,
//          user: res
//        });
//      });
//  }
//}
//
////user logout
//export function logout(){
//  localStorage.clear('jwt');
//  return dispatch => {
//    dispatch({
//      type: constant.LOGOUT,
//      user: {
//        jwt: ''
//      }
//    });
//    RouterContainer.get().transitionTo('index');
//  }
//}



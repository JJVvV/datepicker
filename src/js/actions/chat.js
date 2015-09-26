import request from 'reqwest';
import { Promise } from 'es6-promise';
import _ from 'lodash';
import {getThreadByThreadID,sortThreadList} from '../services/messageService.js';
import generateUniqueID from '../services/uniqueIDService.js';

import {
    DEFAULT_AVATAR,

    CHAT_URL_UNREADSESSION,
    CHAT_URL_SESSION,
    CHAT_URL_HISTORYMESSAGE,
    CHAT_URL_READSESSION,
    CHAT_URL_SUBSCRIBEMESSAGE,
    CHAT_URL_CREATEGROUP,
    CHAT_URL_UPDATEGROUPNAME,
    CHAT_URL_ADDGROUPUSER,
    CHAT_URL_DELETEGROUPUSER,

    CHAT_URL_ADDBOOKMARK,
    CHAT_URL_DELBOOKMARK,
    CHAT_URL_SEARCHBOOKMARK,
    CHAT_URL_SEARCHMESSAGE,

    LOAD_THREADLIST,
    ADD_THREADLIST,
    SEND_CHATMESSAGE,
    ADD_CHATMESSAGES,
    CHANGE_THREADID,
    CHANGE_THREAD_STATUS,
    MODIFY_MESSAGE,
    MODIFY_MESSAGE_MAXID,
    MODIFY_MESSAGE_UNREAD,
    REMOVE_WORKITEM,
    CLOSE_THREAD,

    THREAD_TYPE,
    MESSAGE_TYPE,
    CHAT_MESSAGE_TYPE,
    CHAT_ROOM_STR,

    CHAT_ACTION
} from '../constants/launchr.js';

const ChatCode = {
    OK: 2000
}

const requestObj = {
    method: 'post',
    type: 'json',
    contentType: 'application/json'
};

//轮训聊天消息
export function loadLongPoll() {
    return (dispatch, getState)=> {
        let maxMsgId = getState().chat.currentMsgId;
        request({
            ...requestObj,
            url: CHAT_URL_SUBSCRIBEMESSAGE,
            data: JSON.stringify({
                "msgId": maxMsgId,
                "milliseconds": 20000
            })
        }).then(res=> {
                let chatState = getState().chat;
                let userInfo = getState().userinfo;
                let setReadMessageId = [];
                let chatMessages = chatState.chatMessages;
                let loadChatMessages = chatMessages.filter((msg)=>(msg.loadIng)).map((msg)=> {
                    return msg.clientMsgId
                });
                let threadList = chatState.threadList;
                var currentThread = getThreadByThreadID(threadList, chatState.currentThreadID);


                for (let index = 0; index < res.msg.length; index++) {
                    let item = res.msg[index];
                    if (item.msgId > maxMsgId) {
                        maxMsgId = item.msgId;
                    }
                    //修改消息未读状态
                    if (CHAT_MESSAGE_TYPE.READ == item.type) {
                        dispatch({
                            type: MODIFY_MESSAGE_UNREAD,
                            ids: item.content
                        });
                    }
                    //移除对话列表
                    else if (CHAT_MESSAGE_TYPE.CLEAR == item.type) {
                        dispatch({
                            type: REMOVE_WORKITEM,
                            threadID: item.from
                        });
                    }
                    //修改状态 一般针对群对话
                    else if (CHAT_MESSAGE_TYPE.ALERT == item.type) {
                        //修改会话的状态
                        request({
                            ...requestObj,
                            url: CHAT_URL_SESSION,
                            data: JSON.stringify({
                                "sessionName": item.from
                            })
                        }).then(res=> {
                            //判断是否存在，如果存在则修改，不存在则添加
                            let oldThread = getThreadByThreadID(threadList, res.data.userName);
                            let thread = {
                                ...oldThread,
                                avator: res.data.avatar || DEFAULT_AVATAR,
                                threadID: res.data.userName,
                                title: res.data.nickName,
                                info: {
                                    content: item.content,
                                    type: item.type
                                },
                                timer: item.createDate,
                                longDate: res.data.modified,
                                type: THREAD_TYPE.CHAT,
                                code: '',
                                count: 0,
                                memberList: res.data.memberList
                            };
                            if (res.code == ChatCode.OK) {
                                if (oldThread != null) {
                                    dispatch({
                                        type: CHANGE_THREAD_STATUS,
                                        thread
                                    });
                                } else {
                                    dispatch({
                                        type: LOAD_THREADLIST,
                                        threadList: [...getState().chat.threadList, thread]
                                    });
                                }
                            }
                            //如果为当前会话则添加消息
                            if (chatState.currentThreadID == item.from && currentThread != null) {
                                dispatch({
                                    threadID: chatState.currentThreadID,
                                    type: ADD_CHATMESSAGES,
                                    messages: [{
                                        avator: DEFAULT_AVATAR,
                                        threadID: chatState.currentThreadID,
                                        info: {
                                            content: item.content,
                                            type: item.type
                                        },
                                        id: generateUniqueID(),
                                        messageType: MESSAGE_TYPE.CHAT,
                                        messageAppType: "",
                                        clientMsgId: item.clientMsgId,
                                        msgId: item.msgId,
                                        timer: item.createDate
                                    }],
                                    chatRoomName: res.data.nickName
                                })
                            }
                        });
                    }
                    //消息处理
                    else {
                        let contact = _.find(userInfo.contacts, 'id', item.from);
                        let uid = item.from == userInfo.me.id ? item.to : item.from;
                        let threadId = getThreadByThreadID(threadList, uid);
                        let currentTalk = _.includes([item.to, item.from], chatState.currentThreadID);
                        //处理最后一条消息
                        if (threadId != null) {
                            dispatch({
                                type: CHANGE_THREAD_STATUS,
                                thread: {
                                    ...threadId,
                                    info: {
                                        content: item.content,
                                        type: item.type
                                    },
                                    timer: item.createDate,
                                    count: currentTalk ? 0 : threadId.count + 1
                                }
                            });
                        }
                        //处理添加联系人并且添加最后一条记录
                        else if (chatState.currentThreadID.indexOf(CHAT_ROOM_STR) != -1) {
                            request({
                                ...requestObj,
                                url: CHAT_URL_SESSION,
                                data: JSON.stringify({
                                    "sessionName": item.from
                                })
                            }).then(res=> {
                                let thread = {
                                    avator: res.data.avatar || DEFAULT_AVATAR,
                                    threadID: res.data.userName,
                                    title: res.data.nickName,
                                    info: {
                                        content: item.content,
                                        type: item.type
                                    },
                                    timer: item.createDate,
                                    longDate: res.data.modified,
                                    type: THREAD_TYPE.CHAT,
                                    code: '',
                                    count: 1,
                                    memberList: res.data.memberList
                                };
                                dispatch({
                                    type: LOAD_THREADLIST,
                                    threadList: [...getState().chat.threadList, thread]
                                });
                            });
                        }
                        //如果是自己发的、clientMsgId相等、是当前会话,则修改消息为发送成功
                        if (loadChatMessages.indexOf(item.clientMsgId) != -1
                            && item.from === userInfo.me.id
                            && item.to === chatState.currentThreadID) {
                            dispatch({
                                type: MODIFY_MESSAGE,
                                clientMsgId: item.clientMsgId,
                                msgId: item.msgId,
                                unReadCount: currentThread.memberList != null ? currentThread.memberList.length : 1
                            });
                        }
                        //判断消息是否为当前聊天窗口的
                        else if (currentTalk) {
                            setReadMessageId.push(item.msgId);
                            dispatch({
                                threadID: chatState.currentThreadID,
                                type: ADD_CHATMESSAGES,
                                messages: [{
                                    avator: DEFAULT_AVATAR,
                                    threadID: chatState.currentThreadID,
                                    me: item.from == userInfo.me.id,
                                    name: item.from == userInfo.me.id ? userInfo.me.name : (contact != null ? contact.name : JSON.parse(item.info).nickName),
                                    info: {
                                        content: item.content,
                                        type: item.type
                                    },
                                    id: generateUniqueID(),
                                    messageType: MESSAGE_TYPE.CHAT,
                                    messageAppType: "",
                                    clientMsgId: item.clientMsgId,
                                    msgId: item.msgId,
                                    unReadCount: item.unReadCount,
                                    timer: item.createDate
                                }],
                                chatRoomName: currentThread.title
                            });
                        }
                    }
                }
                if (res.msg.length) {
                    //更新最大的消息ID
                    dispatch({
                        type: MODIFY_MESSAGE_MAXID,
                        currentMsgId: maxMsgId
                    });
                }

                if (setReadMessageId.length > 0 && chatState.currentThreadID != null) {
                    request({
                        ...requestObj,
                        url: CHAT_URL_READSESSION,
                        data: JSON.stringify({
                            "sessionName": chatState.currentThreadID,
                            "msgIds": setReadMessageId
                        })
                    });
                }

                loadLongPoll()(dispatch, getState);
            }
        ).
            catch(err => {
                console.log(err);
                console.error('load chat Messages failed');
            });
    }
}
//加载聊天的会话
export function loadThreadChatList() {

    return (dispatch, getState) => {
        return request({
            ...requestObj,
            url: CHAT_URL_UNREADSESSION,
            data: JSON.stringify({
                "start": 0,
                "end": 100
            })
        })
            .then(res => {

                let chatState = getState().chat;
                let userInfo = getState().userinfo;
                let currentThreadList = chatState.threadList;

                _.map(res.sessions, (item)=> {
                    let otherValue = {
                        avator: DEFAULT_AVATAR,
                        type: THREAD_TYPE.CHAT,
                        count: item.count,
                        threadID: item.sessionName,
                        info: {},
                        timer: "",
                        longDate: 0,
                        code: ''
                    };
                    if (item.lastMsg != null) {
                        otherValue = {
                            ...otherValue,
                            info: {
                                content: item.lastMsg.content,
                                type: item.lastMsg.type
                            },
                            timer: item.lastMsg.createDate,
                            longDate: item.lastMsg.createDate
                        }
                    }

                    let contact = _.find(userInfo.contacts, 'id', item.sessionName);
                    if (contact == null) {
                        dispatch({
                            type: ADD_THREADLIST,
                            threadList: [otherValue]
                        });
                        request({
                            ...requestObj,
                            url: CHAT_URL_SESSION,
                            data: JSON.stringify({
                                "sessionName": item.sessionName
                            })
                        }).then(res=> {
                            if (res.code == ChatCode.OK) {
                                dispatch({
                                    type: CHANGE_THREAD_STATUS,
                                    thread: {
                                        ...otherValue,
                                        avator: res.data.avatar || DEFAULT_AVATAR,
                                        threadID: res.data.userName,
                                        title: res.data.nickName,
                                        longDate: res.data.modified,
                                        memberList: res.data.memberList
                                    }
                                })
                            }
                        });
                    } else {
                        dispatch({
                            type: ADD_THREADLIST,
                            threadList: [{
                                ...otherValue,
                                title: contact.name,
                                count: item.count
                            }]
                        });
                    }
                });
                dispatch({
                    type: ADD_THREADLIST,
                    threadList: [],
                    currentMsgId: res.msgId
                })
            })
            .catch(err => {
                console.error(err);
                console.error('load worklist failed');
            });

    }
}
//load chatMessages
export function loadChatMessages(threadID, name, count, more) {
    return (dispatch, getState) => {
        let data = {
            "to": threadID,
            "limit": count || 3
        };
        if (more) {
            let state = getState();
            data = {
                ...data,
                limit: count,
                endTimestamp: (_.first(state.chat.chatMessages).msgId - 1)
            }
        }
        return request({
            ...requestObj,
            url: CHAT_URL_HISTORYMESSAGE,
            data: JSON.stringify(data)
        }).then(res => {

            let userinfo = getState().userinfo;

            res.msg = _.sortBy(res.msg, 'msgId');

            let currentMessageIds = [];

            let messages = _.map(res.msg, item=> {
                if (count != 0
                    && item.from != userinfo.me.id
                    && _.includes([CHAT_MESSAGE_TYPE.TEXT, CHAT_MESSAGE_TYPE.IMAGE], item.type)) {
                    currentMessageIds.push(item.msgId);
                }
                return {
                    avator: DEFAULT_AVATAR,
                    threadID: threadID,
                    me: item.from == userinfo.me.id,
                    name: JSON.parse(item.info).nickName,
                    info: {
                        content: item.content,
                        type: item.type
                    },
                    id: generateUniqueID(),
                    messageType: MESSAGE_TYPE.CHAT,
                    messageAppType: "",
                    clientMsgId: item.clientMsgId,
                    msgId: item.msgId,
                    unReadCount: item.unReadCount,
                    timer: item.createDate,
                    bookMark: item.bookMark
                }
            });

            if (currentMessageIds.length > 0) {
                request({
                    ...requestObj,
                    url: CHAT_URL_READSESSION,
                    data: JSON.stringify({
                        "sessionName": threadID,
                        "msgIds": currentMessageIds
                    })
                });
            }


            dispatch({
                threadID,
                type: ADD_CHATMESSAGES,
                messages: messages,
                chatRoomName: name,
                more: more
            });

            return res.msg.length > 0;
        })
            .catch(err => {
                console.log(err);
                console.error('load chat Messages failed');

            });

    }
}
//addMessage
export function sendMessage(text) {

    return (dispatch, getState) => {
        let chatState = getState().chat;
        let currentDate = new Date();
        let userinfo = getState().userinfo;
        let data = {
            "to": [chatState.currentThreadID],
            "content": text,
            "type": "Text",
            "info": JSON.stringify({
                nickName: userinfo.me.name
            }),
            "clientMsgId": +currentDate
        };
        if (chatState.currentThreadID.indexOf(CHAT_ROOM_STR) != -1) {
            data.info = JSON.stringify({
                nickName: userinfo.me.name,
                groupName: chatState.chatRoomName
            })
        }
        return request({
            url: '/chat/sendmsg',
            method: 'post',
            type: 'json',
            contentType: 'application/json',
            data: JSON.stringify(data)
        }).then(res => {
            let currentThread = getThreadByThreadID(chatState.threadList, chatState.currentThreadID);
            let message = {
                info: {
                    content: text,
                    type: 'Text'
                },
                timer: (+new Date),
                me: true,
                id: generateUniqueID(),
                clientMsgId: +currentDate,
                avator: DEFAULT_AVATAR
            }

            return dispatch({
                type: SEND_CHATMESSAGE,
                message,

            })
        })

            .catch(err => {
                console.log(err);
                console.error('add Message failed');

            });

    }
}
//添加会话人
export function addChatTalk(item) {

    return (dispatch, getState) => {
        let currentThreadList = getState().chat.threadList;
        let threadList = {
            avator: item.url,
            threadID: item.id,
            title: item.trueName,
            info: {},
            timer: "",
            longDate: 0,
            type: THREAD_TYPE.CHAT,
            code: '',
            count: 0
        };
        return new Promise(res=> {
            res(threadList);
        }).then(res=> {
                if (_.findIndex(currentThreadList, 'threadID', threadList.threadID) == -1) {
                    dispatch({
                        type: LOAD_THREADLIST,
                        threadList: [...currentThreadList, threadList]
                    });
                }
                return res;
            });
    };
}
//创建群
export function creatGroup(items) {
    return (dispatch, getState) => {
        let myselfId = getState().userinfo.me.id;
        let groupUsers = _.filter(items, item=>item.id != myselfId);
        if (groupUsers.length == 1) {
            return addChatTalk(groupUsers[0])(dispatch, getState);
        } else {
            return request({
                ...requestObj,
                url: CHAT_URL_CREATEGROUP,
                data: JSON.stringify({
                    "groupUsers": [myselfId].concat(_.map(groupUsers, 'id'))
                })
            }).then(res=> {
                let threadList = {
                    avator: res.data.avatar || DEFAULT_AVATAR,
                    threadID: res.data.sessionName,
                    title: res.data.groupName,
                    info: {},
                    timer: "",
                    longDate: res.data.modified,
                    type: THREAD_TYPE.CHAT,
                    code: '',
                    count: 0,
                    memberList: res.data.memberList
                };
                dispatch({
                    type: LOAD_THREADLIST,
                    threadList: [...getState().chat.threadList, threadList]
                });
                return threadList;
            });
        }
    };
}
//修改群名
export function modifyGroupName(sessionName, groupName) {
    return (dispatch, getState) => {
        return request({
            ...requestObj,
            url: CHAT_URL_UPDATEGROUPNAME,
            data: JSON.stringify({
                "sessionName": sessionName,
                "groupName": groupName
            })
        }).then(res => {

        });
    };
}
//添加群成员
export function addGroupUser(sessionName, items) {
    return (dispatch, getState) => {
        return request({
            ...requestObj,
            url: CHAT_URL_ADDGROUPUSER,
            data: JSON.stringify({
                "sessionName": sessionName,
                "groupUsers": _.map(items, 'id')
            })
        }).then(res => {

        });
    };
}
//删除群成员
export function deleteGroupUser(sessionName, uId) {
    return (dispatch, getState) => {
        return request({
            ...requestObj,
            url: CHAT_URL_DELETEGROUPUSER,
            data: JSON.stringify({
                "sessionName": sessionName,
                "toUserName": uId
            })
        }).then(res => {
            let userInfo = getState().userinfo;
            if (userInfo.me.id == uId) {
                dispatch({
                    type: CLOSE_THREAD
                });
            }
        });
    };
}
//添加书签
export function addBookMark(msgId) {
    return (dispatch, getState) => {
        let message = _.find(getState().chat.chatMessages, n=>n.msgId == msgId);
        return request({
            ...requestObj,
            url: CHAT_URL_ADDBOOKMARK,
            data: JSON.stringify({
                "msgId": msgId
            })
        }).then(res => {
            message.bookMark = 1;
            dispatch({
                type: MODIFY_MESSAGE,
                msgId: msgId,
                message: message
            });
            return {
                state:true,
                message:message
            };
        });
    }
}

export function delBookMark(msgId) {
    return (dispatch, getState) => {
        let message = _.find(getState().chat.chatMessages, n=>n.msgId == msgId);
        return request({
            ...requestObj,
            url: CHAT_URL_DELBOOKMARK,
            data: JSON.stringify({
                "msgId": msgId
            })
        }).then(res => {
            message.bookMark = 0;
            dispatch({
                type: MODIFY_MESSAGE,
                msgId: msgId,
                message: message
            });
            return {
                state:false,
                message:message
            };
        });
    }
}

export function removeStar(msgId) {
    return (dispatch, getState) => {
        let message = _.find(getState().chat.chatMessages, n=>n.msgId == msgId);
        if (message != null) {
            message.bookMark = 0;
            dispatch({
                type: MODIFY_MESSAGE,
                msgId: msgId,
                message: message
            });
        }
    }
}

export default chatAction = {
    //加载消息记录历史
    loadChatHistoryMessages(threadID, type){
        return (dispatch, getState) => {
            let requestParam = CHAT_MESSAGE_TYPE.BOOKMARK == type ? {
                url: CHAT_URL_SEARCHBOOKMARK,
                data: JSON.stringify({
                    "to": threadID,
                    "limit": 15
                })
            } : {
                url: CHAT_URL_HISTORYMESSAGE,
                data: JSON.stringify({
                    "to": threadID,
                    "limit": 15,
                    "endTimestamp": 0,
                    "type": type
                })
            };
            return request({
                ...requestObj,
                ...requestParam
            }).then(res => {
                dispatch({
                    type: CHAT_ACTION.LOAD_HISTORY,
                    chatHistoryMessages: _.map(res.msg, (item)=> {
                        item.nickName = JSON.parse(item.info).nickName;
                        return item;
                    }),
                    chatHistoryType: type
                });
            })
        }
    },
    //清除历史
    clearChatHistoryMessages(){
        return (dispatch, getState) => {
            dispatch({
                type: CHAT_ACTION.CLEAR_HISTORY
            });
        }
    },
    //添加消息历史
    addChatHistoryMessages(threadID, type){
        return (dispatch, getState) => {
            let chatHistoryMessages = getState().chatReducer.chatHistoryMessages;
            let requestParam = CHAT_MESSAGE_TYPE.BOOKMARK == type ? {
                url: CHAT_URL_SEARCHBOOKMARK,
                data: JSON.stringify({
                    "to": threadID,
                    "limit": 15,
                    "startIndex": chatHistoryMessages.length
                })
            } : {
                url: CHAT_URL_HISTORYMESSAGE,
                data: JSON.stringify({
                    "to": threadID,
                    "limit": 15,
                    "endTimestamp": _.last(chatHistoryMessages).msgId - 1,
                    "type": type
                })
            };
            return request({
                ...requestObj,
                ...requestParam
            }).then(res => {
                if (res.msg.length) {
                    dispatch({
                        type: CHAT_ACTION.ADD_HISTORY,
                        chatHistoryMessages: _.map(res.msg, (item)=> {
                            item.nickName = JSON.parse(item.info).nickName;
                            return item;
                        })
                    });
                }
                return res.msg.length > 0;
            })
        }
    },
    //重点跳转
    bookMarkJump(msgId, uId){
        return (dispatch, getState) => {
            return request({
                ...requestObj,
                url: CHAT_URL_SEARCHMESSAGE,
                data: JSON.stringify({
                    "sessionName": uId,
                    "limit": 5,
                    "endTimestamp": msgId
                })
            }).then(res => {
                dispatch({
                    type: CHAT_ACTION.LOAD_HISTORY,
                    chatHistoryMessages: _.map(res.msg, (item)=> {
                        item.nickName = JSON.parse(item.info).nickName;
                        return item;
                    })
                });
            })
        }
    },
    //删除星星
    removeStar(msgId){
        return (dispatch, getState) => {
            return request({
                ...requestObj,
                url: CHAT_URL_DELBOOKMARK,
                data: JSON.stringify({
                    "msgId": msgId
                })
            }).then(res => {
                dispatch({
                    type: CHAT_ACTION.REMOVE_STAR,
                    msgId: msgId
                });
            });
        };
    },
    //添加星星
    addStar(msgId, info){
        return (dispatch, getState) => {
            return dispatch({
                type: CHAT_ACTION.CHANGE_STAR,
                msgId: msgId,
                state: info.state
            });
        };
    },
    //添加数据
    insertMsg(msg){
        return (dispatch, getState) => {
            return dispatch({
                type: CHAT_ACTION.ADD_MESSAGE,
                msg: msg
            });
        };
    }
}

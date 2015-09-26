import assign from 'object-assign'
import * as constant from '../constants/launchr.js';
import {arrayfind} from '../services/arrayService.js'
import $ from 'jquery'
const initialState = {
    threadList: [], //聊天列表以及应用列表 on .sub-panel
    chatRoomName: '', // 聊天室名字或者某人的名字
    chatRoom: [], //聊天室人物
    chatMessages: [], // 当前状态下所有聊天记录
    currentThreadID: '', //当前聊天室ID
    timer: '', //记录聊天时间
    currentMsgId: 0//当天消息的ID
};

let _threads = {};
let currentThreadID;

function activeThreadListByID(threadList, threadID) {
    return threadList.map((thread) => {
        return {...thread, active: thread.threadID === threadID}
    });
}

function getMessagesByThreadID(threadID) {

}


const actionsMap = {
    //加载 .threadList
    [constant.LOAD_THREADLIST]: (state, action) => {
        if (action.currentMsgId != undefined) {
            return {threadList: action.threadList, currentMsgId: action.currentMsgId}
        }
        else {
            return {threadList: action.threadList}
        }

    },
    [constant.ADD_THREADLIST]: (state, action) => {
        return {
            threadList: state.threadList.concat(action.threadList),
            currentMsgId: action.currentMsgId || action.currentMsgId
        }
    },
    //修改最大消息ID
    [constant.MODIFY_MESSAGE_MAXID]: (state, action) => {
        return {currentMsgId: action.currentMsgId}
    },

    [constant.CHANGE_THREAD]: (state, action) => {
        let threadList = activeThreadListByID(state.threadList, action.threadID);
        return {threadList, currentThreadID: action.threadID, chatRoomName: action.chatRoomName}
    },

    //修改某个聊天人的状态
    [constant.CHANGE_THREAD_STATUS]: (state, action) => {
        let threadList = $.extend(true, [], state.threadList).map(function (item, index) {
            return item.threadID == action.thread.threadID ? action.thread : item;
        });
        return {
            threadList
        }
    },

    // 删除某个 .thread-item
    [constant.REMOVE_WORKITEM]: (state, action) => ({
        threadList: state.threadList.filter(item =>
            item.threadID !== action.threadID
        )
    }),

    //点击某个 .thread-item 时加载相应的聊天内容
    [constant.ADD_CHATMESSAGES]: (state, action) => {

        let chatMessages = action.messages.length > 0
            ? (action.more ? action.messages.concat(state.chatMessages) : state.chatMessages.concat(action.messages))
            : state.chatMessages;
        chatMessages = _.sortBy(chatMessages, 'msgId');
        let threadList = state.threadList.map((thread) => {
            if (thread.threadID === action.threadID) {
                return {...thread, count: 0}
            }
            return thread;
        });

        return {
            chatMessages,
            chatRoomName: action.chatRoomName,
            timer: action.timer,
            threadList
        }
    },

    [constant.REMOVE_CHATMESSAGES]: (state, action)=> {
        let chatMessages = [];
        state.chatMessages.map(function (item, index) {
            if (item.threadID != action.threadID) {
                chatMessages.push(item);
            }
        });
        return {
            chatMessages
        }
    },

    [constant.MODIFY_MESSAGE]: (state, action)=> {

        let chatMessages = $.extend(true, [], state.chatMessages).map(function (item, index) {
            if (item.id == action.msgID) {
                item = action.message;
            }
            else if (item.clientMsgId == action.clientMsgId && item.loadIng) {
                item.msgId = action.msgId;
                item.unReadCount = action.unReadCount;
                item.loadIng = false;
            }
            else if (item.msgId == action.msgId) {
                item = action.message;
            }
            return item;
        });
        return {
            chatMessages
        }

    },

    [constant.MODIFY_MESSAGE_UNREAD]: (state, action)=> {
        let ids = action.ids + ",";
        let chatMessages = $.extend(true, [], state.chatMessages).map(function (item, index) {
            if (ids.indexOf(item.msgId + ",") != -1) {
                item.unReadCount = item.unReadCount - 1;
            }
            return item;
        });
        return {
            chatMessages
        }

    },

    //关闭当前会话
    [constant.CLOSE_THREAD]: (state, action) => {
        return {
            chatRoomName: '',
            chatMessages: []
        }
    },
    //// 添加消息
    //[constant.ADD_CHATMESSAGE]: (state, action) => {
    //  let chatMessages =[...state.chatMessages, action.message];
    //  //消息改变的同时改变threadList
    //
    //  let threadList = chatMessages.map(function(message){
    //    let threadID = message.threadID;
    //    let thread = _threads[threadID];
    //    if(thread && thread.timestamp > message.timestamp){
    //      return;
    //    }
    //    _threads[threadID] = {
    //
    //    }
    //
    //  });
    //  return {chatMessages, threadList}
    //},

    // 发送消息
    [constant.SEND_CHATMESSAGE]: (state, action) => {
        let message = Object.assign({}, state.me, action.message, {threadID: state.currentThreadID}, {loadIng: true});
        return {chatMessages: [...state.chatMessages, message]}
    },

    [constant.LOGOUT]: (state, action) => (
    {user: action.user}
    ),

    // 修改currentThreadID
    [constant.CHANGE_THREADID]: (state, action) => {
        currentThreadID = action.threadID;

        return {currentThreadID}
    }
}

export default function launchr(state = initialState, action) {
    const reduceFn = actionsMap[action.type];
    if (!reduceFn) return state;
    return Object.assign({}, state, reduceFn(state, action));
}

//聊天相关
const initialChatState = {
    chatHistoryMessages: [], //聊天的历史消息
    chatHistoryType: null
};
const actionChatMap = {
    [constant.CHAT_ACTION.LOAD_HISTORY]: (state, action) => {
        return {
            chatHistoryMessages: action.chatHistoryMessages,
            chatHistoryType: action.chatHistoryType
        }
    },
    [constant.CHAT_ACTION.ADD_HISTORY]: (state, action) => {
        return {
            chatHistoryMessages: state.chatHistoryMessages.concat(action.chatHistoryMessages)
        }
    },
    [constant.CHAT_ACTION.CLEAR_HISTORY]: (state, action) => {
        return {
            chatHistoryMessages: [],
            chatHistoryType: null
        }
    },
    [constant.CHAT_ACTION.REMOVE_STAR]: (state, action)=> {
        if (state.chatHistoryType == constant.CHAT_MESSAGE_TYPE.BOOKMARK) {
            return {
                chatHistoryMessages: _.filter(state.chatHistoryMessages, n=>n.msgId != action.msgId)
            }
        }
        return {
            chatHistoryMessages: _.map(state.chatHistoryMessages, n=> {
                if (n.msgId == action.msgId) {
                    n.bookMark = 0;
                }
                return n;
            })
        }
    },
    [constant.CHAT_ACTION.CHANGE_STAR]: (state, action)=> {
        if (!action.state && state.chatHistoryType == constant.CHAT_MESSAGE_TYPE.BOOKMARK) {
            return {
                chatHistoryMessages: _.filter(state.chatHistoryMessages, n=>n.msgId != action.msgId)
            }
        }
        return {
            chatHistoryMessages: _.map(state.chatHistoryMessages, n=> {
                if (n.msgId == action.msgId) {
                    n.bookMark = action.state ? 1 : 0;
                }
                return n;
            })
        }
    },
    [constant.CHAT_ACTION.ADD_MESSAGE]: (state, action)=> {
        let message = _.filter(state.chatHistoryMessages, n=>n.msgId == action.msg.msgId);
        if (message.length==0) {
            let msg = {
                msgId: action.msg.msgId,
                content: action.msg.info.content,
                from: action.msg.threadID,
                info: JSON.stringify({
                    nickName: action.msg.name
                }),
                createDate: action.msg.timer,
                type: action.msg.info.type
            };
            return {
                chatHistoryMessages: [msg].concat(state.chatHistoryMessages)
            }
        }
        return {}
    },
}
export function chatReducer(state = initialChatState, action) {
    const reduceFn = actionChatMap[action.type];
    if (!reduceFn) return state;
    return Object.assign({}, state, reduceFn(state, action));
}
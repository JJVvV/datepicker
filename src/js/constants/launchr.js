/**
 * Created by Administrator on 2015/7/10.
 */

/*
*chat
 */
export const LOAD_THREADLIST = 'LOAD_THREADLIST'; //加载聊天列表
export const ADD_THREADLIST = 'ADD_THREADLIST'; //添加某个聊天人
export const REMOVE_WORKITEM = 'REMOVE_WORKITEM'; //删除某个聊天人
export const ADD_CHATMESSAGES = 'ADD_CHATMESSAGES'; // 添加聊天记录
export const REMOVE_CHATMESSAGES='REMOVE_CHATMESSAGES';//删除聊天记录
export const LOAD_CHATMESSAGES = 'LOAD_CHATMESSAGES'; // 加载具体聊天记录
export const SEND_CHATMESSAGE = 'ADD_CHATMESSAGE'; //发送消息
export const MODIFY_MESSAGE='MODIFY_MESSAGE';//修改数据
export const MODIFY_MESSAGE_UNREAD="MODIFY_MESSAGE_UNREAD";//修改消息未读状态
export const MODIFY_MESSAGE_MAXID="MODIFY_MESSAGE_MAXID";//修改消息最大Id
export const CHANGE_THREADID = 'CHANGE_THREADID'; // 修改threadID
export const CHANGE_THREAD = 'CHANGE_THREAD'; //切换聊天室
export const CHANGE_THREAD_STATUS='CHANGE_THREAD_STATUS';//改变某个聊天人的状态
export const CLOSE_THREAD='CLOSE_THREAD';//关闭当前会话
export const LOAD_ARTICLE = 'LOAD_ARTICLE';
export const SAVE_ARTICLE = 'SAVE_ARTICLE';
export const USER = 'USER';
export const LOGOUT = 'LOGOUT';

export const CHAT_MESSAGE_TYPE={
    TEXT:'Text',
    IMAGE:'Image',
    AUDIO:'Audio',
    FILE:'File',
    ALERT:'Alert',
    VIDEO:'Video',
    READ:'Read',
    CLEAR:'Clear',
    BOOKMARK:'bookMark'
};
export const CHAT_URL =  '/chat';
export const CHAT_ROOM_STR='@ChatRoom';
export const CHAT_URL_ATTACHMENT =  'http://192.168.1.251:20001/launchr';
export const CHAT_URL_AUDIO_ATTACHMENT = `${CHAT_URL_ATTACHMENT}/audio/`;
export const CHAT_URL_UNREADSESSION = `${CHAT_URL}/unreadsession`;
export const CHAT_URL_SESSION = `${CHAT_URL}/session`;
export const CHAT_URL_HISTORYMESSAGE=  `${CHAT_URL}/historymessage`;
export const CHAT_URL_READSESSION=`${CHAT_URL}/readsession`;
export const CHAT_URL_SUBSCRIBEMESSAGE=`${CHAT_URL}/subscribemessage`;
export const CHAT_URL_CREATEGROUP=`${CHAT_URL}/creategroup`;
export const CHAT_URL_UPLOAD=`${CHAT_URL}/upload`;
export const CHAT_URL_UPDATEGROUPNAME=`${CHAT_URL}/updategroupname`;
export const CHAT_URL_ADDGROUPUSER=`${CHAT_URL}/addgroupuser`;
export const CHAT_URL_DELETEGROUPUSER=`${CHAT_URL}/deletegroupuser`;
export const CHAT_URL_ADDBOOKMARK=`${CHAT_URL}/addbookmark`;
export const CHAT_URL_DELBOOKMARK=`${CHAT_URL}/deletebookmark`;
export const CHAT_URL_SEARCHBOOKMARK=`${CHAT_URL}/searchbookmark`;
export const CHAT_URL_SEARCHMESSAGE=`${CHAT_URL}/searchmessage`;
export const DEFAULT_AVATAR = '/redux-launchr/public/img/zhangqiuyan.jpg';
export const ENTER = 13;

// event
export const REFRESH_CALENDAR='REFRESH_CALENDAR'; //更换人员
export const REFRESH_EVENT = 'REFRESH_EVENT';
export const REFRESH_APPROVE = 'REFRESH_APPROVE';
export const REFRESH_TASK='REFRESH_TASK';
export const REFRESH_TASK_DETAIL='REFRESH_TASK_DETAIL';
export const REFRESH_PROJECT='REFRESH_PROJECT';//项目

// PubSub
export const CHANGE_SLIDER = 'change-slider';
export const SLIDER_ACTIVE = 'slider-active';
export const SLIDER_CLOSE = 'SLIDER_CLOSE';


//Slider 部分
export const S = {
    MEETING: 'MEETING',
    MEETING_FILTER: 'MEETING_FILTER',
    EVENT: 'EVENT',
    MEETING_DETAIL: 'MEETING_DETAIL',
    EVENT_DETAIL: 'EVENT_DETAIL',
    APPROVAL_SEARCH:'APPROVAL_SEARCH',
    APPROVAL_PLUS:'APPROVAL_PLUS',
    APPROVAL_DETAIL:'APPROVAL_DETAIL',
    CALENDAR_SEARCH:'CALENDAR_SEARCH',
    TASK_SEARCH:'TASK_SEARCH', //任务搜索
    TASK_ADD:'TASK_ADD', //任务新增
    TASK_DETAIL:'TASK_DETAIL'//任务编辑,
};

export const SLIDER_ON_CLOSE = 'SLIDER_ON_CLOSE';//关闭滑出事件
export const GETCURRENT_USER = 'GETCURRENT_USER';

export const EVENT_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';
export const TIME_ALLDAY = 'YYYY/MM/DD';
export const TIME_NOT_ALLDAY = 'YYYY/MM/DD  HH:mm';


//会话类型
export const THREAD_TYPE={
    CHAT:"CHAT",

    APP:"APP"
}
export const MESSAGE_TYPE={
    SYSTEM:"SYSTEM",

    BUSINESS:"BUSINESS",

    CHAT:"CHAT"
}
export const MESSAGE_APP_TYPE={
    EVENT:"EVENT",
    EVENT_COMMENT:"EVENT_COMMENT",
    MEETING:"MEETING",
    MEETING_COMMENT:"MEETING_COMMENT",
    APPROVE:"APPROVE",
    CC:"CC",
    SEND:"SEND",
    APPROVAL_COMMENT:"APPROVAL_COMMENT",
    TASK:"TASK"
}


export const NEWMEETING_ID = 'NEWMEETING_ID';

//审批类型字段名称
export const APPROVE_TYPE={
    TITLE:"title",
    APPROVEUSER:"approveuser",
    BACKUP:"backup",
    ANNEX:"annex",
    CC:"cc",
    APPROVEENDTIME:"approveendtime",
    FEE:"fee",
    TIMESLOT:"timeslot"
}


//选人控件返回结果类型
export const SHOW_TREE_RESULT={
    APPROVE:"APPROVE_TREE",
    MUST:"MUST_TREE",
    OPTIONAL:"OPTION_TREE",
    CC:"CC_TREE",
    TRANSMIT:"TRANSMIT_TREE",
    SHARE:"SHARE_TREE",
    CHAT_PEOPLE:"CHAT_PEOPLE_TREE",
    CHAT_ADD_PEOPLE:"CHAT_PEOPLE_ADD_TREE",
    CALENDAR:'CALENDAR'
}
//部门树
export const SHOW_SECTION_TREE = 'SHOW_SECTION_TREE';
//非必须参加人树
export const SHOW_MUST_TREE = 'SHOW_MUST_TREE';
//非必须参加人树
export const SHOW_OPTIONAL_TREE = 'SHOW_OPTIONAL_TREE';
//审批人树
export const SHOW_APPROVE_TREE = 'SHOW_APPROVE_TREE';
//抄送人树
export const SHOW_CC_TREE = 'SHOW_CC_TREE';
//转交人树
export const SHOW_TRANSMIT_TREE = 'SHOW_TRANSMIT_TREE';

//选人控件显示树
export const SHOW_TREE={
    APPROVE_TREE:"SHOW_APPROVE_TREE",
    CC_TREE:"SHOW_CC_TREE",
    MUST:"MUST_TREE",
    OPTIONAL:"OPTION_TREE"
}

//聊天树
export const SHOW_CHAT_TREE = 'SHOW_CHAT_TREE';
//聊天操作树
export const SHOW_CHAT_ADD_TREE = 'SHOW_CHAT_ADD_TREE';

//聊天的action
export const CHAT_ACTION={
    LOAD_HISTORY:'LOAD_HISTORY',
    ADD_HISTORY:'ADD_HISTORY',
    CLEAR_HISTORY:'CLEAR_HISTORY',
    CHANGE_STAR:'CHANGE_STAR',
    REMOVE_STAR:'REMOVE_STAR',
    ADD_MESSAGE:'ADD_MESSAGE'
};
//聊天记录的菜单
export const MESSAGE_RECORD={
    TITLE:[{name: '消息记录', active: true}],
    MENU: [{name: '全部', active: true},
        {name: '重点', type: CHAT_MESSAGE_TYPE.BOOKMARK, active: false},
        {name: '文件', type: CHAT_MESSAGE_TYPE.FILE, active: false},
        {name: '图片', type: CHAT_MESSAGE_TYPE.IMAGE, active: false}],
}
//头像的地址
export const AvatarUrlDomain="http://Totoro:6003/Base-Module/Annex/Avatar";

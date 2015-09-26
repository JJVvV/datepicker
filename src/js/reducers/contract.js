/**
 * Created by BennetWang on 2015/8/21.
 */
import assign from 'object-assign'
import * as constant from '../constants/launchr.js';

const initialState={
    me:{
        //关于我的信息
        //avator:"/public/img/zhangqiuyan.jpg",
        //id:"NDOaqxpE9mT5a5xZ",
        //loginName:"bennetwang",
        //name:"王道斌"
    },
    contacts:[
        //联系人
        //{id:"1eKrxkxozvhj6lRY",name:"alexliu",loginName:"刘君伟",avator:"/public/img/zhangqiuyan.jpg"}
    ],
}
const actionsMap={
    [constant.GETCURRENT_USER]: (state, action) => {
        //return {threadList: action.threadList,currentMsgId:action.currentMsgId}
        return {
            me:action.me,
            contacts:action.contacts
        }
    },
}

export default function contract(state = initialState, action){

    const reduceFn  = actionsMap[action.type];
    if(!reduceFn) return state;
    return Object.assign({}, state, reduceFn(state, action));
}
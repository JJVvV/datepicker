/**
 * Created by AlexLiu on 2015/8/17.
 */

//数据格式
let messageID = 0;

let threadList = [{avator:"/redux-launchr/public/img/zhangqiuyan.jpg", id:0, title:"审批", info:"我爱你再见", timer: "17:02", threadID:'t_1',count: 1},
    {avator:"/redux-launchr/public/img/zhangqiuyan.jpg", id:1, title:"日程", info:"我爱你再见", timer: "17:03", threadID: 't_2'}];


let messages = [{avator:"/redux-launchr/public/img/zhangqiuyan.jpg", id:messageID++, name:"听说", info:"我爱你再见1", timer: "17:02", me: false, threadID:'t_1'}];

export default {threadList, messages}
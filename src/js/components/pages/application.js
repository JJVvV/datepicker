/**
 * Created by Administrator on 2015/7/10.
 */

import React from 'react';






import ApplicationList from '../ApplicationList.js';

import actionContainer from '../../services/actionContainer.js';

export default class ApplicationPage {


  componentDidMount(){


    //actionContainer.get().loadThreadList();
  }

  render(){
    const items = [{avator:"/redux-launchr/public/img/zhangqiuyan.jpg", id:0, title:"审批", link: '/application/approval', info: '我爱你再见'},
      {avator:"/redux-launchr/public/img/zhangqiuyan.jpg", id:1, title:"日程", link: '/application/calendar', info: '我爱你再见'},
      {avator:"/redux-launchr/public/img/zhangqiuyan.jpg", id:2, title:"任务", link: '/application/task/ProjectManage', info: '我爱你再见'}];



    //const {chatMessages, chatRoomName} = this.props.chatData;


    return (
        <section className="page-container">
          <div className="sub-panel">
            <div className="sub-panel-content">
              <ApplicationList items={items} />
            </div>
          </div>
          {this.props.children}

        </section>
    );
  }

  clickItem(id){
    //actionContainer.get().loadChatMessages(id);
    console.log('thread-item\'s id:', id);
  }
}

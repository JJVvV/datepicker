/**
 * Created by Administrator on 2015/7/10.
 */

import React from 'react';

import ChatArea from '../ChatArea.js';
import ChatAppArea from '../ChatAppArea.js'
import SubPanelHeader from '../SubPanelHeader.js';
import ThreadList from '../ThreadList.js';
import actionContainer from '../../services/actionContainer.js';
import {getMessagesByThreadID} from '../../services/messageService.js';
import reduxContainer from '../../services/reduxContainer.js';
import {THREAD_TYPE} from '../../constants/launchr'
import {arrayfind} from '../../services/arrayService.js'
import _ from 'lodash';

export default class Chat {
    componentWillMount() {
        //actionContainer.get().loadThreadList();
    }

    componentDidMount() {

    }

    render() {
        const {threadList, chatMessages, chatRoomName, currentThreadID, chatRoom} = this.props.chatData;
        let messages = getMessagesByThreadID(chatMessages, currentThreadID);
        let Area = <ChatArea chat={{
            messages,
            name: chatRoomName,
            chatRoom: chatRoom,
            currentThreadID: currentThreadID,
            currentChatData:_.find(threadList,'threadID',currentThreadID)
        }}/>;
        let currentThread = arrayfind(threadList, function (value, index, array) {
            return value.threadID == currentThreadID;
        });
        if (currentThread != null && currentThread.type == THREAD_TYPE.APP) {
            Area = <ChatAppArea chat={{messages, name: chatRoomName, code: currentThread.code}}/>;
        }
        return (
            <section className="page-container">
                <div className="sub-panel">
                    <SubPanelHeader />

                    <div className="sub-panel-content">
                        <ThreadList items={threadList} clickItem={::this.clickItem}/>
                    </div>
                </div>
                {Area}
            </section>
        );
    }

    clickItem(item) {
        let action = actionContainer.get();
        const {threadID, title, count,type} = item;

        var chatState = reduxContainer.chat();

        if (chatState.currentThreadID != threadID) {

            action.removeMessageByThread(threadID);

            action.removeMessageByThread(chatState.currentThreadID);

            action.changeThread(threadID, title);

            if (type == THREAD_TYPE.APP) {
                action.loadAppMessage(threadID, title, count);
            }
            else if (type == THREAD_TYPE.CHAT) {
                action.loadChatMessages(threadID, title, count);
            }
        }

        //if(item.count && count > 0){
        //  action.loadChatMessages(threadID, title);
        //}

        //console.log('thread-item\'s threadID:', item.threadID);
    }
}

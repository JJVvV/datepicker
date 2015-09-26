/**
 * Created by Administrator on 2015/7/10.
 */
/*
 * application list item or people list item used in .sub-panel
 */

import React, {PropTypes} from 'react';
import classnames  from 'classnames';
import ChatRoom from './ChatRoom.js';
import ChatTitle from './ChatTitle.js';
import _ from 'lodash';
import {CHAT_ROOM_STR} from '../../constants/launchr.js';
import reduxContainer from '../../services/reduxContainer.js';
import actionContainer from '../../services/actionContainer.js';

export default class ChatTitleWrapper extends React.Component {


    constructor() {
        super();
        this.state = {
            show: false
        }
    }

    render() {
        const {name,currentChatData,...otherProps} = this.props;
        const isGroup = _.endsWith(otherProps.currentThreadID, CHAT_ROOM_STR);
        let roomInfo = {
            currentThreadID:otherProps.currentThreadID,
            removeUser: this.removeUser.bind(this),
            isGroup:isGroup,
            memberList: [{
                avatar: reduxContainer.me().avator,
                nickName: reduxContainer.me().name
            },{
                avatar:currentChatData.avator,
                nickName:currentChatData.title,
                id:currentChatData.threadID
            }]
        };
        if (isGroup) {
            roomInfo = {
                ...roomInfo,
                name: currentChatData.title,
                memberList: currentChatData.memberList
            }
        }
        return (
            <div>
                <ChatTitle name={name} toggle={this.toggleTitle.bind(this)} show={this.state.show}/>
                {this.state.show&& <ChatRoom {...roomInfo}/>}
            </div>
        );
    }

    toggleTitle() {
        this.setState({
            show: !this.state.show
        });
    }

    removeUser(item) {
        let action = actionContainer.get();
        action.deleteGroupUser(this.props.currentThreadID,item.userName)
    }
}




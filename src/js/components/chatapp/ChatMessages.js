/**
 * Created by Administrator on 2015/7/10.
 */

import React, {PropTypes} from 'react';
import ChatMessage from './ChatMessage.js';
import $ from 'jquery';
import ChatAppSystemMessage from "../ChatAppSystemMessage.js";
import ChatShowMoreHistory from "./ChatShowMoreHistory.js";
import { CHAT_MESSAGE_TYPE} from '../../constants/launchr.js';
import actionContainer from '../../services/actionContainer.js';
import reduxContainer from '../../services/reduxContainer.js';
import _ from 'lodash';

export default class ChatMessages extends React.Component {

    constructor(props) {
        super();
        this.state = {
            havMoreMessage:props.messages.length > 0,
            currentThreadID:props.currentThreadID
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.currentThreadID!=nextProps.currentThreadID){
            this.setState({
                currentThreadID:nextProps.currentThreadID,
                havMoreMessage:true
            });
        }
    }

    render() {
        const {messages} = this.props;
        return (
            <ul className="chat-messages">
                {this.state.havMoreMessage && <ChatShowMoreHistory showMoreMessage={this.showMoreMessage.bind(this)}/>}
                {this.renderItems(messages)}
            </ul>
        );
    }

    showMoreMessage() {
        let action = actionContainer.get();
        let chat = reduxContainer.chat();
        action.loadChatMessages(chat.currentThreadID, chat.chatRoomName, 10, true).then(res=> {
            if (!res || reduxContainer.chat().chatMessages.length > 30) {
                this.setState({
                    havMoreMessage: false
                });
            }
        });
    }

    renderItems(messages) {
        let time = (+new Date);
        let _first = true;
        return messages.map(message => {
            if (_.includes([CHAT_MESSAGE_TYPE.TEXT, CHAT_MESSAGE_TYPE.IMAGE,CHAT_MESSAGE_TYPE.AUDIO], message.info.type)) {
                let showTime = _first ? time > (message.timer + 300000) : (time + 300000) < message.timer;
                if (showTime) {
                    _first = false;
                    time = message.timer;
                }
                return (
                    <ChatMessage message={message} key={message.id} showTime={showTime} changeStar={this.props.changeStar.bind(this)}/>
                )
            }
            return (
                <ChatAppSystemMessage content={message.info.content} key={message.id}/>
            )
        });
    }
}




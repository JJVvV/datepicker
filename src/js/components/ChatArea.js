/**
 * Created by Administrator on 2015/7/10.
 */

import React, {PropTypes,ReactCSSTransitionGroup } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import { bindActionCreators } from 'redux'
import ChatMessages from './chatapp/ChatMessages.js';
import ChatTitleWrapper from './chatapp/ChatTitleWrapper.js';
import {checkRespnseSuccess,packRespnseData} from '../services/msbService.js';
import ChatInputPanel from './chatapp/ChatInputPanel.js';
import ChatMessageRecord from './chatapp/ChatMessageRecord.js';
import {Scrollbars} from './scrollbar';
import actionContainer from '../services/actionContainer.js';
import{ CHAT_MESSAGE_TYPE} from '../constants/launchr.js';

@connect((state, prop) => ({
    chatHistoryMessage: state.chatReducer.chatHistoryMessages,
    chatHistoryType: state.chatReducer.chatHistoryType
}))
export default
class ChatArea extends React.Component {
    constructor(props) {
        super();
        this.state = {
            message: [],
            showChatHistory: false,
            havMoreHistory: true
        };
        this.actions = bindActionCreators(chatAction, props.dispatch);
    }

    showChatHistory() {
        this.setState({
            showChatHistory: !this.state.showChatHistory
        })
    }

    showHistory() {
        const {currentThreadID} = this.props.chat;
        this.actions.loadChatHistoryMessages(currentThreadID);
    }

    clearHistory() {
        this.actions.clearChatHistoryMessages();
        this.setState({
            havMoreHistory: true
        });
    }

    changeHistory(type) {
        const {currentThreadID} = this.props.chat;
        this.actions.loadChatHistoryMessages(currentThreadID, type).then(res=> {
            this.setState({
                havMoreHistory: true
            });
        });
    }

    addHistory(type) {
        if (this.state.havMoreHistory) {
            const {currentThreadID} = this.props.chat;
            this.actions.addChatHistoryMessages(currentThreadID, type).then(res=> {
                if (!res) {
                    this.setState({
                        havMoreHistory: false
                    })
                }
            });
        }
    }

    clickItemHistory(item) {
        this.actions.bookMarkJump(item.msgId, item.from);
    }

    removeStar(item) {
        //移除聊天记录的星星
        this.actions.removeStar(item.msgId);
        //移除聊天窗口的星星
        let otherAction = actionContainer.get();
        otherAction.removeStar(item.msgId)
    }

    changeStar(msgId, info) {
        this.actions.addStar(msgId, info);
        if (info.state && this.props.chatHistoryType == CHAT_MESSAGE_TYPE.BOOKMARK) {
            this.actions.insertMsg(info.message);
        }
    }

    componentWillReceiveProps(nextProps) {
        const {currentThreadID} = this.props.chat;
        if (nextProps.chatHistoryMessage.length != 0
            && currentThreadID != nextProps.chat.currentThreadID) {
            this.setState({
                showChatHistory: false
            })
        }
    }

    render() {
        const {chatHistoryMessage,chatHistoryType}=this.props;
        const {messages, name,currentThreadID} = this.props.chat;

        const hasPerson = name && name.length;

        return (
            <div style={{height: '100%'}}>
                {
                    this.state.showChatHistory &&
                    <div className="right-panel">
                        <ChatMessageRecord type={chatHistoryType}
                                           clickItemHistory={this.clickItemHistory.bind(this)}
                                           removeStar={this.removeStar.bind(this)}
                                           historyMessage={chatHistoryMessage}
                                           addHistory={this.addHistory.bind(this)}
                                           changeHistory={this.changeHistory.bind(this)}
                                           clearHistory={this.clearHistory.bind(this)}
                                           showHistory={this.showHistory.bind(this)}/>
                    </div>
                }
                <div className="chat-area global-detail-area">
                    <div className="chat-area-inner">
                        {hasPerson && <ChatTitleWrapper name={name} {...this.props.chat}/>}
                        <Scrollbars style={{height:this._scrollHeight()}}>
                            <div className="chat-content">
                                <ChatMessages currentThreadID={currentThreadID} messages={messages}
                                              changeStar={this.changeStar.bind(this)}/>
                            </div>
                        </Scrollbars>
                        {hasPerson && <ChatInputPanel {...this.props} showHistory={this.showChatHistory.bind(this)}/>}
                    </div>
                </div>
            </div>
        );

    }

    _scrollHeight() {

        oHeight = $(document.body).height() - $('.chat-title').height() - $('.chat-send').height() - 44;
        if (oHeight + 44 == $(document.body).height()) {
            return oHeight = 0;
        } else {
            return oHeight;
        }

    }
}
/**
 * Created by ArnoYao on 2015/9/14.
 */

import React, {PropTypes} from 'react';
import classnames  from 'classnames';
import {contentSubstring} from '../../services/messageService.js'
import actionContainer from '../../services/actionContainer.js';
import {SLIEDER_ACTIVE, S,MESSAGE_TYPE,MESSAGE_APP_TYPE} from '../../constants/launchr.js';
import {sliderShow} from '../../services/slider.js';
import moment from 'moment';
import PubSub from 'pubsub-js';

import AvatarComponent from '../AvatarComponent.js';
import ChatAppSystemMessage from '../../components/ChatAppSystemMessage.js'
import {getTaskDetail} from '../../services/taskService.js'
import {packRespnseData,checkRespnseSuccess} from '../../services/msbService.js';
import {task} from '../../i18n/index.js';

export default class ChatTaskContent extends React.Component {
    constructor() {
        super();
    }

    componentWillMount() {
        let {message}=this.props;
        let info = message.info;
        let msgID = message.id;
        let requestData = {
            showId: info.showID
        };
        actionContainer.get().getChatTaskDetail(requestData, msgID);
    }

    render() {
        let {message}=this.props;
        let info = message.info;
        let msgID = message.id;
        if (info.show) {
            if (message.messageType == MESSAGE_TYPE.SYSTEM) {
                return <ChatAppSystemMessage title={info.content} content={info.title} click={this._showDetail.bind(this, info.detail)}></ChatAppSystemMessage>
            }
            else if (message.messageType == MESSAGE_TYPE.BUSINESS) {
                return <div className="chat-message you">
                    <AvatarComponent userName={message.user} trueName={message.name}  className={'chat-message-avator'}/>
                    <div className="chat-message-content">
                        <h4 className="chat-message-name">
                            {message.name}
                        </h4>
                        <div className="bubble chat-area-bubble">
                            <div className="chat-area-bubble-header">
                                <span className={classnames({
                                    'emergency-line': info.detail != null && info.detail.priority == 'HIGH',
                                    'important-line': info.detail != null && info.detail.priority == 'MEDIUM'
                                })}>{info.title}</span>
                            </div>
                            <div className="chat-area-bubble-body">
                            {info.detail == null ? <div className="attend-meeting-detail calendar-detail-line">任务不存在或已删除</div> : <div
                                className="attend-meeting-detail calendar-detail-line"
                                onClick={this._showDetail.bind(this,info.detail)} style={{cursor:'pointer'}} >
                                <div className="meeting-detail-line">
                                    <span className="time">{task.Project}：</span>
                                    <span>{info.detail.projectName}</span>
                                    </div>
                                <div className="meeting-detail-line">
                                        {info.detail.endTime != null && info.detail.endTime != 0 && <div className="line-detail-group">
                                            <i className="demo-icon icon-glyph-101"></i>
                                            <span className={classnames({"important": this._importantEndTime(info.detail)})}>{moment(info.detail.endTime).format("MM月DD日")}</span>
                                        </div>}
                                    <div className="line-detail-group">
                                        <i className="demo-icon icon-glyph-91"></i>
                                        <span>{info.detail.statusName}</span>
                                        </div>
                                        {info.detail.level == 1 && info.detail.allTask > 0 && <div className="line-detail-group">
                                            <i className="demo-icon icon-glyph-83"></i>
                                            <span>{info.detail.finishedTask}/{info.detail.allTask}</span>
                                        </div>}
                                    </div>
                                <div className="meeting-detail-line">
                                    <pre>{contentSubstring(info.content)}</pre>
                                </div>
                            </div>}
                            </div>
                        </div>
                    </div>
                </div>
            }
        } else {
            return null;
        }
    }


    //滑出详情
    _showDetail(data) {
        if (data) {
            let {message}=this.props;
            let reqData = {
                showId: data.taskId
            };
            sliderShow({
                type: S.TASK_DETAIL,
                task: {
                    showId: reqData.showId,
                    msgId:message.id
                }
            });
        } else {
            alert("任务不存在或已删除");
        }
    }

    //是否快到截止日期
    _importantEndTime(data) {
        if (data.statustype != 'Finish') {
            let nowDate = new Date().getTime();
            if (data.endTime > 0 && nowDate >= data.endTime) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
}
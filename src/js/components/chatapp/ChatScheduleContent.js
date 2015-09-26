/**
 * Created by BennetWang on 2015/8/26.
 */
import React, {PropTypes} from 'react';
import {contentSubstring} from '../../services/messageService.js'
import actionContainer from '../../services/actionContainer.js';
import {SLIEDER_ACTIVE, S,MESSAGE_TYPE,MESSAGE_APP_TYPE} from '../../constants/launchr.js';
import {getTimeReversalDetail,handleMeeting} from '../../services/meetingService.js'
import {checkRespnseSuccess,packRespnseData} from '../../services/msbService.js'
import ChatAppSystemMessage from '../../components/ChatAppSystemMessage.js'
import {sliderDetail} from '../../services/scheduleService.js'
import AvatarComponent from '../AvatarComponent.js';
import {FadeModal as Modal} from '../boron/Boron.js';

import {schedule} from '../../i18n/index.js'

export default class ChatScheduleContent extends React.Component{

    constructor() {
        super();
        this.state = {
            rejectReason: ""
        };
    }

    componentWillMount(){
        let {message}=this.props;
        let info=message.info;
        let msgID=message.id;
        let requestData={
            id:info.showID,
            startTime:info.remark
        };
        if(message.messageType==MESSAGE_TYPE.SYSTEM){

            if(message.messageAppType==MESSAGE_APP_TYPE.EVENT || message.messageAppType==MESSAGE_APP_TYPE.EVENT_COMMENT){
                actionContainer.get().getChatScheduleDetail(requestData,msgID);
            }
            else if(message.messageAppType==MESSAGE_APP_TYPE.MEETING || message.messageAppType==MESSAGE_APP_TYPE.MEETING_COMMENT){

                actionContainer.get().getChatMeetingDetail(requestData,msgID);
            }
           
        }
        else if(message.messageType==MESSAGE_TYPE.BUSINESS){
           
                actionContainer.get().getChatMeetingDetail(requestData,msgID);
            
           
        }


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
                return (
                    <div className="chat-message you">
                        <AvatarComponent userName={message.user} trueName={message.name} className={'chat-message-avator'}/>
                        <div className="chat-message-content">
                            <h4 className="chat-message-name">
                                    {message.name}
                            </h4>
                            <div className="bubble chat-area-bubble">
                                <div className="chat-area-bubble-header">
                                    <span>{info.title}</span>
                                </div>
                                <div className="chat-area-bubble-body" >
                                        {info.detail == null ? <div className="attend-meeting-detail calendar-detail-line">{schedule.ScheduleError}</div> : <div
                                            className="attend-meeting-detail calendar-detail-line"
                                            onClick={this._showDetail.bind(this, info.detail)} style={{cursor:'pointer'}}>
                                            {getTimeReversalDetail(info.detail.start, info.detail.end)}
                                            <div className="meeting-detail-line">
                                                <i className="demo-icon icon-glyph-206"></i>
                                                <span>{info.detail.place}</span>
                                            </div>
                                            <div className="meeting-detail-line">
                                                <pre>{contentSubstring(info.content)}</pre>
                                            </div>
                                        </div>}
                                </div>
                                    {!info.isHandled ? <div className="inner-box">
                                        <div className="pull-right btn-group">
                                            <span
                                                className="btn-attend"
                                                onClick={this._handleMeeting.bind(this, info.detail.id, 1, '', msgID)}
                                            >{schedule.Attend}</span>
                                            <span
                                                className="btn-attend"
                                                onClick={this._showModal.bind(this)}
                                            >{schedule.Reject}</span>
                                        </div>

                                        <Modal ref="modal">
                                            <div className="approval-submit-box">
                                                <div className="head">
                                                    <textarea className="form-c" name="" id="" cols="2" rows="1" placeholder={schedule.RejectReason} valueLink={this.linkState('rejectReason')}></textarea>
                                                </div>
                                                <div className="approval-submit-btn-group clearfix">
                                                    <div className="button cancle" onClick={::this._closeModal}>{schedule.Cancel}</div>
                                                    <div onClick={this._handleMeeting.bind(this, info.detail.id, 0, '', msgID)} className="button comfirm-reject">{schedule.Confirm}</div>
                                                </div>
                                            </div>
                                        </Modal>

                                    </div> : null}
                            </div>
                        </div>
                    </div>
                )
            }
        } else {
            return null;
        }
    }

    _showDetail(detail){
        let {message}=this.props;
        let msgID=message.id;
        let param={
            id:detail.id,
            startTime:detail.start,
            type:detail.type,
            isAllDay:detail.isAllDay,
            relateId:detail.id,
            msgID:msgID
        };

        sliderDetail(param);
    }

    _showModal() {
        this.refs.modal.show();
    }

    _closeModal() {
        this.setState({
            rejectReason:''
        });
        this.refs.modal.hide();
    }

    _handleMeeting(showId,isAgree,reason,msgID){
        let requestData={
            showId:showId,
            isAgree:isAgree,
            reason:this.state.rejectReason
        };
        handleMeeting(requestData).then((res)=>{
            let retData = packRespnseData(res);
            if (checkRespnseSuccess(res)){
                this._closeModal();
                actionContainer.get().handleChatMeeting(requestData,msgID);
            }else {
                alert(retData.Reason);
            }
        });
        //actionContainer.get().handleChatMeeting(requestData,msgID);
    }

}
Object.assign(ChatScheduleContent.prototype, React.addons.LinkedStateMixin);
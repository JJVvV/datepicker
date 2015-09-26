/**
 * Created by Administrator on 2015/7/10.
 */

import React, {PropTypes} from 'react';
import classnames  from 'classnames';
import $ from 'jquery';

import PubSub from 'pubsub-js';

import {CHANGE_SLIDER, SLIDER_ACTIVE, S,REFRESH_APPROVE,MESSAGE_APP_TYPE} from '../constants/launchr.js';
import {sliderShow} from '../services/slider.js';
import ApprovalReceive from './ApprovalReceive.js';
import ApprovalIssue from './ApprovalIssue.js';
import {getApproveUnreadMsg} from '../services/approveService.js'
import {checkRespnseSuccess,packRespnseData} from '../services/msbService.js';
import {approve} from '../i18n/index.js';

export default class ApprovalArea extends React.Component {
    constructor(){
        super();
        this.state = this.getState();
    }

    componentDidMount(){
        ::this._getMsgCount();

        PubSub.subscribe(REFRESH_APPROVE, (eventName, data) => {
            this._getMsgCount();
        })
    }

    render() {
        const {show}=this.props;
        return (
            <div className="approval-area global-detail-area">
                <div className="approval">
                    <div className="attend-person-group">
                        <div className="approval-handle-title-wrapper">
                            <div className="approval-handle-title clearfix">
                                <div className={classnames({'approval-handle-title-item':true,'active': this.state.showApproval})} onClick={this.toggleTitle.bind(this,'search')}>
                                    <i className="demo-icon icon-glyph-81 approval-handle-title-icon"></i>
                                    <span>{approve.accepted}</span>
                                    {this.state.receiveMsgCount > 0 &&
                                    <i className="circle-tip handle-title-circle">{this.state.receiveMsgCount}</i>}
                                </div>
                                <div className={classnames({'approval-handle-title-item':true,'active': !this.state.showApproval})} onClick={this.toggleTitle.bind(this,'post')}>
                                    <i className="demo-icon icon-glyph-82 approval-handle-title-icon"></i>
                                    <span className={this.state.sendMsgCount > 0 && "chat-area-unread"}>{approve.issue}</span>
                                </div>
                            </div>
                            <i className="approval-search icon-glyph-115 calendar-action-search handle-title-search-icon" onClick={::this.showSearchApproval} ></i>
                            <i className="approval-search icon-glyph-166 calendar-action-search handle-title-plus-icon" onClick={::this.showPlusApproval} ></i>
                        </div>
                    </div>
                   {this.state.showApproval ? <ApprovalReceive msgCount={this.state.ccMsgCount}  /> : <ApprovalIssue />}
                </div>
            </div>
          );
    }

    _getMsgCount(){
        let totalCount = 0;
        getApproveUnreadMsg(0, null, null, [MESSAGE_APP_TYPE.APPROVE, MESSAGE_APP_TYPE.CC, MESSAGE_APP_TYPE.SEND]).then((res)=>{
            let retData = packRespnseData(res);
            if (checkRespnseSuccess(res)){
                let receiveMsgCount = 0;
                let ccMsgCount = 0;
                let sendCount = 0;
                retData.Data.map((item, index)=>{
                    if (item.appMessageType == MESSAGE_APP_TYPE.APPROVE){
                        receiveMsgCount++;
                    }else if (item.appMessageType == MESSAGE_APP_TYPE.CC){
                        ccMsgCount++;
                    }else{
                        sendCount++;
                    }
                });
                this.setState({
                    msg:retData.Data,
                    receiveMsgCount: receiveMsgCount+ccMsgCount,
                    ccMsgCount:ccMsgCount,
                    sendMsgCount: sendCount
                })
            }
        });
    }


    getState(){
        let showApproval = this.showApproval(true);
        return {...showApproval};
    }

    showApproval(show){
        return{
            showApproval:show,
            receiveMsgCount:0,
            sendMsgCount:0,
            ccMsgCount:0,
            msg:[]
        }
    }

    toggleTitle(type){
        //let showApproval = !this.state.showApproval;
        let inner;
        switch(type){
            case 'search':
                inner = true;
                break;
            case 'post':
                inner = false;
                break;
        }
        this.setState({showApproval:inner});
    }

    showSearchApproval(){
        sliderShow({type:S.APPROVAL_SEARCH});
    }

    showPlusApproval(){
        sliderShow({type:S.APPROVAL_PLUS});
    }

    _refreshMsgCount(type){

    }
}




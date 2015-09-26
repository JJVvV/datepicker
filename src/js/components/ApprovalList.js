/**
 * Created by RichardJi on 2015/9/8.
 */

import React, { PropTypes , Component} from 'react/addons.js';
import classnames  from 'classnames';
import PubSub from 'pubsub-js';
import {getApproveStatus, approveShowDate,getApprovalDetail,getApproveTypeDetail,getApproveUnreadMsg} from '../services/approveService.js';
import {checkRespnseSuccess,packRespnseData} from '../services/msbService.js';
import {CHANGE_SLIDER, SLIDER_ACTIVE, S,REFRESH_APPROVE,MESSAGE_APP_TYPE } from '../constants/launchr.js';
import {sliderShow} from '../services/slider.js';
import AvatarComponent from '../components/AvatarComponent.js';
import {approve} from '../i18n/index.js';

export default class ApprovalList extends React.Component{

    constructor(props){
        super(props);

        this.state={
            approveList:[],
            isWait:props.isWait
        }
    }

    componentWillReceiveProps(nextProps){
        this._getMsgList(nextProps);
    }

    render(){
        return (
            (this.state.isWait && this.state.isWait == true) ?
                <div className="approval-list approval-list">
                    {
                        this.state.approveList.map((item, index)=> {
                            return (
                                <div className={item.isUnRead ? "approval-item unread" : "approval-item"} onClick={::this._getApprovalDetail.bind(this, item.SHOW_ID)}>
                                    <div className="approval-item-func">
                                        <div className="tip">
                                            { item.A_IS_URGENT == 0 || <span className="important">{approve.urgent}</span>}
                                            { (item.A_IS_URGENT != 0 || (!item.A_DEADLINE || item.A_DEADLINE <= 0)) || <span className="important">{approveShowDate(item.A_DEADLINE, null, item.IS_DEADLINE_ALL_DAY, 1) }{approve.cutoff}</span>}
                                        </div>
                                        <div className="approval-item-func-line">
                                            <span>{ approveShowDate(item.CREATE_TIME)}</span>
                                            { (item.HAS_FILE != null && item.HAS_FILE == 1) &&
                                            <span className="icon-glyph-118"></span>}
                                            { (item.HAS_COMMENT != null && item.HAS_COMMENT == 1) &&
                                            <span className={item.hasNewComment ? "approval-item-comment icon-glyph-29 comment-tip" : "approval-item-comment icon-glyph-29"}></span>}
                                        </div>
                                    </div>
                                    <div className="approval-item-avator avator">
                                        <AvatarComponent userName={item.CREATE_USER}></AvatarComponent>
                                    </div>
                                    <div className="approval-item-info">
                                        <h4>{ item.CREATE_USER_NAME}</h4>
                                        <p className="text-middle">{ item.A_TITLE}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                :
            <div className="approval-list approval-list">
            {
                this.state.approveList.map((item, index)=>{
                    return (
                        <div className={item.isUnRead ? "approval-item unread" : "approval-item"} onClick={::this._getApprovalDetail.bind(this, item.SHOW_ID)}>
                            <div className="approval-item-func">
                                <div className="tip">
                                    { item.A_IS_URGENT == 0 || <span className="important">{approve.urgent}</span>}
                                    {getApproveStatus(item.A_STATUS)}
                                </div>
                                <div className="approval-item-func-line">
                                    <span>{ approveShowDate(item.CREATE_TIME)}</span>
                                    { (item.HAS_FILE != null && item.HAS_FILE == 1) &&
                                    <span className="icon-glyph-118"></span>}
                                    { (item.HAS_COMMENT != null && item.HAS_COMMENT == 1) &&
                                    <span className={(item.hasNewComment != null && item.hasNewComment == 1) ? "approval-item-comment icon-glyph-29 comment-tip" : "approval-item-comment icon-glyph-29"}></span>}
                                </div>
                            </div>
                            <div className="approval-item-avator avator">
                                <AvatarComponent userName={item.CREATE_USER}></AvatarComponent>
                            </div>
                            <div className="approval-item-info">
                                <h4>{ item.CREATE_USER_NAME}</h4>
                                <p className="text-middle">{ item.A_TITLE}</p>
                            </div>
                        </div>
                    )
                })
            }
            </div>
        );
    }

    _getApprovalDetail(showid){
        getApprovalDetail(showid).then((res)=>{
            let retData = packRespnseData(res);
            if (checkRespnseSuccess(res)) {
                sliderShow({
                    type:S.APPROVAL_DETAIL,
                    approval:retData.Data
                })
            }
        });
    }

    _getMsgList(approveList){
        //let getUnReadMsg = getApproveUnreadMsg(0);
        //let get

        getApproveUnreadMsg(0, null, null, [MESSAGE_APP_TYPE.APPROVE, MESSAGE_APP_TYPE.CC, MESSAGE_APP_TYPE.SEND, MESSAGE_APP_TYPE.APPROVAL_COMMENT]).then((res)=>{
        //    getApproveUnreadMsg(0).then((res)=>{
            let retData = packRespnseData(res);
            if (checkRespnseSuccess(res)){
                var list = [];
                approveList.data.map((item, index)=>{
                    list[item.SHOW_ID] = item;
                });
                retData.Data.map((item, index)=>{
                    if (list[item.rmShowID]){
                        if (item.appMessageType == MESSAGE_APP_TYPE.APPROVAL_COMMENT){
                            list[item.rmShowID].hasNewComment = 1;
                        }else{
                            list[item.rmShowID].isUnRead = 1;
                        }
                    }
                });
                var result = [];
                for(var key in list){
                    result.push(list[key]);
                }
                ::this.setState({
                    approveList:result,
                    isWait:this.props.isWait
                });
            }
        });
    }

}




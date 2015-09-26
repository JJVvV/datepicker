/**
 * Created by Tyrion on 2015/9/9.
 */

import React, { PropTypes , Component} from 'react/addons.js';
import classnames  from 'classnames';
import PubSub from 'pubsub-js';
import request from 'reqwest';
import {REFRESH_APPROVE, CHANGE_SLIDER, S,MESSAGE_APP_TYPE,SHOW_TREE_RESULT,SHOW_TREE} from '../constants/launchr.js';
import moment from 'moment';
import $ from 'jquery';
import {sliderShow} from '../services/slider.js';
import reduxContainer from '../services/reduxContainer.js';
import {getApproveTypeDetail,approveShowDate,approveProcess,approveTransmit,deleteApprove} from '../services/approveService.js';
import {checkRespnseSuccess,packRespnseData} from '../services/msbService.js';
import {GetApprovalDatail,postApproveComment} from '../services/approveService.js';
import {FadeModal as Modal} from './boron/Boron.js';

import Comment from '../components/Comment.js';
import FileShowComponent from '../components/FileShowComponent.js';
import SelectUserArea from './SelectUserArea.js'
import AvatarComponent from '../components/AvatarComponent.js';
import {approve} from '../i18n/index.js';

export default class ApprovalDetail extends Component{
    constructor(props){
    super(props);

        this.state =  {
            showApprove:false,
            deptName:'',
            approveResult:'',
            approveReason:'',
            A_TREE: [],
            SHOW_SELECT:'',
            SHOW_REASON:'',
            SHOW_WORD:'',
            SHOW_TREE:'',
            fileShowIds:[]
        }
    }

    //componentWillReceiveProps

    componentWillUpdate(){
        this.state.showApprove=false;
    }


    componentWillUnmount(){
        PubSub.publish(REFRESH_APPROVE);
    }

    render(){
        let result = this._getTouUsers();
        let touUsers= result.name;
        let toUserNames=result.trueName;
        return(
            <div className="new-meeting-box">
    <div className="meeting-detail-header">
        <span>{approve.approveDetail}</span>
        <i className="icon-glyph-167 pull-right" onClick={::this.props.onClose}></i>
    </div>

    <div className="meeting-box-body">
        <p className="meeting-detail-title">
            <span className="title">{this.props.approval.A_TITLE}</span>
        {this.props.approval.A_IS_URGENT == 0 ||
        <span className="pull-right">{approve.urgent}</span>}
            {this.props.approval.A_IS_URGENT == 0 ||
            <span className="circle-heigh pull-right"></span>
            }
            </p>

            <div className="attend-person-group approve-group">
                <div className="subtask-member pull-left">
                    <div className="chat-room-member-small"><AvatarComponent userName={this.props.approval.CREATE_USER}></AvatarComponent>
                    </div>
                </div>
                <div className="approve-detail">
                    <div className="approve-detail-line"><span className="title">{this.props.approval.CREATE_USER_NAME}</span>
            { (this.props.approval.A_IS_URGENT != 0 || (!this.props.approval.A_DEADLINE || this.props.approval.A_DEADLINE <= 0)) || <span className="pull-right emergency">{approveShowDate(this.props.approval.A_DEADLINE, null, this.props.approval.IS_DEADLINE_ALL_DAY, 1)+approve.cutoff}</span>}
        </div>
        <div className="approve-detail-line"><span className="default">Zeus</span><span className="default pull-right">{ approveShowDate(this.props.approval.CREATE_TIME)+approve.submit}</span>
        </div>
    </div>
</div>

<div className="attend-person-group">
    <div className="task-line">
        <div className="task-detail-title "><span>{approve.type}</span></div>
        <div className="task-detail-main"><span>{this.props.approval.T_NAME}</span></div>
        <div className="task-detail-tips">
                {(this.props.approval.A_STATUS == "WAITING" || this.props.approval.A_STATUS == "IN_PROGRESS") && <span className="ordinary">{approve.inprogress}</span>}
        </div>
    </div>
    { (!this.props.approval.A_START_TIME || this.props.approval.A_START_TIME == 0) ||
    <div className="task-line">
        <div className="task-detail-title "><span>{approve.time}</span></div>
        <div className="task-detail-main1"><span>{approveShowDate(this.props.approval.A_START_TIME, this.props.approval.A_END_TIME, this.props.approval.IS_TIMESLOT_ALL_DAY)}</span></div>

    </div>}

            { (!this.props.approval.A_FEE || this.props.approval.A_FEE == 0) ||
            <div className="task-line">
                <div className="task-detail-title "><span>{approve.money}</span></div>
                <div className="task-detail-main"><span>{this.props.approval.A_FEE}</span></div>

            </div>}
        </div>

                {!this.props.approval.A_BACKUP ||
                < div className="attend-person-group">
                    <p className="meeting-detail-topic">{this.props.approval.A_BACKUP}</p>
                </div>
                }

        {this.props.approval.HAS_FILE == 1 && <div className="attend-person-group">
            <FileShowComponent appShowID={'ADWpPoQw85ULjnQk'} rmShowID={this.props.approval.SHOW_ID} ></FileShowComponent>

        </div>}
        <div className="attend-person-group">
            <div className="attend-person-line">
                <span className="attend-title">{approve.approver}</span>
                {::this._getApproveList()}
            </div>
            {this.props.approval.A_CC.length > 0 &&
            <div className="attend-person-line">
                <span className="attend-title">{approve.cc}</span>

                {::this._getCCList()}
            </div>}
        </div>


        <Comment
            appShowID={"ADWpPoQw85ULjnQk"}
            rmShowID={this.props.approval.SHOW_ID}
            toUsers={touUsers}
            toUserNames={toUserNames}
            Title={this.props.approval.A_TITLE}
            messageAppType={MESSAGE_APP_TYPE.APPROVAL_COMMENT}
            sendCommentCallBack={::this._setComment.bind(this)}
            ></Comment>


    </div>
                {(this.state.showApprove && 1==2) &&
                (<ul className="dropdown-list bottom-right" style={{top:'91%',left:'432px'}}>
                    <li className="dropdown-item">
                            {(this.props.approval.IS_CAN_MODIFY == 1 || this.props.approval.IS_CAN_DELETE == 1) &&<a  onClick={::this._showModal.bind(this,'SHARE')}><i className="demo-icon icon-glyph-71"></i><span>{approve.forwarding}</span> </a>}
                            {this.props.approval.IS_CAN_MODIFY == 1 &&  <a style={{width:'33%'}} onClick={::this._approveUpdate.bind(this)}><span>{approve.editor}</span></a>}
                            {this.props.approval.IS_CAN_DELETE == 1 && <a style={{width:'33%'}} onClick={::this._showModal.bind(this,'DELETE')}><span>{approve.delete}</span></a>}

                    </li>
                </ul>)}
                    {this.props.approval.IS_CAN_APPROVE == 1 ?
                <div className="approve-detail-footer-btn">
                <a onClick={::this._approveApproval.bind(this)}><span>{approve.pass}</span></a>
                            <a onClick={::this._showModal.bind(this,'TRANSMIT')}><span>{approve.transmit}</span></a>
                            <a onClick={::this._showModal.bind(this,'DENY')}><span>{approve.fail}</span></a>
                            <a onClick={::this._showModal.bind(this,'CALL_BACK')}><span>{approve.callback}</span></a>
                        <a onClick={::this._showApprove}><i className="demo-icon icon-ellipsis"></i></a>
                      </div> :
                      <div className="approve-detail-footer-btn">
                          <a style={{width:'33%',display:'none'}} onClick={::this._showModal.bind(this,'SHARE')}><span>{approve.forwarding}</span></a>
                        {this.props.approval.IS_CAN_MODIFY == 1 &&
                          <a style={{width:'33%'}}  onClick={::this._approveUpdate.bind(this)}><span>{approve.editor}</span></a>}
                        {this.props.approval.IS_CAN_DELETE == 1 &&
                          <a style={{width:'33%'}} onClick={::this._showModal.bind(this,'DELETE')}><span>{approve.delete}</span></a>}

                    </div> }
                        <Modal  ref="modal">

                            <SelectUserArea ref="user_tree"  multiple={this.state.SHOW_TREE == SHOW_TREE_RESULT.SHARE}    selectKeys={::this.getSelectKeys(this.state.A_TREE)} onCheck={::this._setTreeResult.bind(this)} />
                            {this._getLayout()}
                        </Modal>
            </div>
        )
    }

    _getTouUsers(){
        let users = [];
        let touUser = {};
        touUser.name = [];
        touUser.trueName = [];
        if (this.props.approval.A_APPROVE){
            this.props.approval.A_APPROVE.map((item, index)=>{
                users[item.USER] = item.USER_NAME;
            })
        }
        if (this.props.approval.A_CC){
            this.props.approval.A_CC.map((item, index)=>{
                users[item.USER] = item.USER_NAME;
            })
        }
        if (this.props.approval.A_APPROVE_PATH){
            this.props.approval.A_APPROVE_PATH.map((item, index)=>{
                users[item.USER] = item.USER_NAME;
            })
        }
        users[this.props.approval.CREATE_USER] = this.props.approval.CREATE_USER_NAME;
        for(var key in users){
            touUser.name.push(key);
            touUser.trueName.push(users[key]);
        }
        return touUser;
    }

    _setTreeResult(result){
        this.setState({
            A_TREE:result
        });
    }

    _showApprove() {
        this.setState({               
            showApprove: !this.state.showApprove
        });
    }


    _removeUser(users, user) {
        let index= _.findIndex(users,function(item){
            return item.name==user;
        })
        users.splice(index,1);
        this.setState({
            A_TREE:users
        });
    }


    getSelectKeys(list){
        var aa =  list.map((item, index)=>{
            return item.name;
        });
        return aa;
    }

    _showModal(type){
        this.refs.modal.show();
            let reason, select, word, tree;
        switch(type){
            case 'TRANSMIT':
                select= approve.approver;
                reason =approve.reason;
                word="";
                tree= SHOW_TREE_RESULT.TRANSMIT;
                break;
            case 'SHARE':
                select= approve.Forwarder;
                reason ="";
                word="";
                tree=SHOW_TREE_RESULT.SHARE;
                break;
            case 'DENY':
                select= "";
                reason =approve.reason;
                word="";
                tree="";
                break;
            case 'CALL_BACK':
                select= "";
                reason =approve.reason;
                word="";
                tree="";
                break;
            case 'DELETE':
                select= "";
                reason ="";
                word=approve.remove;
                tree="";
                break;
             
            }
        this.setState({
            SHOW_SELECT:select,
            SHOW_REASON:reason,
            SHOW_WORD:word,
            SHOW_TREE:tree,
            approveResult:type
        });
    }
     _closeModal(){
         this.setState({
             approveReason:'',
             A_TREE:[]
         });
        this.refs.modal.hide();
     }


    _getApproveList(){
        return (
            <div className="attend-meeting-avator">
            {this.props.approval.A_APPROVE_PATH.map((item, index)=>{
                return (
                    <div>
                        <div className="chat-room-member-small"><AvatarComponent userName={item.name}></AvatarComponent></div>
                { index === this.props.approval.A_APPROVE_PATH.length - 1||<div className="chat-room-member-small"><i className="demo-icon icon-glyph-136"></i></div>}
                        </div>
                    );
            })}
            {(this.props.approval.A_APPROVE_PATH.length !=0 && this.props.approval.A_APPROVE.length !=0) && <div className="chat-room-member-small"><i className="demo-icon icon-glyph-136"></i></div>}
            {this.props.approval.A_APPROVE.map((item, index)=>{
                return (
                    <div className="chat-room-member-small"><AvatarComponent userName={item.name}></AvatarComponent></div>
                );
            })}
            </div>
        );
    }

    _getCCList(){
        return (
            <div className="attend-meeting-avator">
            {this.props.approval.A_CC.map((item, index)=>{
                return (
                    <div className="chat-room-member-small"><AvatarComponent userName={item.name}></AvatarComponent></div>
                );
            })}
            </div>
        );
    }

    _setComment(){
        if (this.props.approval.HAS_COMMENT == null  || this.props.approval.HAS_COMMENT == 0){
            let data={
                SHOW_ID:this.props.approval.SHOW_ID,
                HAS_COMMENT:1
            }
            postApproveComment(data).then((res)=>{
                PubSub.publish(REFRESH_APPROVE, true);
            });
        }
    }

    _approveApproval(){
        let showid = this.props.approval.SHOW_ID;
        approveProcess(showid, "APPROVE").then((res) =>{
            let retData = packRespnseData(res);
            if (checkRespnseSuccess(res)){
                this.props.onClose();
                PubSub.publish(REFRESH_APPROVE, true);
            }else {
                alert(retData.Reason);
            }
        });
    }

    _approveTransmit(){
        let showid = this.props.approval.SHOW_ID;
        let approve = this.state.A_TREE;
        let reason = this.state.approveReason;
        approveTransmit(showid, approve, reason).then((res) =>{
            let retData = packRespnseData(res);
            if (checkRespnseSuccess(res)){
                this._closeModal();
                this.props.onClose();
                PubSub.publish(REFRESH_APPROVE, true);
            }else {
                alert(retData.Reason);
            }
        });
    }

    _approveProcess(){
        let showid = this.props.approval.SHOW_ID;
        let result = this.state.approveResult;
        let reason = this.state.approveReason;
        approveProcess(showid, result, reason).then((res) =>{
           let retData = packRespnseData(res);
            if (checkRespnseSuccess(res)){
                this._closeModal();
                this.props.onClose();
                PubSub.publish(REFRESH_APPROVE, true);
            }else {
                alert(retData.Reason);
            }
        });
    }


    _approveDelete(){
        let showid = this.props.approval.SHOW_ID;
        deleteApprove(showid).then((res) =>{
            let retData = packRespnseData(res);
            if (checkRespnseSuccess(res)){
                this._closeModal();
                this.props.onClose();
                PubSub.publish(REFRESH_APPROVE, true);
            }else {
                alert(retData.Reason);
            }
        });
    }

    _approveUpdate(){
        let approve = this.props.approval;
        approve.fileShowIds = this.state.fileShowIds;
        sliderShow({
            type:S.APPROVAL_PLUS,
            approval:approve
        })
    }

    _approveShare(){
        this._closeModal();
        this.props.onClose();
    }

    _getLayout(){
        return (
            <div className="approval-submit-box">
                <div className="head">
                    {this.state.SHOW_SELECT && <div className="approval-member-group">
                        <span>{this.state.SHOW_SELECT}</span>
                        <div className="layout-approval-member">
                        { this.state.A_TREE.map((item, index)=>{
                            return (
                                    <div className="chat-room-member"><AvatarComponent userName={item.name}></AvatarComponent><i className="icon-glyph-192 circle" onClick={this._removeUser.bind(this,this.state.A_TREE,item.name)}></i></div>
                            );
                        })
                        }
                            <div className="chat-room-members-add icon-glyph-1" onClick={this.toggleUser.bind(this)}></div>
                    </div>
                    </div>}
                    {this.state.SHOW_WORD && <p className="delapprove">{this.state.SHOW_WORD}</p>}
                    {this.state.SHOW_REASON && <textarea className="form-c" name="" id="" cols="2" rows="1" placeholder={this.state.SHOW_REASON} valueLink={this.linkState('approveReason')}></textarea>}
                </div>
                <div className="approval-submit-btn-group clearfix">
                    <div className="button cancle" onClick={::this._closeModal}>{approve.cancel}</div>
                    { this.state.approveResult == "TRANSMIT" && <div onClick={::this._approveTransmit.bind(this)} className="button comfirm-pass">{approve.confirm}</div>}
                    { this.state.approveResult == "SHARE" && <div onClick={::this._approveShare.bind(this)} className="button comfirm-pass">{approve.confirm}</div>}
                    { this.state.approveResult == "DENY" && <div onClick={::this._approveProcess.bind(this)} className="button comfirm-reject">{approve.confirm}</div>}
                    { this.state.approveResult == "DELETE" && <div onClick={::this._approveDelete.bind(this)} className="button comfirm-reject">{approve.confirm}</div>}
                    { this.state.approveResult == "CALL_BACK" && <div onClick={::this._approveProcess.bind(this)} className="button comfirm-reject">{approve.confirm}</div>}
                </div>
            </div>
        );
    }



    toggleUser(tree, type){
        this.refs.user_tree.show();
    }
}
Object.assign(ApprovalDetail.prototype, React.addons.LinkedStateMixin);
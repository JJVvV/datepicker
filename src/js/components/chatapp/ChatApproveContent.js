/**
 * Created by TyrionKong on 2015/9/14.
 */
import React, {PropTypes} from 'react';
import PubSub from 'pubsub-js';
import {contentSubstring} from '../../services/messageService.js'
import actionContainer from '../../services/actionContainer.js';
import {SLIEDER_ACTIVE, S,MESSAGE_TYPE,MESSAGE_APP_TYPE,SHOW_TREE_RESULT,SHOW_TREE ,REFRESH_APPROVE} from '../../constants/launchr.js';
import {getTimeReversalDetail} from '../../services/meetingService.js'
import ChatAppSystemMessage from '../../components/ChatAppSystemMessage.js'
import {approveShowDate,sliderApproveDetail,approveProcess,approveTransmit} from '../../services/approveService.js'
import {checkRespnseSuccess,packRespnseData} from '../../services/msbService.js'
import {FadeModal as Modal} from '../boron/Boron.js';
import SelectUserArea from '.././SelectUserArea.js'
import AvatarComponent from '../../components/AvatarComponent.js';
import {approve} from '../../i18n/index.js';

export default class ChatApproveContent extends React.Component{

    constructor(){
        super();

        this.state =  {
            showApprove:false,
            deptName:'',
            approveResult:'',
            approveReason:'',
            A_TREE: [],
            SHOW_SELECT:'',
            SHOW_REASON:'',
            SHOW_WORD:'',
            SHOW_TREE:''
        }
    }

    componentWillMount(){
        let {message}=this.props;
        let info=message.info;
        let msgID=message.id;
        let requestData=info.showID;
        if(message.messageType==MESSAGE_TYPE.SYSTEM){
                 
                actionContainer.get().getChatApprovalDetail(requestData,msgID);
            
        }
        else if(message.messageType==MESSAGE_TYPE.BUSINESS){
          
                actionContainer.get().getChatApprovalDetail(requestData,msgID);
            
        }


    }
    

    componentDidMount(){
        this.TransmitTree = PubSub.subscribe(SHOW_TREE_RESULT.TRANSMIT, ::this._setTreeResult);
    }

    componentWillUnMount(){
        PubSub.unsubscribe(this.TransmitTree);
    }


    render(){
        let {message}=this.props;
        let info=message.info;
        let msgID=message.id;
        if(info.show){
            if(message.messageType==MESSAGE_TYPE.SYSTEM){
               return  <ChatAppSystemMessage title={info.content} content={info.title} click={this._showDetail.bind(this,info.detail)}></ChatAppSystemMessage>
            }
            else if(message.messageType==MESSAGE_TYPE.BUSINESS){
               
                return(

                    <div className="chat-message you">
                        <AvatarComponent userName={message.user} className={'chat-message-avator'}/>

                        <div className="chat-message-content">
                            <h4 className="chat-message-name">
                                {message.name}
                            </h4>

                            <div className="bubble chat-area-bubble">
                                <div className="chat-area-bubble-header" onClick={this._showDetail.bind(this,info.detail)}>
                                    <span>{info.detail.title}</span>
                                </div>
                                {this._getDetail()}
                                {info.detail && <div>{info.detail.isCanApprove?<div className="inner-box">
                                         {(!info.detail.deadline || info.detail.deadline<0) || <span className="important">{approveShowDate(info.detail.deadline,null,info.detail.isDeadlineAllday,1)}{approve.cutoff}</span>}
                                         <div className="pull-right btn-group">
                                             <span onClick={::this._approveApproval.bind(this)}>{approve.pass}</span>
                                             <span onClick={::this._showModal.bind(this,'TRANSMIT')}>{approve.transmit}</span>
                                             <span onClick={::this._showModal.bind(this,'DENY')}>{approve.fail}</span>
                                             <span onClick={::this._showModal.bind(this,'CALL_BACK')}>{approve.callback}</span>
                                         </div>
                                     </div>:null}</div>}
                            </div>
                                        <Modal  ref="modal">

                                            <SelectUserArea  ref="approve"  multiple={false}     onCheck={::this._setTreeResult.bind(this, SHOW_TREE_RESULT.APPROVE)}  />
                                            {this._getLayout()}
                                        </Modal>
                        </div>
                    </div>

                    )
             }

        }else{
            return null;
        }

    }


    _setTreeResult(show, result){
        this.setState({
            A_TREE:result
        });
    }

    _showDetail(detail){
        
        let approve={
            id:detail.id
        };

        sliderApproveDetail(approve);
    }

    _approveProcess(){
        let {message}=this.props;
        let showID=message.info.detail.id;
        let result = this.state.approveResult;
        let reason = this.state.approveReason;
        let msgID=message.id;
        approveProcess(showID, result, reason).then((res) =>{
            let retData = packRespnseData(res);
        if (checkRespnseSuccess(res)){
            this._closeModal();

            PubSub.publish(REFRESH_APPROVE, true);
            actionContainer.get().getChatApprovalDetail(showID,msgID);
        }else {
            alert(retData.Reason);
        }
    });
}

   _approveApproval(){
        let {message}=this.props;
        let showID=message.info.detail.id;    
        let msgID=message.id;
        approveProcess(showID, "APPROVE").then((res) =>{
            let retData = packRespnseData(res);
            if (checkRespnseSuccess(res)){                
                PubSub.publish(REFRESH_APPROVE, true);
                actionContainer.get().getChatApprovalDetail(showID,msgID);
            }else {
                alert(retData.Reason);
            }
        });
    }

    _showDate(start,end){
        let hasTime=end-start;
        let result;
        let dd = 1000*60*60*24;
        let hh = 60*60*1000;
        let mm = 60*1000;
        if(hasTime>dd){
            let oDays = parseInt(hasTime/dd);
            let oHours = parseInt((hasTime-oDays*dd)/hh);
            let oMinite = parseInt((hasTime-oDays*dd-oHours*hh)/mm);

            return result = oDays + approve.day+oHours+approve.hour+oMinite+approve.minute;
        }else{
            let oHours = parseInt(hasTime/hh);
            let oMinite = parseInt((hasTime-oHours*hh)/mm);
            if(oMinite==0){
                return result = oHours+approve.hour;
            }else{
                return result = oHours+approve.hour+oMinite+approve.minute;
            }
        }

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

     _approveTransmit(){
         let {message}=this.props;
         let showID=message.info.detail.id;
         let msgID=message.id;
         let approve = this.state.A_TREE;
         let reason = this.state.approveReason;
         approveTransmit(showID, approve, reason).then((res) =>{
             let retData = packRespnseData(res);
         if (checkRespnseSuccess(res)){
             this._closeModal();
             
             PubSub.publish(REFRESH_APPROVE, true);
             actionContainer.get().getChatApprovalDetail(showID,msgID);
         }else {
             alert(retData.Reason);
         }
     });
     }

    _getLayout(){
        return (
            <div className="approval-submit-box">
                <div className="head">
                    {this.state.SHOW_SELECT && <div className="approval-member-group">
                        <span>{this.state.SHOW_SELECT}</span>
                        { this.state.A_TREE.map((item, index)=>{
                            return (
                                <div className="chat-room-member"><AvatarComponent userName={item.name}></AvatarComponent><i className="icon-glyph-192 circle" onClick={this._removeUser.bind(this,this.state.A_TREE,item.name)}></i></div>);
                        })
}
                        <div className="chat-room-members-add icon-glyph-1" onClick={this.toggleUser.bind(this, SHOW_TREE.APPROVE_TREE, SHOW_TREE_RESULT.APPROVE)}></div>
                    </div>}
                    {this.state.SHOW_WORD && <p className="delapprove">{this.state.SHOW_WORD}</p>}
                    {this.state.SHOW_REASON && <textarea className="form-c" name="" id="" cols="2" rows="1" placeholder={this.state.SHOW_REASON} valueLink={this.linkState('approveReason')}></textarea>}
                </div>
                <div className="approval-submit-btn-group clearfix">
                    <div className="button cancle" onClick={::this._closeModal}>{approve.cancel}</div>
                    { this.state.approveResult == "TRANSMIT" && <div onClick={::this._approveTransmit.bind(this)} className="button comfirm-pass">{approve.confirm}</div>}
                    
                    { this.state.approveResult == "DENY" && <div onClick={::this._approveProcess.bind(this)} className="button comfirm-reject">{approve.confirm}</div>}
                    { this.state.approveResult == "DELETE" && <div onClick={::this._approveDelete.bind(this)} className="button comfirm-reject">{approve.confirm}</div>}
                    { this.state.approveResult == "CALL_BACK" && <div onClick={::this._approveProcess.bind(this)} className="button comfirm-reject">{approve.confirm}</div>}
                </div>
            </div>
        );
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



    _setTreeResult(show, result){
        let list = [];
        if (result.length > 0){
            list.push(result[0]);
        }
        this.setState({
            A_TREE:list
        });
    }

    toggleUser(tree, type){
        this.refs.approve.show();
    }
    _getDetail(){
        let {message}=this.props;
        let info=message.info;
        return(
            info.detail && <div className="chat-area-bubble-body" onClick={this._showDetail.bind(this,info.detail)} style={{cursor:'pointer'}}>
                <div className="attend-meeting-detail calendar-detail-line">
                                        {info.detail.start>0?<div className="meeting-detail-line">
                                            <i className=" toolbar icon-glyph-89"></i>
                                            <span>{approveShowDate(info.detail.start,info.detail.end, info.detail.isTimeslotAllday)}</span>
                                            <span className="time">&nbsp;{::this._showDate(info.detail.start,info.detail.end)}</span>
                                        </div>:null}
                                            <div className="meeting-detail-line"><i className="demo-icon icon-glyph-206"></i><span>{info.detail.tname}</span>&nbsp;&nbsp;{info.detail.fee>0?<span>{info.detail.fee}</span>:null}</div>
                                            {info.detail.backup!=0?<div className="meeting-detail-line"><pre>{info.detail.backup}</pre></div>:null}
                                    </div>
                                </div>
            )
    }
   
    }
Object.assign(ChatApproveContent.prototype, React.addons.LinkedStateMixin);
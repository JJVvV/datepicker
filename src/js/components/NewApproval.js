/**
 * Created by Tyrion on 2015/9/2.
 */
import React, { PropTypes , Component} from 'react/addons.js';
import classnames  from 'classnames';
import PubSub from 'pubsub-js';
import Pikaday from 'pikaday';
import {CHANGE_SLIDER, S, APPROVE_TYPE, TIME_ALLDAY, TIME_NOT_ALLDAY,REFRESH_APPROVE,SHOW_TREE,SHOW_TREE_RESULT  } from '../constants/launchr.js';
import ToggleBtn from './ToggleBtn.js';
import $ from '../lib/daterangepicker.js';
import moment from 'moment';
import {putApprove,postApprove,getTypeList, getFieldList} from '../services/approveService.js';
import {checkRespnseSuccess,packRespnseData} from '../services/msbService.js';
import SelectUserArea from './SelectUserArea.js'
import Datepicker from './calendar/Datepicker.js';
import FileUploadComponent from '../components/FileUploadComponent.js';
import {FadeModal as Modal} from './boron/Boron.js';
import AvatarComponent from '../components/AvatarComponent.js';
import {arrayRemove} from '../services/arrayService.js';
import {approve} from '../i18n/index.js';

export default class NewApproval extends Component{
    constructor(props) {
        super(props);
        let now = +new Date();
        let approve = props.approval || {};
        if (props.approval){
            approve.A_APPROVE =  this.transInfo(approve.A_APPROVE);
            approve.A_CC = this.transInfo(approve.A_CC);
        }

        this.state = {
            SHOW_ID:approve.SHOW_ID,
            A_TITLE: approve.A_TITLE,
            T_SHOW_ID: approve.T_SHOW_ID,
            A_APPROVE: approve.A_APPROVE || [],
            A_CC: approve.A_CC || [],
            A_BACKUP: approve.A_BACKUP,
            A_START_TIME: approve.A_START_TIME || now,
            A_END_TIME: approve.A_END_TIME || now,
            A_FEE: approve.A_FEE,
            A_IS_URGENT: approve.A_IS_URGENT,
            A_DEADLINE: approve.A_DEADLINE || now,
            IS_DEADLINE_ALL_DAY: approve.IS_DEADLINE_ALL_DAY== 1 || 0,
            IS_TIMESLOT_ALL_DAY: approve.IS_TIMESLOT_ALL_DAY== 1 || 0,
            A_TYPE: [],
            A_FIELD:[],
            D_TIMETYPE_ALL_DAY:"" || "MM-DD",
            D_TIMETYPE_NOT_ALL_DAY:"" || "MM-DD HH:mm",
            S_TIMETYPE_ALL_DAY:"" || "MM-DD",
            S_TIMETYPE_NOT_ALL_DAY:"" || "MM-DD HH:mm",
            E_TIMETYPE_ALL_DAY:"" || "MM-DD",
            E_TIMETYPE_NOT_ALL_DAY:"" || "MM-DD HH:mm",
            fileShowIds:approve.fileShowIds || []
        };
        this._getTypeList(approve.T_SHOW_ID);
    }



    render(){
        return(
            <div className="new-meeting-box">
                <div className="meeting-box-header">
                    {this.state.SHOW_ID ? <span>{approve.modify}</span> : <span>{approve.newapprove}</span>}
                    <a href="javascript:void(0)"><i className="icon-glyph-167" onClick={::this.props.onClose}></i></a>
                </div>

                <div className="meeting-box-body">
                    <div><input className="form-c " type="text" placeholder={approve.fill} valueLink={this.linkState('A_TITLE')} /></div>

                    <div className="attend-person-group">
                        <div className="approve-line-one">
                            <div className="attend-title pull-left  "><span>{approve.type}</span></div>
                            <div className="attend-meeting-detail">
                                {
                                    this.state.A_TYPE.map(function(item,index){
                                        if (index == 0 && !this.state.T_SHOW_ID) {
                                            this.state.T_SHOW_ID = item.SHOW_ID;
                                        }
                                        return <div className="approve-type-checkbox-box"><input type="radio" name="type1" value={item.SHOW_ID} defaultChecked={item.SHOW_ID == this.state.T_SHOW_ID} onChange={::this._typeChange} /><span>{item.T_NAME}</span></div>
                                    }.bind(this))
                                }
                            </div>
                        </div>
                    </div>
                    <SelectUserArea ref="approve"   selectKeys={::this.getSelectKeys(this.state.A_APPROVE)}   onCheck={::this._setTreeResult.bind(this, SHOW_TREE_RESULT.APPROVE)} />
                    <SelectUserArea ref="cc"  selectKeys={::this.getSelectKeys(this.state.A_CC)}   onCheck={::this._setTreeResult.bind(this, SHOW_TREE_RESULT.CC)}  />
                    <div className="attend-person-group">
                        <div className="attend-person-line">
                            <span className="attend-title">{approve.approver}</span>

                            <div className="attend-meeting-avator">
                                { this.state.A_APPROVE.map((item, index)=>{
                                    return (
                                    <div className="chat-room-member"><AvatarComponent userName={item.name}></AvatarComponent>{ this.props.approval == null && <i className="icon-glyph-192 circle" onClick={this._removeUser.bind(this,this.state.A_APPROVE,item.name, "approve")}></i>}</div>);
                                })
                                }
                                {!this.state.SHOW_ID  &&
                                <div className="chat-room-members-add icon-glyph-1" onClick={::this.toggleUser.bind(this, SHOW_TREE.APPROVE_TREE, SHOW_TREE_RESULT.APPROVE)}></div>}
                            </div>
                        </div>
                        {
                            this.state.A_FIELD.indexOf(APPROVE_TYPE.CC) == -1 ||
                            <div className="attend-person-line">
                                <span className="attend-title">{approve.cc}</span>

                                <div className="attend-meeting-avator">
                                    { this.state.A_CC.map((item, index)=>{
                                        return (
                                            <div className="chat-room-member"><AvatarComponent userName={item.name}></AvatarComponent><i className="icon-glyph-192 circle" onClick={this._removeUser.bind(this,this.state.A_CC,item.name, "cc")}></i></div>);
                                    })}
                                    <div className="chat-room-members-add icon-glyph-1" onClick={::this.toggleUser.bind(this, SHOW_TREE.CC_TREE, SHOW_TREE_RESULT.CC)}></div>

                                </div>
                            </div>
                        }
                    </div>

                    {
                        ((this.state.A_FIELD.length <= 5 && this.state.A_FIELD.indexOf(APPROVE_TYPE.CC) != -1) || (this.state.A_FIELD.length <= 4 && this.state.A_FIELD.indexOf(APPROVE_TYPE.CC) == -1)) ||

                        <div className="attend-person-group approval-gap" >

                            {
                                this.state.A_FIELD.indexOf(APPROVE_TYPE.APPROVEENDTIME) == -1 ||
                                <div className="approve-line">
                                    <div className="attend-title pull-left height-text"><span>{approve.approve}{approve.period}</span></div>
                                    <div className="attend-meeting-detail">
                                        <div className="input-group-wrapper">
                                            <div className="form-feedback left-item ">
                                                    
                                                    <Datepicker dateFormatAllDay={this.state. D_TIMETYPE_ALL_DAY} dateFormatNotAllDay={this.state. D_TIMETYPE_NOT_ALL_DAY} allDay={this.state.IS_DEADLINE_ALL_DAY == 1} onChange={::this._getDeadline} date={new Date(this.state.A_DEADLINE)} className="form-c"/>
                                                    <span className="feedback  icon-glyph-89"></span>
                                                
                                               
                                            </div>
                                        </div> 
                                            <div className="new-event-switch pull-right approval-switch-day">
                                                <span>{approve.allday}</span>

                                                <ToggleBtn on={this.state.IS_DEADLINE_ALL_DAY} style={{float: "right"}} className="demo-icon" onToggleBtnChange={::this._onToggleDeadlineAllday} />
                                            </div>
                                        </div>
                                    </div>
                            }

                            {
                                this.state.A_FIELD.indexOf(APPROVE_TYPE.TIMESLOT) == -1 ||
                                <div className="approve-line">
                                    <div className="attend-title pull-left height-text"><span>{approve.time}</span></div>
                                    <div className="attend-meeting-detail">
                                        <div className="input-group-wrapper" style={{width:'98%'}}>
                                            <div className="input-group half-group">
                                                <div className="form-feedback left-item ">
                                                    <Datepicker dateFormatAllDay={this.state. S_TIMETYPE_ALL_DAY} dateFormatNotAllDay={this.state. S_TIMETYPE_NOT_ALL_DAY} allDay={this.state.IS_TIMESLOT_ALL_DAY == 1} onChange={::this._getStartTime} date={new Date(this.state.A_START_TIME)} className="form-c" />
                                                    <span className="feedback  icon-glyph-89"></span>                                                                                               
                                                </div>
                                                
                                                
                                            </div>
                                            <div className="input-group half-group">
                                                <div className="form-feedback left-item ">
                                                    <Datepicker dateFormatAllDay={this.state. E_TIMETYPE_ALL_DAY} dateFormatNotAllDay={this.state.E_TIMETYPE_NOT_ALL_DAY} allDay={this.state.IS_TIMESLOT_ALL_DAY == 1} onChange={::this._getEndTime} date={new Date(this.state.A_END_TIME)} className="form-c" />
                                                    <span className="feedback  icon-glyph-89"></span>                                                                                               
                                                </div>                                                
                                            </div>
                                           
                                        </div> 
                                        <div className="new-event-switch approval-switch-day">
                                                <span>{approve.allday}</span>

                                                <ToggleBtn on={this.state.IS_TIMESLOT_ALL_DAY} style={{float: "right"}} className="demo-icon" onToggleBtnChange={::this._onToggleTimeslotAllday} />
                                            </div>
                                        </div>
                                    </div>
                            }
                            {
                                this.state.A_FIELD.indexOf(APPROVE_TYPE.FEE) == -1 ||
                                <div className="approve-line">
                                    <div className="attend-title pull-left height-text"><span>{approve.money}</span></div>
                                    <div className="attend-meeting-detail">
                                        <div className="meeting-detail-line">
                                            <div className="input-group-wrapper">
                                                <div className="input-group">
                                                    <div className="input-group-addon">
                                                        <i>￥</i>
                                                    </div>
                                                    <input className="form-c place-input" type="text" valueLink={this.linkState('A_FEE')}/>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            }

                        </div>
                    }
                            <div>
                                <div className="new-approve-importance-title"><span>{approve.urgent}</span></div>
                                <div className="new-event-time-group">
                                    <div className="new-event-time-line new-approve-icon-switch ">                                      
                                         <ToggleBtn on={this.state.A_IS_URGENT} style={{float: "left"}} className="demo-icon  new-event-time-line-header emergency-switch" onToggleBtnChange={::this._onToggleImportant} />
                                    </div>
                                </div>
                            </div>
                            <textarea className="form-c" name="" id="" cols="30" rows="2" placeholder={approve.remark} valueLink={this.linkState('A_BACKUP')}></textarea>

                            {<FileUploadComponent
                                appShowID={'ADWpPoQw85ULjnQk'}
                                addFile={this._addFile.bind(this)}
                                removeFile={this._removeFile.bind(this)}
                                rmShowID={this.state.SHOW_ID}
                                loadAttachments={this._loadAttachments.bind(this)}
                                ></FileUploadComponent>}

                        </div>


                        <div className="meeting-box-footer">
                            <span className="btn-comfirm" onClick={::this._onConfirm}>{approve.confirm}</span>
                            <span className="btn-cancle" onClick={::this.props.onClose}>{approve.cancel}</span>
                        </div>
                    </div>
        )

}

    getSelectKeys(list){
        var aa =  list.map((item, index)=>{
            return item.name;
        });
        return aa;
    }


    transInfo(list){
        let user = [];
        list.map((item, index)=>{
            let u = {};
            u.name = item.USER;
            u.trueName = item.USER_NAME;
            user.push(u);
        })
        return user;
    }


    _removeUser(users, user, type) {
        let index= _.findIndex(users,function(item){
            return item.name==user;
        })
        users.splice(index,1);
        if (type == "approve"){
            this.setState({
               A_APPROVE:users
            });
        }else{
            this.setState({
                A_CC:users
            });
        }
    }

    _setTreeResult(show, result){

        var result = $.extend([], result);
       
        if (show == SHOW_TREE_RESULT.APPROVE){
            this.setState({
                A_APPROVE:result
            });
        }else if (show == SHOW_TREE_RESULT.CC){
            this.setState({
                A_CC:result
            });
        }
    }


    toggleUser(tree, type){
        if (tree == SHOW_TREE.APPROVE_TREE){
            this.refs.approve.show();
        }else if (tree == SHOW_TREE.CC_TREE){
            this.refs.cc.show();
        }
    }


        _onConfirm() {
            
        if (this.state.SHOW_ID){
            
            postApprove(this.state).then((res) => {
                let retData = packRespnseData(res);
                if (checkRespnseSuccess(res)) {
                  this.props.onClose();
                    PubSub.publish(REFRESH_APPROVE, true);
                } else {
                    alert(retData.Reason);
                }
            });
        }else{
            putApprove(this.state).then((res) => {
                let retData = packRespnseData(res);
                if (checkRespnseSuccess(res)) {
                    this.props.onClose();
                    PubSub.publish(REFRESH_APPROVE, res);
                } else {
                    alert(retData.Reason);
                }
            });
        }
    }



    _addFile(fileShowID){
        let fileIds=this.state.fileShowIds.map(function(item,index){
            return item;
        });
        fileIds.push(fileShowID);
        this.setState({
            fileShowIds:fileIds
        });
        console.log(this.state.fileShowIds);
    }

    _removeFile(fileShowID){
        this.setState({
            fileShowIds:arrayRemove(this.state.fileShowIds,fileShowID)
        });
        console.log(this.state.fileShowIds);
    }
    _loadAttachments(fileShowIds){
        this.setState({
            fileShowIds:fileShowIds
        });
    }


    _getDeadline(e){
        //alert('deadline' + e.valueOf());
        let atype;
        let ltype;
        let aa=new Date();
        let bb=new Date(e);
        if(aa.getFullYear()!=bb.getFullYear()){
            atype = "YY-MM-DD";
            ltype = "YY-MM-DD HH:mm";
        }else{
            atype = "MM-DD";
            ltype = "MM-DD HH:mm";
        }
        this.setState({
            A_DEADLINE:e.valueOf(),
            D_TIMETYPE_ALL_DAY:atype,
            D_TIMETYPE_NOT_ALL_DAY:ltype
        });
    }


    _getStartTime(e){
        //alert('starttime' +e.valueOf());
        let atype;
        let ltype;
        let aa=new Date();
        let bb=new Date(e);
        if(aa.getFullYear()!=bb.getFullYear()){
            atype = "YY-MM-DD";
            ltype = "YY-MM-DD HH:mm";
        }else{
            atype = "MM-DD";
            ltype = "MM-DD HH:mm";
        }
        this.setState({
            A_START_TIME:e.valueOf(),
            S_TIMETYPE_ALL_DAY:atype,
            S_TIMETYPE_NOT_ALL_DAY:ltype
        });
    }


    _getEndTime(e){
        //alert('endtime' + e.valueOf());
        let atype;
        let ltype;
        let aa=new Date();
        let bb=new Date(e);
        if(aa.getFullYear()!=bb.getFullYear()){
            atype = "YY-MM-DD";
            ltype = "YY-MM-DD HH:mm";
        }else{
            atype = "MM-DD";
            ltype = "MM-DD HH:mm";
        }
        this.setState({
            A_END_TIME:e.valueOf(),
            E_TIMETYPE_ALL_DAY:atype,
            E_TIMETYPE_NOT_ALL_DAY:ltype
        });
    }


    _getTypeList(showid){
        getTypeList().then((res) => {
            let retData = packRespnseData(res);
            if (checkRespnseSuccess(res)) {
                this.setState({"A_TYPE": retData.Data});
                let id = showid ? showid : this.state.A_TYPE[0].SHOW_ID;
                this._getFieldList(id);
            } else {
                alert(retData.Reason);
            }
        });
    }


    _getFieldList(showid){
        getFieldList(showid).then((res) => {
            let retData = packRespnseData(res);
            if (checkRespnseSuccess(res)) {
                var field = [];
                retData.Data.forEach((item, index) => {
                    field.push(item.F_KEY);
                });
                this.setState({"A_FIELD": field});
            } else {
                alert(retData.Reason);
            }
        });
    }



    _typeChange(e){
        this.setState({
            T_SHOW_ID: e.target.value
        });
        this._getFieldList(e.target.value);
    }

    _onToggleDeadlineAllday(allday) {
        this.setState({
            IS_DEADLINE_ALL_DAY:allday ?  1:0
            });
    }

    _onToggleTimeslotAllday(allday) {
        this.setState({
            IS_TIMESLOT_ALL_DAY:allday ?  1:0
        });
    }

    _onToggleImportant(A_IS_URGENT) {
        this.setState({
            A_IS_URGENT:A_IS_URGENT ?  1:0
        });
    }


    
}

Object.assign(NewApproval.prototype, React.addons.LinkedStateMixin);
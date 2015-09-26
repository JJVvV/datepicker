/**
 * Created by Administrator on 2015/7/10.
 */

import React, { PropTypes , Component} from 'react/addons.js';
import classnames  from 'classnames';
import PubSub from 'pubsub-js';
import request from 'reqwest';
import {getMeetingDetail,deleteMeeting,postDeleteOneEvent,getTimeReversalDetail,postDeleteAllEvent,handleMeeting} from '../services/meetingService.js';
import {checkRespnseSuccess,packRespnseData} from '../services/msbService.js';
import {REFRESH_EVENT, CHANGE_SLIDER, S,MESSAGE_APP_TYPE} from '../constants/launchr.js';
import moment from 'moment';
import $ from 'jquery';
import {sliderShow} from '../services/slider.js';
import reduxContainer from '../services/reduxContainer.js';
import actionContainer from '../services/actionContainer.js';
import Comment from '../components/Comment.js';
import AvatarComponent from './AvatarComponent.js';
import {FadeModal as Modal} from './boron/Boron.js';

import {schedule} from '../i18n/index.js'

export default class MeetingDetail extends Component{

  constructor(props) {
      super(props);

      this.state = {
          title: '',
          must: [
              {
                  avator: './public/img/jinmuyan.jpg',
                  id: 0
              }
          ],
          mustNames: [],
          optional: [
              {
                  avator: './public/img/jinmuyan.jpg',
                  id: 0
              },
              {
                  avator: './public/img/zhangqiuyan.jpg',
                  id: 1
              }
          ],
          optionalNames: [],
          content: '',
          currentRoomName: '',
          currentRoom: '',
          startTime: '',
          endTime: '',
          showId: '',
          note: '',
          isExist: false,
          start: '',
          end: '',
          repeatCycle: '',
          remindTimer: '',
          create_user: '',
          users: 'bennetWang●allenFeng●jerryLuo',
          s_startTime: '',
          reStartType: '',
          editType: '',
          showDetail: false,
          showDelete: false,
          mustAttend: [],
          optionalAttend: [],
          lngx: '',
          lngy: '',
          rejectReason: ''
      }
  }

  componentDidMount(){
   this._requestDetail(this.props.meeting);

  }

  componentWillReceiveProps(nextProps) {
      if (nextProps.meeting != this.props.meeting) {
          this._requestDetail(nextProps.meeting);
      }
  }


  render() {
    let currentname=reduxContainer.get().getState().userinfo.me.loginName;
    let isRepeatMeeting=this.state.create_user===currentname;
    let reStart=this.state.reStartType;

    const {title, content} = this.state;


    let touUsers=this.state.must.map(function(item,index){
        return item.NAME;
    });
    let toUserNames=this.state.mustNames.map(function(item,index){
      return item.NAME;
    });
    return (
        <div className="new-meeting-box">
          <div className="meeting-detail-header">
            <span>{schedule.MeetingDetail}</span>
            <i className="icon-glyph-167 pull-right" onClick={::this.props.onClose}></i>
          </div>

          <div className="meeting-box-body">
            <p className="meeting-detail-title">{title}</p>

            <div className="meeting-place-detail-line">
              <div className="meeting-detail-group" >
                {getTimeReversalDetail(this.state.start,this.state.end)}
                <div className="repeat-line">
                </div>
                <div className="meeting-detail-line" >
                  <i className=" toolbar icon-glyph-207"></i>
                  <span>{this.state.currentRoomName||this.state.outMeetingRoom} </span>
                </div>
              </div>



            </div>
            <div className="attend-person-group">
              <div className="attend-person-line">
                <span className="attend-title">{schedule.MustAttendPerson}</span>
                <div className="attend-meeting-avator">
                  {
                    this.state.must&&this.state.mustNames.length&&this.state.must.map(function(item,index){
                        if(item.ISJOIN==0)
                        {
                          return ( <div className="chat-room-member inactive"> <AvatarComponent userName={item.NAME} trueName={this.state.mustNames[index].NAME} /></div>);
                        }
                        else if(item.ISJOIN==1)
                        {
                          return ( <div className="chat-room-member"> <AvatarComponent userName={item.NAME} trueName={this.state.mustNames[index].NAME}/><i className="demo-icon icon-glyph-195"></i></div>);
                        }
                        else
                        {
                          return ( <div className="chat-room-member"> <AvatarComponent userName={item.NAME} trueName={this.state.mustNames[index].NAME}/></div>);
                        }
                      }.bind(this))
                  }
                </div>
              </div>
              <div className="attend-person-line">
                <span className="attend-title">{schedule.NotMustAttendPerson}</span>
                <div className="attend-meeting-avator">
                  {
                    this.state.optional&&this.state.optionalNames.length&&this.state.optional.map(function(item,index){
                      if(item.ISJOIN==0)
                      {
                        return ( <div className="chat-room-member inactive"> <AvatarComponent userName={item.NAME} trueName={this.state.optionalNames[index].NAME} /></div>);
                      }
                      else if(item.ISJOIN==1)
                      {
                        return ( <div className="chat-room-member"> <AvatarComponent userName={item.NAME} trueName={this.state.optionalNames[index].NAME} /><i className="demo-icon icon-glyph-195"></i></div>);
                      }
                      else
                      {
                        return ( <div className="chat-room-member"> <AvatarComponent userName={item.NAME} trueName={this.state.optionalNames[index].NAME} /></div>);
                      }
                    }.bind(this))
                  }
                </div>
              </div>
            </div>


            <p className="meeting-detail-topic">{content}</p>

            {this.state.isExist&&(<div className="attend-person-group">
              <div className="attend-meeting-btn-group">
                <a className="btn btn-default btn-info" onClick={this._handleMeeting.bind(this, 1)}>{schedule.Attend}</a>
                <a className="btn btn-default btn-warning" onClick={::this._showModal}>{schedule.Reject}</a>
              </div>

                <Modal ref="modal">
                    <div className="approval-submit-box">
                        <div className="head">
                            <textarea className="form-c" name="" id="" cols="2" rows="1" placeholder="拒绝理由" valueLink={this.linkState('rejectReason')}></textarea>
                        </div>
                        <div className="approval-submit-btn-group clearfix">
                            <div className="button cancle" onClick={::this._closeModal}>取消</div>
                   <div onClick={this._handleMeeting.bind(this, 0)} className="button comfirm-reject">确认</div>
                        </div>
                    </div>
                </Modal>

            </div>)}

            <Comment
                appShowID={"l6b3YdE9LzTnmrl7"}
                rmShowID={this.props.meeting.id}
                toUsers={touUsers}
                toUserNames={toUserNames}
                Title={this.state.title}
                messageAppType={MESSAGE_APP_TYPE.MEETING}
                ></Comment>

          </div>





          {this._showControlDiv()}

        </div>

    )
  }

  _requestDetail(meeting){
    var $this=this;
    getMeetingDetail(meeting).then(res=>{
      if(res.Body.response.IsSuccess)
      {
        let diffTime=moment(res.Body.response.Data.M_END).diff(moment(res.Body.response.Data.M_START),'minutes');
        let endtime=moment(meeting.startTime).add(diffTime,'minutes').valueOf();
      $this.setState({
        title:res.Body.response.Data.M_TITLE,
        currentRoomName:res.Body.response.Data.R_SHOW_NAME,
        must:res.Body.response.Data.REQUIRE_JOIN,
        mustNames:res.Body.response.Data.REQUIRE_JOIN_NAME,
        optional:res.Body.response.Data.JOIN,
        optionalNames:res.Body.response.Data.JOIN_NAME,
        content:res.Body.response.Data.M_CONTENT,
        startTime:moment((res.Body.response.Data.M_START)).format("YYYY-MM-DD HH:mm"),
        endTime:moment((res.Body.response.Data.M_END)).format("YYYY-MM-DD HH:mm"),
        showId:res.Body.response.Data.SHOW_ID,
        currentRoom:res.Body.response.Data.R_SHOW_ID,
        start:meeting.startTime,
        end:endtime,
        repeatCycle:meeting.repeatType,
        remindTimer:res.Body.response.Data.M_REMIND_TYPE,
        note:res.Body.response.Data.M_CONTENT,
        create_user:res.Body.response.Data.CREATE_USER,
        s_startTime:meeting.startTime,
        reStartType:meeting.repeatType,
        editType:0,
        outMeetingRoom:res.Body.response.Data.M_EXTERNAL,
        isExist:$this._isJoinMeeting(res.Body.response.Data.REQUIRE_JOIN)||$this._isJoinMeeting(res.Body.response.Data.JOIN),
        mustAttend:this._initMembers(res.Body.response.Data.REQUIRE_JOIN,res.Body.response.Data.REQUIRE_JOIN_NAME),
        optionalAttend:this._initMembers(res.Body.response.Data.JOIN,res.Body.response.Data.JOIN_NAME),
        lngx:res.Body.response.Data.M_LNGX,
        lngy:res.Body.response.Data.M_LNGY
      })
      }
    });
  }

  _showControlDiv() {

    let currentname=reduxContainer.get().getState().userinfo.me.loginName;
    let reStart = this.state.reStartType;
    if (currentname==this.state.create_user) {
      if (reStart !== 0) {
        return (<div className="meeting-detail-footer-btn">
          <a><i className=" toolbar icon-glyph-71"></i></a>

          <a onClick={::this._showDetail}>
            <i className=" toolbar icon-glyph-77"></i>
            {this.state.showDetail&&(<ul className="dropdown-list bottom" style={{bottom:'86%'}}>
              <li className="dropdown-item">
                <a onClick={this._detailOne.bind(this,this.state)}>
                  <span>{schedule.EditCurrentMeeting}</span>
                </a>
              </li>
              <li className="dropdown-item">
                <a onClick={this._detailAll.bind(this,this.state)}>
                  <span>{schedule.EditAllMeeting}</span>
                </a>
              </li>
            </ul>)}
          </a>
          <a onClick={::this._showDelete}>
            <i className=" demo-icon icon-trash-empty"></i>
            {this.state.showDelete&&(<ul className="dropdown-list bottom" style={{bottom:'86%'}}>
              <li className="dropdown-item">
                <a onClick={this._deleteOne.bind(this,this.props.meeting)}>
                  <span>{schedule.DeleteCurrentMeeting}</span>
                </a>
              </li>
              <li className="dropdown-item">
                <a onClick={this._deleteAll.bind(this,this.props.meeting)}>
                  <span>{schedule.DeleteAllMeeting}</span>
                </a>
              </li>
            </ul>)}

          </a>
        </div>);
      }
      else
        {
          return (<div className="meeting-detail-footer-btn">
            <a><i className=" toolbar icon-glyph-71"></i></a>

            <a onClick={this._detail.bind(this,this.state)}><i className=" toolbar icon-glyph-77"></i></a>
            <a onClick={this._deleteOne.bind(this,this.props.meeting)}><i className=" demo-icon icon-trash-empty"></i></a>
          </div>);
        }
      }
    else
    {
      return "";
    }
  }

  _isJoinMeeting(must)
  {
    let currentname=reduxContainer.get().getState().userinfo.me.loginName;
    let isExit=false;
     must&&must.map(function (item, index) {
        if (item.NAME == currentname) {
          if (item.ISJOIN == 2) {
            isExit = true;
          }
        }
      })
    return isExit;
  }
  _geMemberList(memberList, type){
    return  memberList&&memberList.map((member) => {
      return (
          <div className="chat-room-member">
            <img src={member.avator} alt="" width="40" height="40" />
            <i className="icon-glyph-192 circle" onClick={this._removeMember.bind(this, member.id, type)}></i>
          </div>
      );
    });
  }

  _removeMember(id, type){ //type为出席人员类型：必须出席或者非必须出席
    let memberList = this.state[type];
    if(!memberList) return;

    memberList = memberList.filter((member) =>(
      member.id !== id
    ));
    this.setState({
      [type]: memberList
    });
  }


  _onConfirm(){
    this.props.onClose();
  }

  _openMeetingFilter(){
    PubSub.publish(CHANGE_SLIDER, {type: S.MEETING_FILTER, meeting:this.state});
  }

  _takePartIn(){
    let data={showId:this.state.showId,isAgree:1,reason:''}
    //actionContainer.get().handleChatMeeting(data,this.props.meeting._closeModal);
      //handleMeeting(data);
    this._requestDetail(this.props.meeting);
  }

  _handleMeeting(isAgree) {
      let data = {
          showId: this.state.showId,
          isAgree: isAgree,
          reason: this.state.rejectReason
      };
      handleMeeting(data).then((res)=> {
          let retData = packRespnseData(res);
          if (checkRespnseSuccess(res)) {
              if (this.props.meeting.msgID) {
                  actionContainer.get().handleChatMeeting(data, this.props.meeting.msgID);
              }
              this._closeModal();
              this._requestDetail(this.props.meeting);
          } else {
              alert(retData.Reason);
          }
      });
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

  _showDetail()
  {
    this.setState({showDetail:!this.state.showDetail,showDelete:false});
  }

  _showDelete()
  {
    this.setState({showDelete:!this.state.showDelete,showDetail:false});
  }

  //编辑不重复会议
  _detail(data)
  {
    sliderShow({type:S.MEETING, meeting:data});
  }

  //编辑此条重复会议
  _detailOne(data)
  {
    data = Object.assign({},data,{editType:0});
    sliderShow({type:S.MEETING, meeting:data});
  }

  //编辑所有重复会议
  _detailAll(data)
  {
    data = Object.assign({},data,{editType:1});
    sliderShow({type:S.MEETING, meeting:data});
  }

  //删除此条会议
  _deleteOne(data)
  {
    let deleteData={showId:data.id,initialStartTime:data.startTime};
    deleteData=Object.assign({},deleteData,this.state);
    this.props.onClose();
    postDeleteOneEvent(deleteData).then((data) => {

    });

  }

  //删除所有会议
  _deleteAll(data)
  {
    let deleteData={showId:data.id,initialStartTime:data.startTime};
    deleteData=Object.assign({},deleteData,this.state);
    this.props.onClose();
    postDeleteAllEvent(deleteData);
  }

  //初始化参与人
  _initMembers(users,userNames) {
    users = users || [];
    userNames = userNames || [];

    return users.map((item, index)=> {
       return {
        name: users[index].NAME || '',
        trueName: userNames[index].NAME || ''
      }
    });
  }

}

Object.assign(MeetingDetail.prototype, React.addons.LinkedStateMixin);
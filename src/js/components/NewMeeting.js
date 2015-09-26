/**
 * Created by Administrator on 2015/7/10.
 */

import React, { PropTypes , Component} from 'react/addons.js';
import classnames  from 'classnames';
import PubSub from 'pubsub-js';

import {postNewMeeting,timeReversal,postEditOneMeeting,postEditAllMeeting} from '../services/meetingService.js';
import {REFRESH_EVENT, CHANGE_SLIDER, S,SHOW_MUST_TREE,SHOW_OPTIONAL_TREE,SHOW_TREE_RESULT,SHOW_TREE} from '../constants/launchr.js';
import SelectUserArea from './SelectUserArea.js';
import $ from 'jquery';
import reduxContainer from '../services/reduxContainer.js';
import AvatarComponent from './AvatarComponent.js';

import {schedule} from '../i18n/index.js'

export default class NewMeeting extends Component{

  constructor(props){
    super();

    this.state = props.meeting || {
      title:'',
      must:[],
      optional:[],
      meetingRoom:'',
      chosenTimer:'',
      currentRoom:'',
      repeatCycle:0,
      remindTimer:0,
      note: '',
      showId:'',
      start:'',
      end:'',
      users:'bennetWang●allenFeng●jerryLuo',
      outMeetingRoom:'',
      currentRoomName:'',
      reStartType:0,
      editType:'',
      s_startTime:'',
      mustAttend:[{name:reduxContainer.get().getState().userinfo.me.loginName,trueName:reduxContainer.get().getState().userinfo.me.name}],
      optionalAttend:[],
      lngx:'',
      lngy:''
    }
  }

  render() {
    let meetingRoom=this.state.currentRoomName||this.state.outMeetingRoom;
    //let mustMemberList = this._geMemberList(this.state.must, 'must');
    //let optionalList = this._geMemberList(this.state.optional, 'optional');
    return (
        <div className="new-meeting-box">
          <div className="meeting-box-header">
            <span>{this.state.showId!=''?schedule.UpdateMeeting:schedule.NewMeeting}</span>
            <a href="javascript:void(0)" onClick={::this.props.onClose}><i className="icon-glyph-167"></i></a>
          </div>

          <SelectUserArea ref="must" multiple={true} selectKeys={::this.getSelectKeys(this.state.mustAttend)} onCheck={this._setTreeResult.bind(this)} />
          <div className="meeting-box-body">
            <div><input className="form-c " type="text" placeholder={schedule.FillMeetingTitle}  valueLink={this.linkState('title')} /></div>
            <div className="attend-person-group">
              <div className="attend-person-line">


                    <span className="attend-title">{schedule.MustAttendPerson}</span>


                    <div className="attend-meeting-avator">
                      {this.state.mustAttend.map((item,index)=>{
                        return  <div className="chat-room-member">
                          <AvatarComponent userName={item.name} trueName={item.trueName} /><i className="icon-glyph-192 circle" onClick={this._removeUser.bind(this,this.state.mustAttend,item.name)}></i>
                        </div>
                      })}
                      <div className="chat-room-members-add icon-glyph-1" onClick={this._toggleUser.bind(this,SHOW_TREE.MUST)}></div>
                    </div>


              </div>
              <div className="attend-person-line">


                <span className="attend-title">{schedule.NotMustAttendPerson}</span>


                    <div className="attend-meeting-avator">
                      {this.state.optionalAttend.map((item,index)=>{
                        return  <div className="chat-room-member">
                          <AvatarComponent userName={item.name} trueName={item.trueName} /><i className="icon-glyph-192 circle" onClick={this._removeUser.bind(this,this.state.optionalAttend,item.name)}></i>
                        </div>
                      })}
                      <div className="chat-room-members-add icon-glyph-1" onClick={this._toggleUser.bind(this,SHOW_TREE.OPTIONAL)}></div>
                    </div>


                <SelectUserArea ref="optional" multiple={true} selectKeys={::this.getSelectKeys(this.state.optionalAttend)}  onCheck={this._setOptionalTreeResult.bind(this)} />
               </div>
             </div>
                    {meetingRoom==''&&(<div className="attend-person-group">
                      <div className="attend-person-line meeting-line">
                        <span className="meeting-title">{schedule.MeetingTimeAndPlace}</span>
                        <a className="btn btn-default btn-info" onClick={::this._openMeetingFilter}>{schedule.EnterTheScreening}</a>
                      </div>
                    </div>)}
                    {meetingRoom!=''&&(
                        <div className="attend-person-group">
                          <div className="meeting-line">
                            <div className="attend-title pull-left"><span>{schedule.MeetingTimeAndPlace}</span>
                              <div className="attend-detail" onClick={::this._openMeetingFilter}>{schedule.Reselect}</div>
                            </div>
                            <div className="attend-meeting-detail">
                              {this._timeSpan(this.state.start,this.state.end)}
                              <div className="meeting-detail-line">
                                <i className=" toolbar icon-glyph-207 "></i>
                                <span>{meetingRoom}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <select className="form-c" name="" defaultValue={this.state.repeatCycle} valueLink={this.linkState('repeatCycle')}>
                        <option value="0">{schedule.RepetitionInterval}</option>
                        <option value="1">{schedule.ByTheDay}</option>
                        <option value="2">{schedule.ByTheWeek}</option>
                        <option value="3">{schedule.ByTheMonth}</option>
                        <option value="4">{schedule.ByTheYear}</option>
                      </select>
                      <select className="form-c pull-right" name="" defaultValue={this.state.remindTimer} valueLink={this.linkState('remindTimer')}>
                        <option value="0">{schedule.RemindTime}</option>
                        <option value="100">{schedule.beginTime}</option>
                        <option value="101">{schedule.FiveMinutesAgo}</option>
                        <option value="102">{schedule.FifteenMinutesAgo}</option>
                        <option value="103">{schedule.ThirtyMinutesAgo}</option>
                        <option value="104">{schedule.OneHourAgo}</option>
                        <option value="105">{schedule.TwoHoursAgo}</option>
                        <option value="106">{schedule.OneDayAgo}</option>
                        <option value="107">{schedule.TwoDaysAgo}</option>
                        <option value="108">{schedule.OneWeekAgo}</option>
                      </select>
                      <textarea className="form-c" name="" cols="30" rows="2" placeholder={schedule.MeetingComment} valueLink={this.linkState('note')}></textarea>

                  </div>


          <div className="meeting-box-footer">
            <span className="btn-comfirm" onClick={::this._onConfirm}>{schedule.Confirm}</span>
            <span className="btn-cancle" onClick={::this.props.onClose}>{schedule.Cancel}</span>
          </div>
                </div>
    )
  }

  //_geMemberList(memberList, type){
  //  return memberList&&memberList.map((member) => {
  //    return (
  //        <div className="chat-room-member">
  //          <img src={member.avator} alt="" width="40" height="40" />
  //          <i className="icon-glyph-192 circle" onClick={this._removeMember.bind(this, member.id, type)}></i>
  //        </div>
  //    );
  //  });
  //}

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
    if(this.state.reStartType==0)
    {
      postNewMeeting(this.state).then((res) => {
        if(res.Body.response.IsSuccess)
        {
          this.props.onClose();
          PubSub.publish(REFRESH_EVENT, res);
        }
        else
        {
          alert(res.Body.response.Reason);
        }
      });
    }
    else
    {
      if(this.state.editType==0)
      {
        this.props.onClose();
        postEditOneMeeting(this.state).then((res)=>{
        });
      }
      else
      {
        this.props.onClose();
        postEditAllMeeting(this.state);
      }
    }
  }

  _openMeetingFilter(){
    PubSub.publish(CHANGE_SLIDER, {type: S.MEETING_FILTER, meeting:this.state});
  }

  _timeSpan(start,end)
  {
    let data=timeReversal(start,end);
    return (<div className="meeting-detail-line">
      <i className=" toolbar icon-glyph-89"></i>
      <span>{data.currentDate}</span>
      <span className="time">&nbsp;{data.intervalTime}{schedule.Hours}</span>
    </div>)
  }

  //选人控件
  _toggleUser(tree){
    if (tree == SHOW_TREE.MUST){
      this.refs.must.show();
    }else if (tree == SHOW_TREE.OPTIONAL){
      this.refs.optional.show();
    }
  }

  //获取返回值
  _setTreeResult(result) {
    var result = $.extend([], result),
        data=[];
    $.each(result,function(index,item){
      data.push({
        name:item.name,
        trueName:item.trueName,
        image:item.url
      })
    });
    this.setState({
      mustAttend: data
    });
  }

  //获取返回值
  _setOptionalTreeResult(result) {
    var result = $.extend([], result),
        data=[];
    $.each(result,function(index,item){
      data.push({
        name:item.name,
        trueName:item.trueName,
        image:item.url
      })
    });
    this.setState({
      optionalAttend: data
    });
  }

  getSelectKeys(list){
    return list.map((item, index)=>{
      return item.name;
    });
  }

  _removeUser(users, user) {
    let index= _.findIndex(users,function(item){
      return item.name==user;
    })

    users.splice(index,1);

    this.setState({attendMembers:users});
  }

}


Object.assign(NewMeeting.prototype, React.addons.LinkedStateMixin);
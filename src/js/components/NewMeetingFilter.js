/**
 * Created by Administrator on 2015/7/10.
 */

import React, { PropTypes , Component} from 'react/addons.js';
import classnames  from 'classnames';
import PubSub from 'pubsub-js';
import moment from 'moment';

import {getMeetingRooms,getUnfreeRoomList, getOccupiedTimeList,getScheduleForMeeting,timeReversal} from '../services/meetingService.js';
import fullcalendar from '../lib/fullcalendar';
//import ModalMeetingOccupied from './modal/ModalMeetingOccupied.js';
import {FadeModal as Modal} from './boron/Boron.js';

import {REFRESH_EVENT, CHANGE_SLIDER, S, NEWMEETING_ID} from '../constants/launchr.js';
import $ from '../lib/daterangepicker.js';
import MeetingTimeDetail from './MeetingTimeDetail.js';
import jquery from 'jquery';
import GoogleMapComponent from '../components/GoogleMapComponent.js';
import AvatarComponent from './AvatarComponent.js';

import {schedule} from '../i18n/index.js'

let meeting;
let $fullcalendar;
let cachedMeeting;
let timerIsOverlap = (day, dayList) => {
    if(!(day instanceof Date)) return false;
    let timer = +day;
    return dayList.some((timerItem) => {
        return timerItem.startTime == timer;
    });
}
let getTimeDetail = (start, end) => {

    let day = moment(start).format('dddd');

    return {
        start:'', end:'', date:'', day:'', hour:''
    }
}
export default class NewMeetingFilter extends Component{

  constructor(props){
    super();
    meeting = props.meeting;
    this.state={
      showMeetingRoom:true,
      meetingRoomList:[],
      currentRoom:'',
      currentRoomName:'',
      startTime:'',
      endTime:'',
      timeStartStr:'',
      timeEndStr:'',
      showId:'',
      outer:'',
      temporaryMeetingRoomList:[],
      detail:{start:'', end:'', date:'', day:'', hour:''},
      schedule:[],
      scheduleTitleTime:'',
      outMeetingRoom:'',
        lngx:'',
        lngy:''
    };
  }

  componentDidMount(){
     let $this=this;

      getMeetingRooms().then((res)=>{
        if(res.Header.IsSuccess && res.Body.response!=null && res.Body.response.IsSuccess){
          var  meetingrooms=res.Body.response.Data.map(function(item,index){
              return {
                  name:item.R_NAME,
                  id:item.SHOW_ID,
                  isFree:false
              }
          });

           if($this.props.meeting.currentRoom!=''&&$this.props.meeting.currentRoomName!='')
           {
               meetingrooms=$this._initRoom(meetingrooms,$this.props.meeting.currentRoom);
           }

            let inner=true;
            if($this.props.meeting.outMeetingRoom!=''||$this.props.meeting.currentRoom!='')
            {
                if($this.props.meeting.outMeetingRoom!='')
                {
                    inner=false;
                }
            }

          $this.setState({
            meetingRoomList:meetingrooms,
            currentRoom:$this.props.meeting.currentRoom,
            showMeetingRoom:inner,
            outer:$this.props.meeting.outMeetingRoom
          });
        };
      });

      $fullcalendar = $(React.findDOMNode(this.refs.calendar));

      $fullcalendar.fullCalendar({

          //businessHours: true,
         header:false,
          weekOnTop:true,
          timezone:'local',
          timeFormat: 'H:mm',
          axisFormat: 'H:mm',
          //defaultDate: '2015-02-12',
          defaultView:'agendaWeek',

          selectHelper: true,
          //editable: false,
          eventLimit: true, // allow "more" link when too many events
          allDaySlot: false,
          timerSeparator: '-',
          dayOfMonthFormat:'D', //ddd
          //eventConstraint:'haha',
          selectable: true,
          //selectConstraint:'haha',

          selectOverlap:false,
              eventOverlap: false,
          eventResizeStop: function(event, jsEvent, ui, view){
              //$this.eventChange.apply($this, arguments);
              let data=Object.assign($this.state.detail,{showId:$this.props.meeting.showId,meetingStart:$this.props.meeting.start,meetingEnd:$this.props.meeting.end,editType:$this.props.meeting.editType})
              $this._changeRoom(data);
          },
          eventDragStop: function(event, jsEvent, ui, view){
              //$this.eventChange.apply($this, arguments);
              let data=Object.assign($this.state.detail,{showId:$this.props.meeting.showId,meetingStart:$this.props.meeting.start,meetingEnd:$this.props.meeting.end,editType:$this.props.meeting.editType})
              $this._changeRoom(data);
          },
          eventRender: function(event, element, view ){
              //$this.eventChange.apply($this, arguments);

              $this.changeEventTimer(event);

          },


          select: function(start, end) {
                $fullcalendar.fullCalendar('removeEvents', [NEWMEETING_ID]);
              var eventData = {
                  start: start,
                  end: end,
                  id: NEWMEETING_ID,
                  editable: true
              };
              $fullcalendar.fullCalendar('renderEvent', eventData, true);
              $fullcalendar.fullCalendar('unselect');
              let data=Object.assign($this.state.detail,{showId:$this.props.meeting.showId,meetingStart:$this.props.meeting.start,meetingEnd:$this.props.meeting.end,editType:$this.props.meeting.editType})
              $this._changeRoom(data);
          },

          eventClick: function(calEvent, jsEvent, view) {
              let startTime=moment(calEvent.start._i).valueOf();
              let endTime=moment(calEvent.end._i).valueOf();
              if(calEvent.id !== NEWMEETING_ID){
                  let data={user:$this.props.meeting.users,startTime:startTime,endTime:endTime};
                  getScheduleForMeeting(data).then(res=>{
                      $this.setState({
                          schedule:res,
                          scheduleTitleTime:timeReversal(data.startTime,data.endTime).currentDate
                      }, ()=>{
                          $this._showModal();
                      });
                  })
              }
          },
          events: function(start,end,timezone,callback){
              start=start._d.setHours(0,0,0);
              end=end._d.setHours(0,0,0);
              let data={
                  start:start,
                  end:end,
                  user:$this.props.meeting.users,
                  meetingId:$this.props.meeting.showId,
                  meetingStart:$this.props.meeting.start,
                  meetingEnd:$this.props.meeting.end,
                  editType:$this.props.meeting.editType
              };
              let eventList =[];
              getOccupiedTimeList(data)
                  .then((res)=>{
                      callback(res);
                      return res;
                  }).then((res) => {
                      cachedMeeting = res;
                  })
              }
      });
      this._setTitleTime();
    $(React.findDOMNode(this.refs.timer)).daterangepicker({
      timePicker: true,
      timePickerIncrement: 30,
      locale: {
        format: 'YYYY-MM-DD HH:mm'
      },
      timePicker24Hour:true
    })
        .on('apply.daterangepicker', (ev, picker) => {
          let startTimer = picker.startDate.format('YYYY-MM-DD HH:mm');
          let endTimer = picker.endDate.format('YYYY-MM-DD HH:mm');
          let start=moment(startTimer).format("X").toString() + "000";
          let end=moment(endTimer).format("X").toString() + "000";
          React.findDOMNode(this.refs.timerContent).innerHTML = `${startTimer} - ${endTimer}`;
          this.setState({startTime:startTimer,endTime:endTimer,timeStartStr:start,timeEndStr:end});
          let data={startTime:start,endTime:end};
          getUnfreeRoomList(data).then((res)=>{
              let newMeetingRooms=this.state.meetingRoomList.map(function(item,index){
                  let data=res.Body.response.Data;
                  if(data.length>0)
                  {
                      let b=false;
                        data.map(function(itemRes,indexRes){
                            if(itemRes.MeetingRoomNo==item.id)
                            {
                                b=true;
                            }
                        })
                      if(!b)
                      {
                          return {
                              name:item.name,
                              id:item.id,
                              isFree:true
                          }
                      }
                      else
                      {
                          return {
                              name:item.name,
                              id:item.id,
                              isFree:false
                          }
                      }
                  }
                  else
                  {
                       return {
                           name:item.name,
                           id:item.id,
                           isFree:true
                       }
                  }
              })
              this.setState({ meetingRoomList:newMeetingRooms});
          })
        });
  }

    changeEventTimer(event){
        if(this.isOccupiedTime(event)) return;
        this.setState({
            detail:{
                start: event.start,
                end: event.end
            }
        })
    }

    isOccupiedTime(event){
        return event.className && event.className.some((time) =>time === 'occupied')
    }



  render() {
    let address = this.state.showMeetingRoom ? this._generateRoom(this.state.meetingRoomList) : ::this._generateOuter();
      let {firstDay, lastDay} = this.state;
      return (
        <div className="new-meeting-box">
          <div className="meeting-box-header">
            <span>{meeting.showId!=''?schedule.UpdateMeeting:schedule.NewMeeting}</span>
              <a href="javascript:void(0)" onClick={::this.props.onClose}><i className="icon-glyph-167"></i></a>
          </div>

          <div className="meeting-box-body ">

            <div className="calendar-change-time new-meeting-calendar-time" >
                <div className="inner" >
                    <span className="prev icon-glyph-143" onClick={this._changeDay.bind(this, 'prev')}></span>
                        <time >
                            <span className="time-title-prev">{firstDay}</span> - <span className="time-title-prev">{lastDay}</span>
                        </time>
                        <span className="next icon-glyph-144" onClick={this._changeDay.bind(this, 'next')}> </span>
                </div>
            </div>

            <div className="meeting-filter-calendar" ref="calendar"></div>
            <div className=" attend-person-group new-meeting-checked clearfix">
              <div className="attend-title pull-left height-line"><span>{schedule.Selected}</span></div>
              <MeetingTimeDetail detail={this.state.detail} />
            </div>


            <div className="meeting-place-nav new-meeting-place-nav attend-person-group clearfix">
            <span className={classnames({"nav-box-item": true, "pull-left": true,active: this.state.showMeetingRoom })} onClick={this._toggleAddress.bind(this, 'inner')}>
            {schedule.MeetingRoom}
            </span>
            <span className={classnames({"nav-box-item": true, "pull-left": true,active: !this.state.showMeetingRoom })} onClick={this._toggleAddress.bind(this, 'outer')}>
            {schedule.MeetingPlace}
            </span>
            </div>
              {address}
            </div>

           <Modal ref="modal">
               <div className="calendar-reason-box">
                   <div className="reason-header">
                       <span>{this.state.scheduleTitleTime}</span>
                       <span className="icon-glyph-167 pull-right " onClick={::this._hideModal}></span>
                   </div>
                   <div className="reason-body">
                       {
                            this.state.schedule.map(function(item,index){
                               return ( <div className="reason-group ">
                                   <div className="reason-avator">
                                       <AvatarComponent userName={item.user} className='chat-message-avator'/>
                                   </div>
                                   <div className="reason-info">
                                       <div className="reason-info-line">
                                           <span>{item.name}</span>
                                       </div>
                                       <div className="reason-info-line ">
                                           <div className="circle"></div>
                                           <span>{item.title}</span>
                                       </div>
                                       <div className="reason-info-line ">
                                           <i className="icon-glyph-101 icon"></i>
                                           <span>{item.time}</span>
                                           <i className=" toolbar icon-glyph-207 icon"></i>
                                           <span>{item.place}</span>
                                       </div>
                                   </div>
                               </div>)
                           })
                       }
                   </div>
               </div>
           </Modal>
            <Modal ref="modalGoogleMap">
                <div className="calendar-reason-box">
                    <div className="reason-header">
                        <span className="icon-glyph-167 pull-right " onClick={::this._hideModalGoogelMap}></span>
                    </div>
                    <div className="new-meeting-map">
                        <GoogleMapComponent  showSearch={true} onSelectPlace={this._googleMapSelect.bind(this)} lat={this.state.laty}  lng={this.state.lngx}></GoogleMapComponent>
                    </div>

                </div>

            </Modal>
            <div className="meeting-box-footer">
              <span className="btn-comfirm" onClick={::this._onConfirm}>{schedule.Confirm}</span>
              <span className="btn-cancle" onClick={::this._onClose}>{schedule.Cancel}</span>
            </div>
          </div>
    )
  }

    _googleMapSelect(location) {
        this.setState({
            lngx: location.lng,
            laty: location.lat
        })
    }


    _showModal(){
        this.refs.modal.show();
    }
    _hideModal(){
        this.refs.modal.hide();
    }

    _showModalGoogleMap(){
        this.refs.modalGoogleMap.show();
    }

    _hideModalGoogelMap(){
        this.refs.modalGoogleMap.hide();
    }
  
    _changeDay(){
        $fullcalendar.fullCalendar.apply($fullcalendar, arguments);

        
        let firstDay = $fullcalendar.fullCalendar('getDate').format('MM月DD日');
        let lastDay = $fullcalendar.fullCalendar('getDate').add(6, 'days').format('MM月DD日');
        this.setState({firstDay,lastDay});
    }
    _setTitleTime(){
        var aa=new Date();
        var bb = aa.getDay();
        let firstDay = $fullcalendar.fullCalendar('getDate').add(-bb,'days').format('MM月DD日');
        let lastDay = $fullcalendar.fullCalendar('getDate').add(6-bb, 'days').format('MM月DD日');
        this.setState({firstDay, lastDay});
    }
    _generateOuter(){
        return (
        <div className="input-group">
            <div className="form-feedback left-item ">
                <input type="search" className="form-c" valueLink={this.linkState('outer')}  />
                <span className="feedback  icon-glyph-207" onClick={::this._showModalGoogleMap}></span>
            </div>
        </div>

        );
    }

    _toggleAddress(type){
        let inner;
        switch(type){
           case 'inner':
                inner = true;
                break;
            case 'outer':
                inner = false;
                break;
        }
        this.setState({
            showMeetingRoom: inner
        });
    }
  _onClose(){

  }
  _checkRoom(id,name){
    this.setState({
          currentRoom:id,
          currentRoomName:name,
          outer:''
    });
  }

    _checkOutRoom(e)
    {
        this.setState({
            currentRoom:'',
            currentRoomName:''
        });
    }
    _initRoom(rooms,roomId)
    {
        return rooms.map(function(item,index){
            return {
                        name:item.name,
                        id:item.id,
                        isFree:true
                    }
        })
    }

  _changeRoom(d)
  {
      var data = Object.assign({}, d);
      let time={startTime:'',endTime:'',showId:'',meetingStart:'',meetingEnd:'',editType:''};
      let start=data.start._d.setHours(data.start._d.getHours());
      let end=data.end._d.setHours(data.end._d.getHours());
      time.startTime=start;
      time.endTime=end;
      time.showId=data.showId;
      time.meetingStart=data.meetingStart;
      time.meetingEnd=data.meetingEnd;
      time.editType=data.editType;
      getUnfreeRoomList(time).then(res=>{
          let newMeetingRooms=this.state.meetingRoomList.map(function(item,index){
              let data=res.Body.response.Data;
              if(data.length>0)
              {
                  let b=false;
                  data.map(function(itemRes,indexRes){
                      if(itemRes.MeetingRoomNo==item.id)
                      {
                          b=true;
                      }
                  })
                  if(!b)
                  {
                      return {
                          name:item.name,
                          id:item.id,
                          isFree:true
                      }
                  }
                  else
                  {
                      return {
                          name:item.name,
                          id:item.id,
                          isFree:false
                      }
                  }
              }
              else
              {
                  return {
                      name:item.name,
                      id:item.id,
                      isFree:true
                  }
              }
          })
          this.setState({ meetingRoomList:newMeetingRooms,currentRoom:''});
      })
  }

    _bindRoom(roomList)
    {
        return roomList.map(function(item,index){
            return ( <div className="meeting-room-group">{item.map(function(itemChild,indexChild){
                //console.log(this);
             return this._generateRoom(itemChild);
            }.bind(this))}</div>);
        }.bind(this))
    }

  _generateRoom(roomList){
      return <div className="meeting-room-group">{ roomList.map(function(room,index){
        if(room.isFree)
          {
            return  (<div className={classnames({"meeting-room-box default":true, "default": true, active:room.id == this.state.currentRoom })} onClick={this._checkRoom.bind(this,room.id,room.name)}><span>{room.name}</span></div>);
          }
         else
         {
              return   (<div className={classnames({"meeting-room-box inactive":true, "default":false })}><span>{room.name}</span></div>);
         }
        }.bind(this))
      }</div>
  }
    //postNewEvent(this.state).then((res) => {
    //  PubSub.publish('REFRESH_EVENT', res.data);
    //});
      _onConfirm(){
          let startDay=this.state.detail.start._d;
          let endDay=this.state.detail.end._d;
          //let start=startDay.setHours(startDay.getHours()-timezone);
          //let end=endDay.setHours(endDay.getHours()-timezone);
          let start=startDay.getTime();
          let end=endDay.getTime();
          meeting = Object.assign({}, meeting, {
              currentRoom:this.state.currentRoom,
              currentRoomName:this.state.currentRoomName,
              startTime:this.state.startTime,
              endTime:this.state.endTime,
              start:start,
              end:end,
              outMeetingRoom:this.state.outer,
              lngx:this.state.lngx,
              lngy:this.state.lngy
          });
          PubSub.publish(CHANGE_SLIDER, {type: S.MEETING, meeting});
  }

  _onClose(){
    PubSub.publish(CHANGE_SLIDER, {type: S.MEETING,meeting:this.props.meeting});

  }
}


Object.assign(NewMeetingFilter.prototype, React.addons.LinkedStateMixin);
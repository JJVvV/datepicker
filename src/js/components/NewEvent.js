/**
 * Created by Administrator on 2015/7/10.
 */

import React, { PropTypes } from 'react/addons.js';
import classnames  from 'classnames';
import ToggleBtn from './ToggleBtn.js';
import PubSub from 'pubsub-js';
import $ from '../lib/daterangepicker.js';

import {REFRESH_EVENT, CHANGE_SLIDER, S} from '../constants/launchr.js';
import moment from 'moment';

import {postNewEvent} from '../services/scheduleService.js';
import {checkRespnseSuccess,packRespnseData} from '../services/msbService.js';
import {FadeModal as Modal} from './boron/Boron.js';
import GoogleMapComponent from '../components/GoogleMapComponent.js';
import FileUploadComponent from '../components/FileUploadComponent.js';
import {arrayRemove} from '../services/arrayService.js'
import Datepicker from './calendar/Datepicker.js';

import {schedule} from '../i18n/index.js'

export default class NewEvent extends React.Component {

    constructor(props) {
        super(props);

        let event = props.event || {};

        this.state = {
            title: event.title,
            lngx: '',
            laty: '',
            place: event.place,
            important: event.isImportant == 1,
            allDay: event.isAllDay == 1,
            standbyTimerList: event.times || [{
                start:+new Date(),
                end:+new Date()
            }],
            repeatCycle: event.repeatType,
            remindTimer: event.remindType,
            content: event.content,
            showId: event.showId,
            initialStartTime: event.initialStartTime,
            saveType: event.saveType,
            //fileShowIds:[]
            S_TIMETYPE_ALL_DAY:"" || "MM-DD",
            S_TIMETYPE_NOT_ALL_DAY:"" || "MM-DD HH:mm",
            E_TIMETYPE_ALL_DAY:"" || "MM-DD",
            E_TIMETYPE_NOT_ALL_DAY:"" || "MM-DD HH:mm"
        };
    }

    render() {
        let standbyTimerList = this._getStandbyTimerList(this.state.standbyTimerList);
        let remindList = this._getRemindTypeList(this.state.allDay);

        return (
            <div className="new-meeting-box">
                <div className="meeting-box-header">
                    <span>{this.state.showId ? schedule.UpdateEvent : schedule.NewEvent}</span>
                    <a href="javascript:void(0)" onClick={::this.props.onClose}>
                        <i className="icon-glyph-167"></i>
                    </a>
                </div>

                <div className="meeting-box-body">
                    <div>
                        <input className="form-c" type="text" placeholder={schedule.FillEventTitle} valueLink={this.linkState('title')} />
                    </div>

                    <div className="clearfix">
                        <div className="new-event-place pull-left">
                            <div className="event-input-group">
                                <div className="form-feedback right-item ">
                                    <input type="search" className="form-c" placeholder={schedule.EventPlace} valueLink={this.linkState('place')} />
                                    <span className="feedback icon-glyph-207" onClick={::this._showModal} style={{cursor:'pointer'}}></span>
                                </div>
                            </div>
                        </div>
                        <div className="new-event-switch pull-left">
                            <span>{schedule.important}</span>
                            <ToggleBtn on={this.state.important} style={{float: "right",cursor:'pointer'}} className="demo-icon" onToggleBtnChange={::this._onToggleImportant} />
                        </div>
                    </div>
                    <p className="new-event-choose-time">
                        <span className="subtask-span">{schedule.TimeSelection}</span>
                    </p>


                    <div className={this.state.standbyTimerList.length > 1 ? '' : 'attend-person-group' }>
                        <div className="new-event-time-title">
                            <span>{schedule.AllDay}</span>
                        </div>
                        <div className="new-event-time-group">
              {standbyTimerList}
                        </div>
                    </div>

              {this.state.standbyTimerList.length > 1 ||
              <div>
                  <select className="form-c" name="" defaultValue={this.state.repeatCycle} valueLink={this.linkState('repeatCycle')}>
                      <option value="0">{schedule.RepetitionInterval}</option>
                      <option value="1">{schedule.ByTheDay}</option>
                      <option value="2">{schedule.ByTheWeek}</option>
                      <option value="3">{schedule.ByTheMonth}</option>
                      <option value="4">{schedule.ByTheYear}</option>
                  </select>
            {remindList}
              </div>
                  }
                    <textarea className="form-c" name="" cols="30" rows="2" placeholder={schedule.EventComment} valueLink={this.linkState('content')}></textarea>
                    {/*<FileUploadComponent appShowID={'l6b3YdE9LzTnmrl7'} addFile={this._addFile.bind(this)} removeFile={this._removeFile.bind(this)}></FileUploadComponent>*/}

                </div>

                <Modal ref="modal">
                    <div className="calendar-reason-box">
                        <div className="reason-header">
                            <span>{this.state.scheduleTitleTime}</span>
                            <span className="icon-glyph-167 pull-right " onClick={::this._hideModal}></span>
                        </div>
                        <div className="new-meeting-map">
                            <GoogleMapComponent  showSearch={true} onSelectPlace={this._googleMapSelect.bind(this)} lat={this.state.laty}  lng={this.state.lngx}></GoogleMapComponent>
                        </div>

                    </div>

                </Modal>

                <div className="meeting-box-footer">
                    <span className="btn-comfirm" onClick={::this._onConfirm}>{schedule.Confirm}</span>
                    <span className="btn-cancle" onClick={::this.props.onClose}>{schedule.Cancel}</span>
                </div>
            </div>
        );
    }

    _showModal() {
        this.refs.modal.show();
    }

    _hideModal() {
        this.refs.modal.hide();
    }

    _googleMapSelect(location) {
        this.setState({
            lngx: location.lng,
            laty: location.lat
        })
    }

    //_addFile(fileShowID){
    //    let fileIds=this.state.fileShowIds.map(function(item,index){
    //        return item;
    //    });
    //    fileIds.push(fileShowID);
    //    this.setState({
    //        fileShowIds:fileIds
    //    });
    //    console.log(this.state.fileShowIds);
    //}
    //
    //_removeFile(fileShowID){
    //    this.setState({
    //        fileShowIds:arrayRemove(this.state.fileShowIds,fileShowID)
    //    });
    //    console.log(this.state.fileShowIds);
    //}

    _onToggleImportant(important) {
        this.setState({
            important
        });
    }

    _onToggleAllDay(allDay) {
        this.state.allDay = allDay;
        this.setState({
            allDay: allDay
        });
    }

    //根据是否全天返回
    _getRemindTypeList(allDay) {
        if (allDay) {
            return <select className="form-c pull-right" name="" defaultValue={this.state.remindTimer} valueLink={this.linkState('remindTimer')}>
                <option value="0">{schedule.RemindTime}</option>
                <option value="200">{schedule.TheDay}</option>
                <option value="201">{schedule.OneDayAgo}</option>
                <option value="202">{schedule.TwoDaysAgo}</option>
                <option value="203">{schedule.OneWeekAgo}</option>
            </select>
        } else {
            return <select className="form-c pull-right" name="" defaultValue={this.state.remindTimer} valueLink={this.linkState('remindTimer')}>
                <option value="0">{schedule.RemindTime}</option>
                <option value="100">{schedule.beginTime}</option>
                <option value="101">{schedule.FiveMinutesAgo}</option>
                <option value="102">{schedule.FifteenMinutesAgo}</option>
                <option value="103">{schedule.ThirtyMinutesAgo}</option>
                <option value="104">{schedule.OneHourAgo}</option>
                <option value="105">{schedule.TwoHoursAgo}</option>
                <option value="106">{schedule.TheDay}</option>
                <option value="107">{schedule.TwoDaysAgo}</option>
                <option value="108">{schedule.OneWeekAgo}</option>
            </select>
        }
    }

    _getStandbyTimerList(list) {
        return list.map((standby, index) => {
            if (index === 0) {
                return <div className="new-event-time-line" key={index}>
                    <ToggleBtn className="demo-icon new-event-time-line-header icon-gap" on={this.state.allDay} onToggleBtnChange={::this._onToggleAllDay} />
                    <div className="input-group-wrapper">
                        <div className="input-group half-group">
                            <div className="form-feedback left-item ">
                                <Datepicker dateFormatAllDay={this.state.S_TIMETYPE_ALL_DAY} dateFormatNotAllDay={this.state.S_TIMETYPE_NOT_ALL_DAY} allDay={this.state.allDay} onChange={this._standbyTimerChange.bind(this, index,1)} date={standby.start?new Date(standby.start): new Date()} className="form-c" />
                                <span className="feedback  icon-glyph-89"></span>
                            </div>
                        </div>
                        <div className="input-group half-group">
                            <div className="form-feedback left-item ">
                                <Datepicker dateFormatAllDay={this.state.E_TIMETYPE_ALL_DAY} dateFormatNotAllDay={this.state.E_TIMETYPE_NOT_ALL_DAY} allDay={this.state.allDay} onChange={this._standbyTimerChange.bind(this, index,2)} date={standby.end?new Date(standby.end): new Date()} className="form-c" />
                                <span className="feedback  icon-glyph-89"></span>
                            </div>
                        </div>
                          {this.state.standbyTimerList.length <= 2 && <i className="icon-glyph-102 btn-add" onClick={::this._addEventTimer}></i>}
                    </div>
                </div>
            }
            return <div className="new-event-time-line" key={index}>
                <span className="new-event-time-line-header span-gap">{schedule.StandbyTime}</span>
                <div className="input-group-wrapper">
                    <div className="input-group half-group">
                        <div className="form-feedback left-item ">
                            <Datepicker dateFormatAllDay={this.state.S_TIMETYPE_ALL_DAY} dateFormatNotAllDay={this.state.S_TIMETYPE_NOT_ALL_DAY} allDay={this.state.allDay} onChange={this._standbyTimerChange.bind(this, index,1)} date={standby.start?new Date(standby.start): new Date()} className="form-c" />
                            <span className="feedback  icon-glyph-89"></span>
                        </div>
                    </div>
                    <div className="input-group half-group">
                        <div className="form-feedback left-item ">
                            <Datepicker dateFormatAllDay={this.state.E_TIMETYPE_ALL_DAY} dateFormatNotAllDay={this.state.E_TIMETYPE_NOT_ALL_DAY} allDay={this.state.allDay} onChange={this._standbyTimerChange.bind(this, index,2)} date={standby.end?new Date(standby.end): new Date()} className="form-c" />
                            <span className="feedback  icon-glyph-89"></span>
                        </div>
                    </div>
                    <i className="icon-glyph-120 btn-del" onClick={this._removeStandby.bind(this, index)}></i>
                </div>
            </div>
        });
    }

    _addEventTimer() {
        this.state.standbyTimerList.push({
            start: Number(new Date()),
            end: Number(new Date())
        });
        let standbyTimerList = this.state.standbyTimerList;
        this.setState({
            standbyTimerList
        });
    }

    _removeStandby(index) {
        let standbyTimerList = this.state.standbyTimerList;
        standbyTimerList.splice(index, 1);
        this.setState({
            standbyTimerList
        });
    }

    _standbyTimerChange(index,type,e) {
        if (type == 1) {
            this.state.standbyTimerList[index].start = e.valueOf();
        } else {
            this.state.standbyTimerList[index].end = e.valueOf();
        }
        let standbyTimerList = this.state.standbyTimerList;
        this.setState({
            standbyTimerList
        });
    }

    _onConfirm() {
        postNewEvent(this.state).then((res) => {
            let retData = packRespnseData(res);
            if (checkRespnseSuccess(res)) {
                this.props.onClose();
                PubSub.publish(REFRESH_EVENT, retData.Data);
            } else {
                alert(retData.Reason);
            }
        });
    }
}

Object.assign(NewEvent.prototype, React.addons.LinkedStateMixin);
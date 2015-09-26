/**
 * Created by Administrator on 2015/7/10.
 */

import React, { PropTypes } from 'react'
import moment from 'moment';

import {schedule} from '../i18n/index.js'

export default class MeetingTimeDetail {

  render(){
    let {start, end} = this.props.detail;
    start = moment(start);
    end = moment(end);

    let startTime = this.getRelativeTime(start);
    let endTime = this.getRelativeTime(end);
    let hours = this.getDiffHours(start, end);
    let isSameDay = this.isSameDay(start, end);


    let renderDetail,timeDetail;

    if(isSameDay){
      timeDetail =
          <span>
            {`${startTime.date}(${startTime.day})${startTime.hour} ~ ${endTime.hour}`}
          </span>
    }else{
      timeDetail =
          <span>
            {`${startTime.date}${startTime.hour} ~ ${endTime.date}${endTime.hour}`}
          </span>
    }

    if(this.isValid(start, end)){
      renderDetail =
          <div className="meeting-detail-line height-line">
            <i className=" toolbar icon-glyph-89" ref="timer"></i>
            {timeDetail}
            <span className="time">&nbsp;{hours}{schedule.Hours}</span>
          </div>
    }
    return(
        <div className="attend-meeting-detail">
          {renderDetail}
        </div>
    );

  }
  isValid(start, end){
    return start.isValid() && end.isValid();
  }

  getRelativeTime(time){
    return {
      day: time.format('dddd'),
      date:time.format('MM 月 DD 日'),
      hour: time.format('HH:mm')
    }
  }

  getDiffHours(start, end){
    return (end.diff(start, 'minutes')/60).toFixed(1);
  }

  isSameDay(start, end){
    return end.diff(start, 'days') === 0;
  }
}


/**
 * Created by Administrator on 2015/7/10.
 */

import React, {PropTypes} from 'react';
import fullcalendar from '../lib/fullcalendar';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import fullcalendarContainer from "../services/fullcalendarContainer.js";
import {REFRESH_EVENT,REFRESH_CALENDAR} from '../constants/launchr.js';
import moment from 'moment';
import {CHANGE_SLIDER,SLIEDER_ACTIVE, S} from '../constants/launchr.js';
import {sliderShow} from '../services/slider.js';
import reduxContainer from '../services/reduxContainer.js';

import {GetEventList,calendarShowDate,sliderDetail} from '../services/scheduleService.js';
import {checkRespnseSuccess,packRespnseData} from '../services/msbService.js';

import loading from './loading/Loading.js';

@loading
export default class CalendarBody {

    componentDidMount() {
        let calendar = React.findDOMNode(this.refs.calendar);
        let $calendar = fullcalendarContainer.set($(calendar));
        this.calendar = $calendar;

        this.refreshEvent = PubSub.subscribe(REFRESH_EVENT, (eventName, data) => {
            if (data) {
                $calendar.fullCalendar('refetchEvents');
            }
        });

        this.refreshCalendar = PubSub.subscribe(REFRESH_CALENDAR, (eventName, data)=> {
            if (data) {
                $calendar.fullCalendar('destroy'); //暂时
                this.fullcalendar($calendar, data || '')
            }
        });
        this.fullcalendar($calendar)
    }

    componentWillUnmount() {
        this.calendar.fullCalendar('destroy');
        PubSub.unsubscribe(this.refreshEvent);
        PubSub.unsubscribe(this.refreshCalendar);
    }

    getCalendarHeight(){
        return $(window).height() - this.calendar.prev().height() - 30;
    }

    fullcalendar($calendar,user) {
        var height = this.getCalendarHeight();
        $calendar.fullCalendar({
            header: false,
            editable: false,
            timeFormat: 'H:mm',
            axisFormat: 'H:mm',
            eventLimit: true,
            //height: 650,
            contentHeight: height,
            windowResize: () => {
                this.calendar.fullCalendar('option', 'contentHeight', this.getCalendarHeight());
            },
            events: function (start, end, timezone, callback) {
                let data = {
                    start: start,
                    end: end,
                    user: user
                };
                let eventList = [];
                this.props.loadingStart();
                GetEventList(data).then((res)=> {
                    this.props.done();
                    let resData = packRespnseData(res).Data;
                    if (checkRespnseSuccess(res)) {
                        for (let i = 0; i < resData.length; i++) {
                            eventList.push({
                                id: resData[i].showId,
                                relateId: resData[i].relateId,
                                isImportant: resData[i].isImportant,
                                isCancel: resData[i].isCancel,
                                title: resData[i].title,
                                type: resData[i].type,
                                startTime: resData[i].startTime,
                                start: moment(resData[i].startTime).format('YYYY-MM-DD HH:mm'),
                                end: moment(resData[i].endTime).format('YYYY-MM-DD HH:mm'),
                                showTime: this._GetDateRang(resData[i].startTime, resData[i].endTime, resData[i].isAllDay),
                                isAllDay: resData[i].isAllDay,
                                allDay: resData[i].isAllDay === 1,
                                createUser: resData[i].createUser,
                                repeatType: resData[i].repeatType
                            });
                        }
                        callback(eventList);
                    }
                })
            }.bind(this),
            eventRender: function (event, element) {
                //let strStart = event.start._i;
                //let strEnd = event.end && event.end._i;
                let stype = '';
                switch (event.type) {
                    case "event":
                        stype = "detail-event event-group";
                        break;
                    case "event_sure":
                        stype = "detail-postEvent event-group";
                        break;
                    case  "meeting":
                        stype = "detail-meeting event-group";
                        break;
                    default :
                        break;
                }
                if (event.isCancel == 1) {  //取消
                    stype = "detail-cancel event-group";
                }
                element.addClass(stype).attr('data-id', event.id);
                if (event.isImportant == 1) {
                    element.addClass("emergency-line");
                }
                element.html('<span class="pull-right time">' + event.showTime + '</span>' + '<span class="reason">' + event.title + '</span>');

            },
            eventClick: function (calEvent, jsEvent, view) {
                sliderDetail(calEvent);
            }
        });
    }

    //格式化日历显示时间
    _GetDateRang(start, end, isAllDay) {
        return calendarShowDate(start, end, isAllDay);
    }

  render() {
      return (
          <div className="calendar-body" ref="calendar"></div>
      );
  }
}




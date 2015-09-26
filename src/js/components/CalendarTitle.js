/**
 * Created by Administrator on 2015/7/10.
 */
/*
* application list item or people list item used in .sub-panel
 */

import React, {PropTypes} from 'react';
import classnames  from 'classnames';
import ChatRoom from './chatapp/ChatRoom.js';
import fullcalendarContainer from '../services/fullcalendarContainer.js';
import PubSub from 'pubsub-js';
import CalendarDropdown from './CalendarDropdown.js';
import CalendarSearch from './CalendarSearch.js';
import SelectUserArea from './SelectUserArea.js'
import $ from 'jquery';

import { S,REFRESH_CALENDAR} from '../constants/launchr.js';
import {sliderShow} from '../services/slider.js';
import AvatarComponent from './AvatarComponent.js';
import {getCurrentInfo} from '../services/scheduleService.js';

import {schedule} from '../i18n/index.js'

export default class CalendarTitle extends React.Component {

    constructor() {
        super();
        this.state = this.getState();
    }

    render() {
        const {toggle} = this.props;
        let userNamelist=[this.state.avaor.name];
        return (
            <div className="calendar-title clearfix" onClick={toggle}>
                <div className="calendar-user">
                    <div className="calendar-user-avator avator">
                        <AvatarComponent userName={this.state.avaor.name||'default'} trueName={this.state.avaor.trueName}/>
                    </div>
                    <span className="calendar-user-name" >{this.state.avaor.trueName}</span>
                    <a className="calendar-user-change"  onClick={this._toggleUser.bind(this)} style={{marginRight: '20px',cursor:'pointer'}}>{schedule.ChangeUser}</a>
                </div>
                <div className="calendar-action">
                    <div className="btn-group ">
                        <button className={classnames({
                            'btn': true,
                            'btn-default': true,
                            'active': this.state.showMonth
                        })} onClick={this.toggleView.bind(this, 'month')}>{schedule.Month}</button>
                        <button className={classnames({
                            'btn': true,
                            'btn-default': true,
                            'active': !this.state.showMonth
                        })} onClick={this.toggleView.bind(this, 'agendaWeek')}>{schedule.Week}</button>
                    </div>
                    <CalendarDropdown />
                    <CalendarSearch />
                    <SelectUserArea ref='calendar' multiple={false} selectKeys={userNamelist} onCheck={this._setTreeResult.bind(this)}/>
                </div>
                <div className="calendar-change-time">
                    <div className="inner">
                        <span className="prev icon-glyph-143" onClick={this.toggleMonth.bind(this, 'prev')}></span>
                        <time>{this.state.year}{schedule.Year}{this.state.month}{schedule.Month}</time>
                        <span className="next icon-glyph-144" onClick={this.toggleMonth.bind(this, 'next')}></span>
                    </div>
                </div>
            </div>
        );
    }

    toggleDropdown() {
        this.setState({
            showDropdown: !this.state.showDropdown
        });
    }

    toggleMonth(handler) {
        let $calendar = fullcalendarContainer.get();
        $calendar.fullCalendar(handler);
        let viewTimer = $calendar.fullCalendar('getDate');
        this.setState(this.getTimer(viewTimer._d));
    }

    showMonth(show) {
        return {
            showMonth: show
        }
    }

    getTimer(timer) {
        return {
            year: timer.getFullYear(),
            month: timer.getMonth() + 1
        }
    }

    getState() {
        var timer = this.getTimer(new Date());
        let showMonth = this.showMonth(true);
        let userInfo=getCurrentInfo();
        return {
            ...timer,
            ...showMonth,
            showDropdown:false,
            avaor:userInfo
        }
;
}
toggleTitle()
{

}

_toggleUser()
{
    this.refs.calendar.show();
}

//获取选人控件的返回值
_setTreeResult(result)
{
    var result = $.extend([], result);
    let userInfo = {};
    if (result.length < 1) {
        userInfo = getCurrentInfo();
    } else {
        userInfo = {
            url: result[0].url || '',
            name: result[0].name || '',
            trueName: result[0].trueName || ''
        };
    }
    if (userInfo.name != this.state.avaor.name) {
        PubSub.publish(REFRESH_CALENDAR, userInfo.name);
    }
    this.setState({
        avaor: userInfo
    });
}

//切换视图
toggleView(viewName)
{
    let showMonth = !this.state.showMonth;
    this.setState(this.showMonth(showMonth));
    fullcalendarContainer.get().fullCalendar('changeView', viewName);
}
}




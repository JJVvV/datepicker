/**
 * Created by Alex a cool guy
 */
import React, {PropTypes} from 'react';
import classnames  from 'classnames';
import PubSub from 'pubsub-js';
import {CHANGE_SLIDER, SLIDER_ACTIVE, S} from '../../constants/launchr.js';
import {sliderShow} from '../../services/slider.js';
import moment from 'moment';
import $ from 'jquery';

var aa = moment;
const WEEK_NUM = 42;
export default class Calendar extends React.Component{

    static defaultProps = {
        hourGap: 1,
        minuteGap:1,
        selected: new Date(),
        allDay:false,
        opensleft:false,
        bottom:false,
        onSelect: function(){}
    }

    state = {
        selected: new Date(),
        timer: new Date(),
        hour:this.props.selected.getHours(),
        minute:this.props.selected.getMinutes(),
        left:''
    }
    constructor(props){
        super(props);
    }

    subtractMinute(minute){
        //this.setState({
        //    minute: this.changeMinute(minute, 'subtract')
        //});

        this.setNewSelectedTimer(this.changeMinute(minute, 'subtract'), 'minute');
    }

    addMinute(minute){
        var timer = this.props.selected.clone();
        var newTimer = moment(+timer).add();
        this.setState({
            minute: this.changeMinute(minute, 'add')
        });

        this.setNewSelectedTimer(this.changeMinute(minute, 'add'), 'minute');
    }
    changeMinute(minute, type){

        if(type === 'add'){
            return Math.floor((minute+10)/10)*10;
        }else{
            return Math.floor((minute-1)/10)*10;
        }
    }

    subtractHour(h){
        //let nowTimer = moment(+this.state.timer.clone()).subtract(this.props.hourGap, 'hours')._d;
        let hour = this.changeHour(h, 'subtract');
        this.setState({
            hour
        });
        this. selectHour(hour);
    }
    addHour(h){
        let hour = this.changeHour(h, 'add');
        this.setState({
            hour
        });

        this.selectHour(hour);

    }
    changeHour(hour, type){
        return type === 'add' ? hour + 1 : hour -1;
    }

    getSelectedHourMinute(selectedTimer){
        return {
            hour: selectedTimer.getHours(),
            minute: selectedTimer.getMinutes()

        }
    }

    regulateHour(hour){
        return hour<0 ? hour+24 : hour>=24 ? hour - 24 : hour;
    }
    regulateMinute(minute){
        return minute<0 ? minute+60 : minute>=60 ? minute - 60 : minute;
    }

    componentDidUpdate(){
        let hour = this.hour < 10 ? '0'+ this.hour : this.hour;
        let minute = this.minute < 10 ? '0'+ this.minute : this.minute;
        React.findDOMNode(this.refs.hour).value = hour;
        React.findDOMNode(this.refs.minute).value = minute;
    }

    generateHourList(hour){
        let li1 = ::this.regulateHour(hour-2);
        let li2 = ::this.regulateHour(hour-1);
        let li3 = ::this.regulateHour(hour+1);
        let li4 = ::this.regulateHour(hour+2);
        let nowHour= ::this.regulateHour(hour);
        this.hour = nowHour;

        return (
            <ul>
                <li><i className="demo-icon icon-glyph-141" onClick={this.subtractHour.bind(this, hour)}></i></li>
                <li onClick={::this.selectHour.bind(this, li1)}>{li1>9 ? li1 : "0" + li1}</li>
                <li onClick={::this.selectHour.bind(this, li2)}>{li2>9 ? li2 : "0" + li2}</li>
                <li><input ref="hour" className="form-c input-box" type="text" defaultValue={nowHour>9 ? nowHour : "0" + nowHour} onBlur={::this.hourBlur} /></li>
                <li onClick={::this.selectHour.bind(this, li3)}>{li3>9 ? li3 : "0" + li3}</li>
                <li onClick={::this.selectHour.bind(this, li4)}>{li4>9 ? li4 : "0" + li4}</li>
                <li><i className="demo-icon icon-glyph-142" onClick={this.addHour.bind(this, hour)}></i></li>
            </ul>
        );
    }

    hourBlur(e){
        let hour = parseInt(e.target.value);
        if(isNaN(hour)){
            hour = 0;
        }else if(hour> 23){
            hour = 23
        }else if(hour < 0){
            hour = 0
        }
        this.selectHour(hour);
    }

    minuteBlur(e){
        let minute = parseInt(e.target.value);
        if(isNaN(minute)){
            minute = 0;
        }else if(minute> 59){
            minute = 59
        }else if(minute < 0){
            minute = 0
        }
        this.selectMinute(minute);
    }



    generateMinuteList(minute){
        let li1 = ::this.regulateMinute(minute-2);
        let li2 = ::this.regulateMinute(minute-1);
        let li3 = ::this.regulateMinute(minute+1);
        let li4 = ::this.regulateMinute(minute+2);
        let nowMinute= ::this.regulateMinute(minute);
        this.minute = nowMinute;
        return (
            <ul>
                <li><i className="demo-icon icon-glyph-141" onClick={this.subtractMinute.bind(this, minute)}></i></li>
                <li onClick={this.selectMinute.bind(this, li1)}>{li1>9 ? li1 : "0" + li1}</li>
                <li onClick={this.selectMinute.bind(this, li2)}>{li2>9 ? li2 : "0" + li2}</li>
                <li><input ref="minute" className="form-c input-box" type="text" defaultValue={nowMinute>9 ? nowMinute : "0" + nowMinute} onBlur={::this.minuteBlur} /></li>
                <li onClick={this.selectMinute.bind(this, li3)}>{li3>9 ? li3 : "0" + li3}</li>
                <li onClick={this.selectMinute.bind(this, li4)}>{li4>9 ? li4 : "0" + li4}</li>
                <li><i className="demo-icon icon-glyph-142" onClick={this.addMinute.bind(this, minute)}></i></li>
            </ul>
        );
    }
    selectHour(hour){
        //this.setState({
        //    hour
        //});
        this.setNewSelectedTimer(hour, 'hour');
    }



    selectMinute(minute){
        //this.setState({
        //    minute
        //});
        this.setNewSelectedTimer(minute, 'minute');
    }
    setNewSelectedTimer(value, type){
        var oldDay = this.props.selected.clone();
        var newDay = moment(+oldDay)[type](value);
        this.setDate(newDay);
    }

    componentWillUpdate(props){
    }

    cancelBubble(e){
        //e.stopPropagation();
        e.shouldShowCalendar = true;
    }

    componentDidMount(){
        this.calendar = React.findDOMNode(this.refs.calendar);
        this.calendar.addEventListener('click', this.cancelBubble);
        this.$window = $(window);
        this.props.onSelect(moment(this.props.selected));
        this.getRegularLeft();
    }
    componentWillMount(){

    }
    componentWillUnmount(){
        this.calendar.removeEventListener('click', this.cancelBubble);
    }

    getHourMinute(selected){
        return {
            hour:selected.getHours(),
            minute: selected.getMinutes()
        }
    }
    getRegularLeft(){
       let {
           left,
           top
       } = this.props.position;

        let opensleft = false;
        let bottom = true;

        let offsetWidth = this.calendar.offsetWidth;
        let $windowWidth = this.$window.width();
        let offsetHeight = this.calendar.offsetHeight;
        let $windowHeight = this.$window.height();

        if(offsetWidth + left > $windowWidth){
            left = $windowWidth - offsetWidth;
            opensleft = true;
        }

        if($windowHeight + top > $windowHeight){
            top = $windowHeight - $windowHeight;
            bottom = false;
        }

        this.setState({
            left,
            opensleft,
            bottom
        });
    }

    getArrowPosition(){
        let right = this.state.opensleft;
        let bottom = this.state.bottom;
        return 'opens-'+ bottom ? 'bottom' : 'top' +'-' + (right ? 'right': 'left');
    }

    render(){
        const {
            opensleft,
            opensbottom,
            left
        } = this.state;
        let className = 'daterangepicker dropdown-menu show-calendar clearfix ' + this.getArrowPosition();
        return(
            <div ref="calendar" className={className} style={{position:'absolute', left: this.state.left, top:this.props.position.top, display:'block'}}>
                {this.generateHourMinute()}
                <div className="calendar pull-left">
                    <div className="calendar-table">
                        <table className="table-condensed">
                            <thead>
                            <tr>
                                <th className="prev available"><i className="demo-icon icon-glyph-143" onClick={::this.toPrevMonth}></i></th>
                                <th colspan="5" className="month">{moment(this.state.timer).format('YYYY年MM月')}</th>
                                <th><i className="demo-icon icon-glyph-144"  onClick={::this.toNextMonth}></i></th>
                            </tr>
                            <tr className="calendar-week-day">
                                <th>日</th>
                                <th>一</th>
                                <th>二</th>
                                <th>三</th>
                                <th>四</th>
                                <th>五</th>
                                <th>六</th>
                            </tr>
                            </thead>
                            {this.generateDays()}
                        </table>
                    </div>
                </div>

            </div>
        )
    }
    generateHourMinute(){
        const {
            hour,
            minute
            } = this.getHourMinute(this.props.selected);
        return this.props.allDay || (
            <div className="pull-right  calendar-right-time-box">
                <div className="half-left-box">
                    {::this.generateHourList(hour)}
                </div>
                <div className="half-left-box">
                    {::this.generateMinuteList(minute)}
                </div>
            </div>
        );
    }
    generateDays(){

        var weekList = this.getWeekList(this.state.timer);
        return (
            <tbody className="calendar-body">
                {weekList.map((week) => {
                    return (
                        <tr>
                            {week.map((day) => ( <td className={classnames({weekend: true, available: true, off: !day.isThisMonth, active: day.selected, today: day.isToday})} onClick={this._selectDay.bind(this, day.day)}>{day.day.getDate()}</td>))}
                        </tr>
                    );
                })}
            </tbody>

        );
    }




    _selectDay(day){
        var oldDay= this.props.selected.clone();

        var hour = oldDay.getHours();
        var minute = oldDay.getMinutes();
        var newDay = moment(+day).hour(hour).minute(minute);


        this.setDate(newDay);


    }

    setDate(...args){
        this.props.onSelect(...args);
    }

    toPrevMonth(){
        this.toggleMonth(this.state.timer, 'subtract');
    }
    toggleMonth(t, type){
        var timer = t.clone();
        var newTimer = moment(+timer)[type](1, 'months');
        this.setState({
            timer: newTimer._d
        });
    }
    toNextMonth(){
       this.toggleMonth(this.state.timer, 'add');
    }
    getWeekList(t){
        var days = this.getDays(t);
        var startDay = moment(this.getCalendarStartDay(t));
        var list = [];
        var weekList = [];
        var today = moment().date();
        var today = new Date();
        let isToday ;
        let selected;
        for(var i=0; i<WEEK_NUM; i++){
            startDay.add(1, 'days');
            list.push(startDay._d.clone());
        }

        for(var i=0; i<list.length; i++){
            weekList[Math.floor(i/7)] = weekList[Math.floor(i/7)] || [];
            isToday = this.isSameDay(list[i], today);
            selected = this.isSameDay(list[i], this.props.selected);
            weekList[Math.floor(i/7)].push({day: list[i],isToday:isToday,selected:selected, isThisMonth: !((Math.floor(i/7) === 0  && list[i].getDate()>20) || (Math.floor(i/7) >=4 && list[i].getDate()< 20))});
        }
        return weekList;
    }

    getCalendarStartDay(t){
        let timer = t.clone();
        timer.setDate(1);
        let day = timer.getDay();
        timer.setDate(-day);
        return +timer;
    }

    isSameDay(dayA, dayB){
        return dayA.getFullYear() === dayB.getFullYear() && dayA.getMonth() === dayB.getMonth() && dayA.getDate() == dayB.getDate();
    }
    //获取某月的天数
    getDays(t){

        let timer = t.clone();
        let month = timer.getMonth();
        let year = timer.getFullYear();
        return new Date(year, month, 0).getDate();
    }

}




Date.prototype.clone = function(){
    return new Date(+this);
}
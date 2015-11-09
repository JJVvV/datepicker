/**
 * Created by Alex a cool guy
 */
import React, {PropTypes} from 'react';
import classnames  from 'classnames';
import moment from 'moment';



const WEEK_NUM = 42;

const weekList=moment.weekdaysMin();

const offset = {
    left: function left(element){
        return element.offsetLeft + (element.offsetParent ? left(element.offsetParent) : 0);
    },

    top: function top(element){
        return element.offsetTop + (element.offsetParent ? top(element.offsetParent) : 0);
    }
}


export default class Calendar extends React.Component{

    static defaultProps = {
        hourGap: 1,
        minuteGap:1,
        date: '',
        allDay:false,
        opensleft:false,
        bottom:false,
        onSelect: function(){},
        disabledDates: [],
        //lang:getCalendarLanguageAdapter()
    }


    constructor(props){
        super(props);
        let date = props.date.isValid() ? props.date : moment();
        this.state = {
            date: date,
            timer: date.clone(),
            hour:date.hour(),
            minute:date.minute(),
            left:''
        };
    }

    componentWillReceiveProps(props){
        let date = props.date.isValid() ? props.date : moment();
        this.setState({
            date: date
        });
    }

    subtractMinute(minute){


        this.setNewSelectedTimer(this.changeMinute(minute, 'subtract'), 'minute');
    }

    addMinute(minute){
        var timer = this.state.date.clone();
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
        if(!this.refs.hour||!this.refs.minute){
            return;
        }
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
                <li><i className="icon icon-angle-up" onClick={this.subtractHour.bind(this, hour)}></i></li>
                <li onClick={::this.selectHour.bind(this, li1)}>{li1>9 ? li1 : "0" + li1}</li>
                <li onClick={::this.selectHour.bind(this, li2)}>{li2>9 ? li2 : "0" + li2}</li>
                <li className="hour"><input ref="hour" className="form-c input-box" type="text" defaultValue={nowHour>9 ? nowHour : "0" + nowHour} onBlur={::this.hourBlur} /></li>
                <li onClick={::this.selectHour.bind(this, li3)}>{li3>9 ? li3 : "0" + li3}</li>
                <li onClick={::this.selectHour.bind(this, li4)}>{li4>9 ? li4 : "0" + li4}</li>
                <li><i className="icon icon-angle-down" onClick={this.addHour.bind(this, hour)}></i></li>
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
                <li><i className="icon icon-angle-up" onClick={this.subtractMinute.bind(this, minute)}></i></li>
                <li onClick={this.selectMinute.bind(this, li1)}>{li1>9 ? li1 : "0" + li1}</li>
                <li onClick={this.selectMinute.bind(this, li2)}>{li2>9 ? li2 : "0" + li2}</li>
                <li><input ref="minute" className="form-c input-box" type="text" defaultValue={nowMinute>9 ? nowMinute : "0" + nowMinute} onBlur={::this.minuteBlur} /></li>
                <li onClick={this.selectMinute.bind(this, li3)}>{li3>9 ? li3 : "0" + li3}</li>
                <li onClick={this.selectMinute.bind(this, li4)}>{li4>9 ? li4 : "0" + li4}</li>
                <li><i className="icon icon-angle-down" onClick={this.addMinute.bind(this, minute)}></i></li>
            </ul>
        );
    }
    selectHour(hour){

        this.setNewSelectedTimer(hour, 'hour');
    }



    selectMinute(minute){

        this.setNewSelectedTimer(minute, 'minute');
    }

    setNewSelectedTimer(value, type){
        var oldDay = this.state.date.clone();
        var newDay = moment(+oldDay)[type](value);
        this.setDate(newDay);
    }



    componentDidMount(){
        this.calendar = React.findDOMNode(this.refs.calendar);


        let input = React.findDOMNode(this.props.root.refs.input);
        this.setPosition(input);
    }

    setPosition(input){
        let left = offset.left(input),
            top = offset.top(input),
            offsetHeight = this.calendar.offsetHeight,
            offsetWidth = this.calendar.offsetWidth,
            rect = input.getBoundingClientRect(),
            windowHeight = window.innerHeight || document.documentElement.clientHeight,
            windowWidth = window.innerWidth || document.documentElement.clientWidth,
            opensleft = true,
            opensbottom = true;


        if(windowHeight - rect.bottom > offsetHeight || rect.top < windowHeight - rect.bottom){
            top += 10 + input.offsetHeight;
        }else if(rect.top> windowHeight - rect.bottom){
            top -= (10 + offsetHeight);
            opensbottom = false;
        }



        if(offsetWidth + left > windowWidth){
            left = windowWidth - offsetWidth-10;
            opensleft = false;
        }


        this.calendar.style.top = top + 'px';
        this.calendar.style.left = left + 'px';
        this.calendar.classList.add(opensleft ? 'opensleft': 'opensright');
        this.calendar.classList.add(opensbottom ? 'opensbottom' : 'openstop');
    }

    getHourMinute(selected){
        return {
            hour:selected.hour(),
            minute: selected.minute()
        }
    }

    render(){

        let className = 'datepicker dropdown-menu show-calendar clearfix';
        return(
            <div ref="calendar" className={className} style={{position:'absolute', display: 'block'}}>
                <div className="datepicker-inner">
                    {this.generateDatepickerDate()}
                    {this.generateHourMinute()}
                </div>
            </div>
        )
    }

    generateDatepickerDate(){
       return (
           <div className="calendar datepicker-date">
               <div className="calendar-table">
                   <table className="table-condensed">
                       <thead>
                       <tr>
                           <th className="prev available"><i className="icon icon-angle-left" onClick={::this.toPrevMonth}></i></th>
                           <th colSpan="5" className="month">{this.state.timer.format('YYYY年MM月')}</th>
                           <th><i className="icon icon-angle-right"  onClick={::this.toNextMonth}></i></th>
                       </tr>
                       <tr className="calendar-week-day">
                           {
                               weekList.map((item, index)=> {
                                   return <th key={index}>{item}</th>
                               })
                           }
                       </tr>
                       </thead>
                       {this.generateDays()}
                   </table>
               </div>
           </div>
       );
    }

    generateHourMinute(){
        const {
            hour,
            minute
            } = this.getHourMinute(this.state.date);
        return this.props.allDay || (
            <div className=" datepicker-timer">
                <div className="datepicker-timer-hour">
                    {::this.generateHourList(hour)}
                </div>
                <div className="datepicker-timer-minute">
                    {::this.generateMinuteList(minute)}
                </div>
            </div>
        );
    }
    generateDays(){

        var weekList = this.getWeekList(this.state.timer);
        return (
            <tbody className="calendar-body">
                {weekList.map((week, i) => {
                    return (
                        <tr key={i}>
                            {week.map((day, j) => (
                                day.isThisMonth ?
                                    <td key={i+'_'+j} className={classnames({weekend: true, available: true, off: !day.enableDay, active: day.selected, today: day.isToday})} onClick={day.enableDay ? this._selectDay.bind(this, day.day): null}><span className="num">{day.day.date()}</span></td> :
                                    <td key={i+'_'+j}></td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>

        );
    }




    _selectDay(day){
        var oldDay= this.state.date.clone();

        var hour = oldDay.hour();
        var minute = oldDay.minute();
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
        timer = timer[type](1, 'months');

        this.setState({
            timer
        });
    }
    toNextMonth(){
       this.toggleMonth(this.state.timer, 'add');
    }
    getWeekList(t){
        var days = this.getDays(t);
        var startDay = this.getCalendarStartDay(t);
        var list = [];
        var weekList = [];
        var today = moment();

        let isToday ;
        let selected;
        let enableDay;
        let {
            minDate,
            maxDate,
            disabledDates
            } = this.props;
        for(var i=0; i<WEEK_NUM; i++){
            startDay.add(1, 'days');
            list.push(startDay.clone());
        }

        for(var i=0; i<list.length; i++){
            weekList[Math.floor(i/7)] = weekList[Math.floor(i/7)] || [];
            isToday = this.isSameDay(list[i], today);
            selected = this.isSameDay(list[i], this.props.date);

            if(minDate && maxDate){

                enableDay = minDate.sameDay(maxDate) ?
                    minDate.sameDay(list[i]) :
                    minDate < maxDate ? ((minDate < list[i] || list[i].sameDay(minDate)) && (maxDate > list[i] || list[i].sameDay(maxDate))): (list[i]>minDate || minDate.sameDay(list[i]));

            }else if(minDate){
                enableDay = (list[i] > minDate || list[i].sameDay(minDate))
            }else if(maxDate){
                enableDay = (list[i] < maxDate || list[i].sameDay(maxDate))
            }else{
                enableDay = true;
            }
            disabledDates.forEach((day) => {
                if(day.sameDay(list[i])){
                    enableDay = false;
                }
            });

            weekList[Math.floor(i/7)].push({
                day: list[i],
                isToday,selected,enableDay,
                isThisMonth: !((Math.floor(i/7) === 0  && list[i].date()>20) || (Math.floor(i/7) >=4 && list[i].date()< 20))});
        }
        return weekList;
    }

    getCalendarStartDay(t){
        let timer = t.clone();

        timer.date(1);
        let day = timer.day();
        timer.date(-day);

        return timer;
    }

    isSameDay(dayA, dayB){

        return dayA.isSame(dayB, 'day')
    }

    //获取某月的天数
    getDays(t){

        return t.daysInMonth();
    }

}


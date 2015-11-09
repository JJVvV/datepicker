/**
 * Created by Alex a cool guy
 */





import React, {PropTypes} from 'react';
import moment from 'moment';
import Popover from './Pop.js';
import Calendar from './Calendar.js';
import Input from './Input.js';

export default class Datepicker extends React.Component{

    static defaultProps = {
        dateFormat: "YYYY-MM-DD",
        className: "datepicker__input",
        dateFormatAllDay: "YYYY-MM-DD",
        dateFormatNotAllDay: "YYYY-MM-DD H:mm",

        onBlur: function() {},
        allDay:false,
        date: '', // '' || new Date() || moment();
        minDate:null,
        maxDate: null,
        disabledDates: [],
        icon: true,
        onChange: () => {},
        initShowDate: true
    }


    state = {
        focus:false,
        date: moment(this.props.initShowDate ?(this.props.date || new Date()) : this.props.date),
        position:{}
    }

    constructor(props){
        super(props);
        this.hideCalendar = ::this.hideCalendar
    }

    componentWillMount(){

    }



    onInputClick(){

        this.setState({
            focus: true
        });
    }

    hide(){
        this.setState({
            focus: false
        });
    }
    onSelect(t){
        this.props.onChange && this.props.onChange(t);

        this.setState({
            date:moment.isMoment(t) ? t : moment(t)
        });
    }



    calendar(){
        if(this.state.focus){
            return (
                <Popover>

                    <Calendar
                        ref="calendar"
                        weekdays={this.props.weekdays}
                        locale={this.props.locale}
                        position={this.state.position}
                        moment={this.props.moment}
                        dateFormat={this.props.dateFormatCalendar}

                        date={this.state.date}
                        onSelect={::this.onSelect}
                        hideCalendar={this.hideCalendar}
                        minDate={this.props.minDate}
                        maxDate={this.props.maxDate}
                        excludeDates={this.props.excludeDates}
                        allDay = {this.props.allDay}
                        weekStart={this.props.weekStart}
                        minDate={this.props.minDate}
                        maxDate={this.props.maxDate}
                        disabledDates={this.props.disabledDates}
                        root={this}
                        />
                </Popover>
            );
        }
    }


    onBlur(e){
        if(moment(e.target.value, this.getDateFormat()).isValid()){

        }
    }


    getDateFormat(){
        return this.props.allDay ? this.props.dateFormatAllDay : this.props.dateFormatNotAllDay
    }

    render(){

        return (
            <div className="datepicker-container" ref="container">
                <Input
                    ref="input"
                    name={this.props.name}
                    date={this.state.date}
                    dateFormat={this.props.dateFormat}
                    dateFormatAllDay={this.props.dateFormatAllDay}
                    dateFormatNotAllDay={this.props.dateFormatNotAllDay}
                    focus={this.state.focus}

                    dateFormat={this.getDateFormat()}
                    allDay={this.props.allDay}
                    hide={::this.hide}
                    handleClick={::this.onInputClick}
                    setSelected={this.setSelected}
                    hideCalendar={this.hideCalendar}
                    onSelect={::this.onSelect}

                    placeholderText={this.props.placeholderText}
                    disabled={this.props.disabled}
                    className={this.props.className}
                    title={this.props.title}
                    readOnly={this.props.readOnly}
                    required={this.props.required}
                    onChange={::this.props.onChange}
                    onKeyDown={::this.onKeyDown}
                    onBlur={::this.onBlur}
                    initShowDate={this.props.initShowDate}

                    //onKeyDown={::}
                />
                {this.props.icon && <span className="feedback  icon-glyph-89" onClick={::this.focus}></span>}
                {this.calendar()}

            </div>
        );
    }

    componentDidMount(){
        document.addEventListener('click', this.hideCalendar);
    }

    componentWillUnmount(){
        document.removeEventListener('click', this.hideCalendar);
    }
    onKeyDown(e){
        //debugger;
        this.onSelect(e); // Cannot get property "valueOf" of null or undefined
    }
    hideCalendar(e){
        let container = this.refs.container.getDOMNode();
        if(!(e.target ===  container || container.contains(e.target) || (this.refs.calendar && (e.target === this.refs.calendar.calendar || this.refs.calendar.calendar.contains(e.target))))){
        this.setState({
            focus: false
        });
    }

    }

    focus(){
        try{
            this.refs.input.input.click();
        }catch(e){
            throw new Error("this.refs.input.input.click not exist");
        }
    }
}




Date.prototype.clone = function(){
    return new Date(+this);
}
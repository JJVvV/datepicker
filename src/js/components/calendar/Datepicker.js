/**
 * Created by Alex a cool guy
 */
import React, {PropTypes} from 'react';
import classnames  from 'classnames';
import PubSub from 'pubsub-js';
import {CHANGE_SLIDER, SLIDER_ACTIVE, S} from '../../constants/launchr.js';
import {sliderShow} from '../../services/slider.js';
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
        date: new Date()
    }

    state = {
        focus:false,
        selected: this.props.date,
        position:{}
    }

    constructor(props){
        super(props);

        this.hideCalendar = ::this.hideCalendar
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
        var timer = new Date(t.valueOf());
        this.setState({
            selected:timer
        });
    }
    setPosition(position){
        this.setState({
            position
        });
    }
    calendar(){
        if(this.state.focus){
            return (
                <Popover
                    attachment={this.props.popoverAttachment}
                    targetAttachment={this.props.popoverTargetAttachment}
                    targetOffset={this.props.popoverTargetOffset}>

                    <Calendar
                        weekdays={this.props.weekdays}
                        locale={this.props.locale}
                        position={this.state.position}
                        moment={this.props.moment}
                        dateFormat={this.props.dateFormatCalendar}

                        selected={this.state.selected}
                        onSelect={::this.onSelect}
                        hideCalendar={this.hideCalendar}
                        minDate={this.props.minDate}
                        maxDate={this.props.maxDate}
                        excludeDates={this.props.excludeDates}
                        allDay = {this.props.allDay}
                        weekStart={this.props.weekStart} />
                </Popover>
            );
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            selected: nextProps.date
        });
    }

    render(){
        //console.log('this.state.selected', this.state.selected);
        return (
            <div className="datepicker-container">
                <Input
                    name={this.props.name}
                    date={this.state.selected}
                    dateFormat={this.props.dateFormat}
                    dateFormatAllDay={this.props.dateFormatAllDay}
                    dateFormatNotAllDay={this.props.dateFormatNotAllDay}
                    focus={this.state.focus}
                    setPosition = {::this.setPosition}
                    //onFocus={this.handleFocus}
                    allDay={this.props.allDay}
                    hide={::this.hide}
                    handleClick={::this.onInputClick}
                    handleEnter={this.hideCalendar}
                    setSelected={this.setSelected}
                    clearSelected={this.clearSelected}
                    hideCalendar={this.hideCalendar}
                    placeholderText={this.props.placeholderText}
                    disabled={this.props.disabled}
                    className={this.props.className}
                    title={this.props.title}
                    readOnly={this.props.readOnly}
                    required={this.props.required}
                    onChange={::this.props.onChange}
                />
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

    hideCalendar(e){
        e.shouldShowCalendar ||
        this.setState({
            focus: false
        });
    }

}




Date.prototype.clone = function(){
    return new Date(+this);
}
/**
 * Created by Administrator on 2015/7/10.
 */

import React, { PropTypes } from 'react'
import $ from '../lib/daterangepicker.js';
import {TIME_ALLDAY, TIME_NOT_ALLDAY} from '../constants/launchr.js';




export default class InputCalendar extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      value:props.defaultValue || ''
    }
  }
  render(){
    return(
        <div className="input-group-wrapper">
          <div className="input-group">
            <div className="input-group-addon">
              <i className=" toolbar icon-glyph-89"></i>
            </div>
            <input ref="calendar" className="form-c place-input"  type="text" />
          </div>
        </div>
    );

  }

  componentDidUpdate(){
    this.$calendar.data('daterangepicker').remove();
    this.$calendar.daterangepicker({
      opens: 'left',
      timePicker: this.props.allDay,
      timePickerIncrement: 30,
      timePicker24Hour: true,
      singleDatePicker: this.props.singleDate,

      locale: {
        format: this._getTimerFormat(this.props.allday)
      }
    }).on('apply.daterangepicker', (e, picker) => {
      this.state.value = e.target.value;
      this.$calendar.val(e.target.value);

      this.props.daterangepicker && (this.props.daterangepicker(e, picker));
    });
    this.$calendar.val(this.state.value);
  }
  componentDidMount(){

    this.$calendar =  $(React.findDOMNode(this.refs.calendar));
   this.$calendar.daterangepicker({
      opens: 'left',
      timePicker: this.props.allDay,
      timePickerIncrement: 30,
      timePicker24Hour: true,
      singleDatePicker: this.props.singleDate,

      locale: {
        format: this._getTimerFormat(this.props.allday)
      }
    }).on('apply.daterangepicker', (e, picker) => {
      this.setState({
        value:e.target.value
      });
      this.props.daterangepicker && (this.props.daterangepicker(e, picker));
    });
    this.$calendar.val('');
    this.setState({value:''});
  }

  componentWillUnMount(){
    this.$calendar.data('daterangepicker').remove();
  }



  _getTimerFormat(allday) {
    return allday ? TIME_ALLDAY : TIME_NOT_ALLDAY;
  }
}
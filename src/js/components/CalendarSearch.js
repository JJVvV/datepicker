/**
 * Created by Tyrion on 2015/9/3.
 */
import React, {PropTypes} from 'react';
import classnames  from 'classnames';
import PubSub from 'pubsub-js';
import {CHANGE_SLIDER, SLIDER_ACTIVE, S} from '../constants/launchr.js';
import {sliderShow} from '../services/slider.js';

export default class CalendarSearch extends React.Component{
    render(){
        return(
            <span className="icon-glyph-115 calendar-action-search"  onClick={::this.showCalendarSearch} style={{display:'none'}}></span>
        )
    }
    showCalendarSearch(){
        sliderShow({type:S.CALENDAR_SEARCH});
    }
}
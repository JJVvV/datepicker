/**
 * Created by BennetWang on 2015/8/26.
 */
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {CHANGE_SLIDER, SLIDER_ACTIVE, S} from '../../constants/launchr.js';
import {sliderShow} from '../../services/slider.js';

import {schedule} from '../../i18n/index.js'

export default class ChatScheduleFooter extends React.Component{

    constructor() {
        super();
    }

    render(){
        const {name} = this.props;
        return (
            <div className="chat-area-footer-btn">
                <Link to={'/application/calendar'}><i className=" toolbar icon-glyph-76"></i><span>{schedule.AllSchedule}</span></Link>
                <a onClick={this._addNewSchedule.bind(this)}>
                    <i className=" toolbar icon-glyph-166"></i>
                    <span>{schedule.NewSchedule}</span>
                </a>

            </div>

        );
    }

    //新建日程
    _addNewSchedule() {
        sliderShow({
            type: S.EVENT
        });
    }
}
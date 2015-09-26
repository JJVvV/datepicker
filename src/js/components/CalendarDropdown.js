/**
 * Created by Administrator on 2015/7/10.
 */
/*
* application list item or people list item used in .sub-panel
 */

import React, {PropTypes} from 'react';
import classnames  from 'classnames';
import PubSub from 'pubsub-js';
import {CHANGE_SLIDER, SLIDER_ACTIVE, S} from '../constants/launchr.js';
import {sliderShow} from '../services/slider.js';

import {schedule} from '../i18n/index.js'

export default class CalendarDropdown extends React.Component {

  constructor() {
    super();
    this.state = {
      showDropdown:false
    };
  }

  render() {
    const {name, toggle, show} = this.props;

    return (
        <div className="dropdown">
          <span className="btn btn-default calendar-action-add"  onClick={::this.toggleDropdown}><i className="icon-glyph-166"></i>{schedule.AddNew}</span>
          {
            this.state.showDropdown &&
            <ul className="dropdown-list top" style={{top: "130%"}}>
              <li className="dropdown-item">
                <a href="javascript:;" onClick={::this.showEvent}>
                  <div className="circle-event"></div>
                  <span>{schedule.Event}</span>
                </a>
              </li>
              <li className="dropdown-item">
                <a href="javascript:;" onClick={::this.showMeeting}>
                  <div className="circle-meeting"></div>
                  <span>{schedule.Meeting}</span>
                </a>
              </li>
            </ul>

          }
        </div>

    );
  }

  toggleDropdown() {

    this.setState({
      showDropdown: !this.state.showDropdown
    });
  }

  hideDropdown(){
    this.setState({
      showDropdown: false
    });
  }
  showEvent(){
    this.hideDropdown();
    sliderShow({type:S.EVENT});

  }

  showMeeting(){
    this.hideDropdown();
   
    sliderShow({type:S.MEETING});
  }
}



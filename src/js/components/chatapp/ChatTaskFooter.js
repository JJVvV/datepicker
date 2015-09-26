/**
 * Created by ArnoYao on 2015/9/14.
 */

import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {CHANGE_SLIDER, SLIDER_ACTIVE, S} from '../../constants/launchr.js';
import {sliderShow} from '../../services/slider.js';
import {task} from '../../i18n/index.js';

export default class ChatTaskFooter extends React.Component {
    constructor() {
        super();
    }

    render() {
        const {name} = this.props;
        return <div className="chat-area-footer-btn">
            <Link to={'/application/task/ProjectManage'}>
                <i className=" toolbar icon-glyph-76"></i>
                <span>{task.All + name}</span>
            </Link>
            <a onClick={this._addNewTask.bind(this)}>
                <i className=" toolbar icon-glyph-166"></i>
                <span>{task.Add + name}</span>
            </a>
        </div>
    }

    //新建任务
    _addNewTask() {
        sliderShow({
            type: S.TASK_ADD
        });
    }
}
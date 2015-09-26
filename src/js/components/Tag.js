/**
 * Created by RichardJi on 2015/9/8.
 */

import React, { PropTypes , Component} from 'react/addons.js';
import classnames  from 'classnames';
import PubSub from 'pubsub-js';
import {getApproveStatus, approveShowDate,getApprovalDetail,getApproveTypeDetail} from '../services/approveService.js';
import {checkRespnseSuccess,packRespnseData} from '../services/msbService.js';
import {CHANGE_SLIDER, SLIDER_ACTIVE, S} from '../constants/launchr.js';
import {sliderShow} from '../services/slider.js';

export default class Tag extends React.Component {

    constructor(props) {
        super();
    }

    render() {
        return (
            <div className="approval-body">
                <div className="clearfix">
                    <div className="new-event-place pull-left">
                        <div className="event-input-group">
                            <input className="form-c" placeholder="查找标签"/>
                        </div>
                    </div>
                    <div className="new-event-switch pull-left">
                        <button className="btn btn-default">
                            <i className="icon-glyph-166 "></i>
                            <span className="btn-text">新增标签</span>
                        </button>
                    </div>
                </div>

                <div className="task-tag-box">

                    <div className="task-tag">
                        <div className="task-tag-group clearfix">
                            <span className="pull-left">设计</span>
                            <span className="pull-right">24</span>
                        </div>
                        <div className="task-tag-edit">
                            <i className=" toolbar icon-glyph-167 pull-right"></i>
                            <i className=" toolbar icon-glyph-77 pull-right"></i>
                        </div>
                    </div>

                    <div className="task-tag">
                        <div className="task-tag-group clearfix">
                            <span className="pull-left">研发</span>
                            <span className="pull-right">12</span>
                        </div>
                        <div className="task-tag-edit">
                            <i className=" toolbar icon-glyph-167 pull-right"></i>
                            <i className=" toolbar icon-glyph-77 pull-right"></i>
                        </div>
                    </div>

                    <div className="task-tag">
                        <div className="task-tag-group clearfix">
                            <span className="pull-left">商务</span>
                            <span className="pull-right">6</span>
                        </div>
                        <div className="task-tag-edit">
                            <i className=" toolbar icon-glyph-167 pull-right"></i>
                            <i className=" toolbar icon-glyph-77 pull-right"></i>
                        </div>
                    </div>

                    <div className="task-tag">
                        <div className="task-tag-group clearfix">
                            <span className="pull-left">Fostmourne</span>
                            <span className="pull-right">14</span>
                        </div>
                        <div className="task-tag-edit">
                            <i className=" toolbar icon-glyph-167 pull-right"></i>
                            <i className=" toolbar icon-glyph-77 pull-right"></i>
                        </div>
                    </div>

                    <div className="task-tag">
                        <div className="task-tag-group clearfix">
                            <span className="pull-left">售后服务</span>
                            <span className="pull-right">3</span>
                        </div>
                        <div className="task-tag-edit">
                            <i className=" toolbar icon-glyph-167 pull-right"></i>
                            <i className=" toolbar icon-glyph-77 pull-right"></i>
                        </div>
                    </div>

                    <div className="task-tag">
                        <div className="task-tag-group clearfix">
                            <span className="pull-left">Zeus</span>
                            <span className="pull-right">12</span>
                        </div>
                        <div className="task-tag-edit">
                            <i className=" toolbar icon-glyph-167 pull-right"></i>
                            <i className=" toolbar icon-glyph-77 pull-right"></i>
                        </div>
                    </div>

                    <div className="task-tag">
                        <div className="task-tag-group clearfix">
                            <span className="pull-left">移动端</span>
                            <span className="pull-right">16</span>
                        </div>
                        <div className="task-tag-edit">
                            <i className=" toolbar icon-glyph-167 pull-right"></i>
                            <i className=" toolbar icon-glyph-77 pull-right"></i>
                        </div>
                    </div>

                    <div className="task-tag">
                        <div className="task-tag-group clearfix">
                            <span className="pull-left">Sargeras</span>
                            <span className="pull-right">11</span>
                        </div>
                        <div className="task-tag-edit">
                            <i className=" toolbar icon-glyph-167 pull-right"></i>
                            <i className=" toolbar icon-glyph-77 pull-right"></i>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}




/**
 * Created by Tyrion on 2015/9/3.
 */
import React, { PropTypes , Component} from 'react/addons.js';
import classnames  from 'classnames';
import PubSub from 'pubsub-js';
import {CHANGE_SLIDER, S} from '../constants/launchr.js';

export default class SearchCalendar extends Component{
    render(){
        return(
            <div className="new-meeting-box">
                <div className="meeting-detail-header">
                    <span>搜索</span>
        
                        <i className="icon-glyph-167 pull-right" onClick={::this.props.onClose}></i>
        
                </div>

                <div className="meeting-box-body">
                    <div className="input-search-group ">
                        <div className="form-feedback left input-whole-width">
                            <input type="search" className="form-c" placeholder="搜索"/>
                            <span className="feedback  demo-icon icon-glyph-115" ></span>
                        </div>
                    </div>
                    <div className="search-box-group">
                        <div className="search-box-group-date"><span>8月4日</span><span>周一</span></div>
                        <div className="search-box-group-wrapper">
                        <div className="search-box-group-detail">
                            <i className=" toolbar icon-glyph-207 icon-place"></i>
                            <i className="wait">候</i>

                            <div className="time-detail-line">
                                <span className="time">14:30</span>
                                <span>与客户讨论项目详细</span>
                            </div>
                            <div className="time-detail-line">
                                <span className="place time">2小时前</span>
                                <span className="place">星爸爸咖啡店</span>
                            </div>
                        </div>
                    </div>
            
                    <div className="search-box-group-date"><span>8月4日</span><span>周一</span></div>
                    <div className="search-box-group-wrapper">
                        <div className="search-box-group-detail">
                            <i className=" toolbar icon-glyph-207 icon-place"></i>
                            <i className="wait">候</i>

                            <div className="time-detail-line">
                                <span className="time">14:30</span>
                                <span>与客户讨论项目详细</span>
                            </div>
                            <div className="time-detail-line">
                                <span className="place time">2小时前</span>
                                <span className="place">星爸爸咖啡店</span>
                            </div>
                        </div>
                        <div className="search-box-group-detail">
                    
                            <i className="emergency">重</i>

                            <div className="time-detail-line">
                                <span className="time">14:30</span>
                                <span>与客户讨论项目详细</span>
                            </div>
                            <div className="time-detail-line">
                                <span className="place time">2小时前</span>
                                <span className="place">星爸爸咖啡店</span>
                            </div>
                        </div>
                    </div>
            
                    <div className="search-box-group-date"><span>8月4日</span><span>周三</span></div>
                    <div className="search-box-group-wrapper">
                        <div className="search-box-group-detail">
                    
                            <i className="meeting">会</i>

                            <div className="time-detail-line">
                                <span className="time">14:30</span>
                                <span>与客户讨论项目详细</span>
                            </div>
                            <div className="time-detail-line">
                                <span className="place time">2小时前</span>
                                <span className="place">星爸爸咖啡店</span>
                            </div>
                        </div>
                    </div>
            
                    <div className="search-box-group-date"><span>8月8日</span><span>周五</span></div>
                    <div className="search-box-group-wrapper">
                        <div className="search-box-group-detail">
                    
                            <div className="time-detail-line">
                                <span className="time">全天</span>
                                <span>与客户讨论项目详细</span>
                            </div>
                            <div className="time-detail-line">
                                <span className="place time"></span>
                                <span className="place">大会议室</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}
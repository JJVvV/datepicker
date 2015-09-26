/**
 * Created by Administrator on 2015/7/10.
 */

import React, { PropTypes , Component} from 'react/addons.js';
import classnames  from 'classnames';
import PubSub from 'pubsub-js';
import request from 'reqwest';
import {REFRESH_EVENT, CHANGE_SLIDER,SLIEDER_ACTIVE, S,MESSAGE_APP_TYPE} from '../constants/launchr.js';
import moment from 'moment';
import {sliderShow} from '../services/slider.js';
import reduxContainer from '../services/reduxContainer.js';
import {GetEventDatail,postDeleteEvent,postNewEvent,postSureEvent} from '../services/scheduleService.js';
import {checkRespnseSuccess,packRespnseData} from '../services/msbService.js';
import {timeReversal} from '../services/meetingService.js';

import Comment from '../components/Comment.js';
import GoogleMapComponent from '../components/GoogleMapComponent.js';
import FileShowComponent from '../components/FileShowComponent.js';

import {schedule} from '../i18n/index.js'

import loading from './loading/Loading.js';

@loading
export default class EventDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showId: '',
            title: '',
            place: '',
            lngx: '',
            laty: '',
            isImportant: 0,
            isAllDay: 0,
            content: '',
            times: [],
            repeatType: 0,
            remindType: 0,
            initialStartTime: this.props.event.startTime,
            relateId: this.props.event.relateId,
            type: this.props.event.type,
            showEdit: false,
            showDelete: false,
            createUser:"",
            createUserName:"",
            //fileShowIds:[]
        };
    }

    componentDidMount() {
        this._requestDetail(this.props.event);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.event != this.props.event) {
            this._requestDetail(nextProps.event);
        }
    }

    render() {

        let timeList = this._dealTime();
        let isRepeat=this.state.repeatType != 0;

        let touUsers = [this.state.createUser];
        let toUserNames = [this.state.createUserName];

        return (
            <div className="new-meeting-box">
                <div className="meeting-detail-header">
                    <span>{schedule.EventDetail}</span>
                    <i className="icon-glyph-167 pull-right" onClick={this.props.onClose}></i>
                </div>

                <div className="meeting-box-body" style={{"padding-bottom": "17px;"}}>
                    <p className="meeting-detail-title">
                        <span className="title">{this.state.title}</span>
                    {
                        this.state.isImportant == 1 ? <span>
                            <span className="pull-right">{schedule.Important}</span>
                            <span className="circle pull-right"></span>
                        </span> : ""
                        }
                    </p>
                {timeList}
                </div>

                {
                    this.state.lngx != "" && this.state.lngx != undefined && this.state.laty != "" && this.state.laty != undefined ?
                        <div className="map-height">
                            <GoogleMapComponent lat={this.state.laty}  lng={this.state.lngx} showSearch={false}></GoogleMapComponent>
                        </div> : ""
                }


                <div className="meeting-box-body" style={{"padding-top": "5px;"}}>
                    <div className="meeting-place-detail-line">
                        <span>{this.state.place}</span>
                        <i className=" toolbar icon-glyph-207 pull-right"></i>
                    </div>

                    <p className="meeting-detail-topic">{this.state.content}</p>

                    {/*<FileShowComponent appShowID={'l6b3YdE9LzTnmrl7'} rmShowID={this.state.showId} loadAttachments={this._loadAttachments}></FileShowComponent>*/}

                    <Comment
                        appShowID={"l6b3YdE9LzTnmrl7"}
                        rmShowID={this.state.showId}
                        toUsers={touUsers}
                        toUserNames={toUserNames}
                        Title={this.state.title}
                        messageAppType={MESSAGE_APP_TYPE.EVENT_COMMENT}
                        ></Comment>

                </div>

            {this._isShowControl()}

            </div>
        )
    }

    //_loadAttachments(fileShowIds){
    //    this.setState({
    //        fileShowIds:fileShowIds
    //    });
    //}

    //动态生成
    _dealTime() {
        return this.state.times.map((time, index) => {
            let showTime = this._getTimeStr(time.start, time.end, this.state.isAllDay);
            if (this.state.type == 'event_sure') {
                return <div className="task-line">
                    <div className="task-detail-title ">
                        <span className="default">{schedule.StandbyTime} {index + 1}</span>
                    </div>
                       {showTime}
                    <div className="task-detail-checkbox">
                        <a onClick={this._sureEvent.bind(this, time)}>
                            <input type="checkbox"/>
                        </a>
                    </div>
                </div>
            } else {
                return <div className="meeting-detail-group">
                    <div classname="meeting-detail-line">
                        <i className="toolbar icon-glyph-89"></i>
                        <span>{showTime}</span>
                        <div className="task-detail-tips">
                        </div>
                    </div>
                </div>
            }
        });
    }

    _isShowControl() {
        let currentName = reduxContainer.get().getState().userinfo.me.loginName;
        let isRepeat = this.state.repeatType != 0;
        if (currentName == this.state.createUser) {
            if (isRepeat) {
                return <div className="meeting-detail-footer-btn">
                    <a>
                        <i className=" toolbar icon-glyph-71"></i>
                    </a>
                    <a onClick={::this._showEdit}>
                        <i className=" toolbar icon-glyph-77"></i>
                    {this.state.showEdit && (<ul className="dropdown-list bottom" style={{bottom: '86%'}}>
                        <li className="dropdown-item">
                            <a onClick={::this._editEvent}>
                                <span>{schedule.EditCurrentEvent}</span>
                            </a>
                        </li>
                        <li className="dropdown-item">
                            <a onClick={this._editEvent.bind(this,1)}>
                                <span>{schedule.EditAllEvent}</span>
                            </a>
                        </li>
                    </ul>)}
                    </a>
                    <a onClick={::this._showDelete}>
                        <i className=" demo-icon icon-trash-empty"></i>
                    {this.state.showDelete && (<ul className="dropdown-list bottom" style={{bottom: '86%'}}>
                        <li className="dropdown-item">
                            <a onClick={::this._deleteEvent}>
                                <span>{schedule.DeleteCurrentEvent}</span>
                            </a>
                        </li>
                        <li className="dropdown-item">
                            <a onClick={this._deleteEvent.bind(this,1)}>
                                <span>{schedule.DeleteAllEvent}</span>
                            </a>
                        </li>
                    </ul>)}
                    </a>
                </div>
            } else {
                return <div className="meeting-detail-footer-btn">
                    <a >
                        <i className=" toolbar icon-glyph-71"></i>
                    </a>
                    <a onClick={::this._editEvent}>
                        <i className=" toolbar icon-glyph-77"></i>
                    </a>
                    <a onClick={::this._deleteEvent}>
                        <i className=" demo-icon icon-trash-empty"></i>
                    </a>
                </div>
            }
        } else {
            return "";
        }
    }

    _getTimeStr(start, end, isAllDay) {
        let data = timeReversal(start, end, isAllDay);
        return (<div className="task-detail-maintitle">{data.currentDate} &nbsp;
            <span className="time">{isAllDay == 1 ? schedule.AllDay : data.intervalTime + schedule.Hours}</span>
        </div>);
    }

    //编辑弹出是否显示
    _showEdit() {
        this.setState({
            showDelete: false,
            showEdit: !this.state.showEdit
        });
    }

    //删除弹出是否显示
    _showDelete() {
        this.setState({
            showEdit: false,
            showDelete: !this.state.showDelete
        });
    }

    //获取详情
    _requestDetail(event) {
        this.props.loadingStart();
        GetEventDatail(event).then((res)=> {
            this.props.done();
            let data = packRespnseData(res);
            if (checkRespnseSuccess(res)) {
                this.setState(data.Data);
            } else {
                alert(data.Reason);
            }
        });
    }

    //确定候补
    _sureEvent(data) {
        this.props.loadingStart();
        postSureEvent(data.showId).then((res)=> {
            this.props.done();
            let retData = packRespnseData(res);
            if (checkRespnseSuccess(res)) {
                let times = [];
                times.push(data);
                this.setState({
                    times: times,
                    type: 'event'
                });
                PubSub.publish(REFRESH_EVENT, retData.Data);
            } else {
                alert(retData.Reason);
            }
        })
    }

    //删除
    _deleteEvent(type) {
        if (confirm(schedule.ConfirmDelete)) {
            let data=this.state;
            data.saveType=type==1?1:0;
            this.props.loadingStart();
            postDeleteEvent(data).then((res)=> {
                this.props.done();
                let retData = packRespnseData(res);
                if (checkRespnseSuccess(res)) {
                    this.props.onClose();
                    PubSub.publish(REFRESH_EVENT, retData.Data);
                } else {
                    alert(retData.Reason);
                }
            })
        }
    }

    //编辑
    _editEvent(type) {
        let data=this.state;
        data.saveType=type==1?1:0;
        sliderShow({
                type: S.EVENT,
                event: data
            }
        );
    }
}

Object.assign(EventDetail.prototype, React.addons.LinkedStateMixin);
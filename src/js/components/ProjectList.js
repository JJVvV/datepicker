/**
 * Created by ArnoYao on 2015/9/8.
 */

import React, { PropTypes , Component} from 'react/addons.js';
import classnames  from 'classnames';
import PubSub from 'pubsub-js';
import {CHANGE_SLIDER, SLIDER_ACTIVE, S} from '../constants/launchr.js';
import {sliderShow} from '../services/slider.js';
import {Link} from 'react-router';
import {FadeModal as Modal} from './boron/Boron.js';
import {REFRESH_PROJECT} from '../constants/launchr.js';
import $ from 'jquery';

import {checkRespnseSuccess,packRespnseData} from '../services/msbService.js';
import {getProjectList,postNewProject,getProjectDatail,deleteProject} from '../services/taskProjectService.js';
import NewProjectDetail from '../components/NewProjectDetail.js';
import {task} from '../i18n/index.js';

import loading from './loading/Loading.js';

@loading
export default class ProjectList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pageIndex: 0,
            pageSize: 10,
            searchKey: '',
            projectList: [],
            projectDetail: {}
        }
    }

    componentDidMount() {
        this._getProjectList();
        this.refreshProject= PubSub.subscribe(REFRESH_PROJECT, (eventName, data)=> {
            if (data) {
                this._getProjectList();
            }
        });
    }

    componentWillUnmount(){
        PubSub.unsubscribe(this.refreshProject);
    }

    render() {
        let projectHtml = this._getProjectShowList();
        return (
            <div className="approval-body">
                <div className="clearfix">
                    <div className="new-event-place pull-left">
                        <div className="event-input-group">
                            <input className="form-c" placeholder={task.FindProject} valueLink={this.linkState('searchKey')} onKeyUp={::this._getSearchList} />
                        </div>
                    </div>
                    <div className="new-event-switch pull-left">
                        <button className="btn btn-default" onClick={this._showModel.bind(this)}>
                            <i className="icon-glyph-166"></i>
                            <span className="btn-text">{task.NewProject}</span>
                        </button>

                        <Modal ref="modal">
                            <NewProjectDetail project={this.state.projectDetail} onClose={::this._hideModel} onConfirm={::this._onConfirm} />
                        </Modal>
                    </div>
                </div>
                <div className="approval-list">
                    <div className="task-enter-wrapper">
                            {projectHtml}
                    </div>
                </div>
            </div>
        )
    }

    //搜索
    _getSearchList() {
        this._getProjectList();
    }

    //获取项目列表
    _getProjectList() {
        let reqData = {
            pageIndex: this.state.pageIndex,
            pageSize: this.state.pageSize,
            searchKey: this.state.searchKey
        };
        this.props.loadingStart();
        getProjectList(reqData).then((res)=> {
            this.props.done();
            let resData = packRespnseData(res);
            if (checkRespnseSuccess(res)) {
                this.setState({
                    projectList: resData.Data || []
                })
            } else {
                alert(resData.Reason);
            }
        });
    }

    //绑定项目列表数据
    _getProjectShowList() {
        return this.state.projectList.map((project, index)=> {
            return <div className="task-enter-line pointer">
                <Link to={'/application/task/taskList/' + project.showId}>
                    <div className="task-line-header">
                        <div className="task-line-wrapper">
                            <h4>{project.name}</h4>
                            <i className="icon-glyph-77" onClick={this._getDetail.bind(this, project.showId)}></i>
                            <i className="icon-glyph-167" onClick={this._deleteProject.bind(this, project.showId)}></i>
                        </div>
                    </div>
                    <div className="task-line-detail">
                        <div className="task-line-detail-person">
                            <i className="demo-icon icon-glyph-13"></i>
                            <span>{project.teamNumber}</span>
                        </div>
                        <div className="task-line-detail-group">
                            <i className="icon-glyph-83"></i>
                            <span>{project.unFinishedTask}/{project.allTask}</span>
                        </div>
                    </div>
                </Link>
            </div>
        })
    }

    //显示弹出
    _showModel(data) {
        this.setState({
            projectDetail: data || {}
        });
        this.refs.modal.show();
    }

    //关闭弹出
    _hideModel() {
        this.refs.modal.hide();
    }

    //获取详情
    _getDetail(data) {
        let reqData = {
            showId: data
        };
        this.props.loadingStart();
        getProjectDatail(reqData).then((res)=> {
            this.props.done();
            let resData = packRespnseData(res);
            if (checkRespnseSuccess(res)) {
                let projectData = {
                    showId: resData.Data.showId || '',
                    name: resData.Data.name || '',
                    members: resData.Data.members||[]
                };
                this._showModel(projectData);
            } else {
                alert(resData.Reason);
            }
        });
        return false;
    }

    //保存或修改项目
    _onConfirm(data) {
        postNewProject(data).then((res)=> {
            let resData = packRespnseData(res);
            if (checkRespnseSuccess(res)) {
                this._hideModel();
                PubSub.publish(REFRESH_PROJECT, resData);
            } else {
                alert(resData.Reason);
            }
        })
    }

    //删除项目
    _deleteProject(data) {
        if (confirm(task.ComfirmDelete+'?')) {
            let reqData = {
                showId: data
            };
            deleteProject(reqData).then((res)=> {
                let resData = packRespnseData(res);
                if (checkRespnseSuccess(res)) {
                    PubSub.publish(REFRESH_PROJECT, resData);
                } else {
                    alert(resData.Reason);
                }
            })
        }
        return false;
    }
}

Object.assign(ProjectList.prototype, React.addons.LinkedStateMixin);


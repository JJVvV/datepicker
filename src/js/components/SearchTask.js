/**
 * Created by ArnoYao on 2015/9/11.
 */

import React, { PropTypes , Component} from 'react/addons.js';
import classnames  from 'classnames';
import PubSub from 'pubsub-js';
import {CHANGE_SLIDER, S} from '../constants/launchr.js';

import TaskSearchList from '../components/TaskSearchList.js';
import {getTaskSearchList} from '../services/taskProjectService.js';
import {checkRespnseSuccess,packRespnseData} from '../services/msbService.js';
import loading from './loading/Loading.js';

@loading
export default class SearchTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageIndex: 0,
            pageSize: 100,
            searchKey: '',
            projectId: this.props.task.projectId || '',
            type: this.props.task.type || 0,
            taskList: [],
            searchTitile:this._getSearchTitle(this.props.task.type)
        };
    }

    componentDidMount() {
        this._getTaskList();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.task.type != this.props.task.type) {
            let data = {
                pageIndex: this.state.pageIndex,
                pageSize: this.state.pageSize,
                searchKey: this.state.searchKey,
                projectId: this.state.projectId,
                type: nextProps.task.type
            };
            this._getTaskList(data);
            this.setState({
                type: nextProps.task.type,
                searchTitile: this._getSearchTitle(nextProps.task.type)
            });
        }
    }

    render() {
        return (
            <div className="new-meeting-box">
                <div className="meeting-detail-header">
                    <span>{this.state.searchTitile}</span>
                    <i className="icon-glyph-167 pull-right" onClick={::this._close}></i>
                </div>

                <div className="meeting-box-body">
                    <div className="">
                        <div className="form-feedback left input-whole-width">
                            <input type="search" className="form-c" placeholder="搜索" valueLink={this.linkState('searchKey')} onKeyUp={::this._searchTaskList} />
                            <span className="feedback  demo-icon icon-glyph-115"></span>
                        </div>
                    </div>
                    <div className="search-approval-list">
                        <TaskSearchList data={this.state.taskList} />
                    </div>
                </div>
            </div>
        )
    }

    //关闭滑动
    _close(){
        this.props.onClose && this.props.onClose();
    }

    //搜索
    _searchTaskList() {
        let data = {
            pageIndex: this.state.pageIndex,
            pageSize: this.state.pageSize,
            searchKey: this.state.searchKey,
            projectId: this.state.projectId,
            type: this.state.type
        };
        this._getTaskList(data);
    }

    //获取任务列表
    _getTaskList(data) {
        if (!data) {
            data = {
                pageIndex: this.state.pageIndex,
                pageSize: this.state.pageSize,
                searchKey: this.state.searchKey,
                projectId: this.state.projectId,
                type: this.state.type
            };
        }
        this.props.loadingStart();
        getTaskSearchList(data).then((res)=> {
            this.props.done();
            let retData = packRespnseData(res);
            if (checkRespnseSuccess(res)) {
                this.setState({
                    taskList: retData.Data
                })
            } else {
                alert(retData.Reason);
            }
        })
    }

    //根据类型获取查询的标题
    _getSearchTitle(data) {
        let title;
        switch (data) {
            case 3:
                title = '我参与的任务';
                break;
            case 4:
                title = '我发出的任务';
                break;
            case 100:
                title = '今天截止';
                break;
            case 101:
                title = '一周内截止';
                break;
            default :
                title = '搜索';
                break;
        }
        return title;
    }
}

Object.assign(SearchTask.prototype, React.addons.LinkedStateMixin);
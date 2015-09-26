/**
 * Created by Tyrion on 2015/9/2.
 */

import React, { PropTypes , Component} from 'react/addons.js';
import classnames  from 'classnames';
import PubSub from 'pubsub-js';
import {CHANGE_SLIDER, S} from '../constants/launchr.js';

import {getApproveSearchList} from '../services/approveService.js';
import {checkRespnseSuccess,packRespnseData} from '../services/msbService.js';
import ApprovalList from '../components/ApprovalList.js';
import {approve} from '../i18n/index.js';
//import throttling from '../common/throttling.js';
export default class SearchApproval extends Component{
    constructor(props) {
        super(props);
        this.state = {
            A_KEYWORD: '',
            A_ResultList:[]
        };

    }

    componentDidMount(){
        this._getApproveList();
    }

    render(){
        return(
            <div className="new-meeting-box">
                <div className="meeting-detail-header">
                    <span>{approve.search}</span>
                    
                    <i className="icon-glyph-167 pull-right" onClick={::this.props.onClose}></i>
                    
                </div>

                <div className="meeting-box-body">
                    <div className="">
                        <div className="form-feedback left input-whole-width">
                            <input type="search" className="form-c" placeholder={approve.search}  onKeyUp={::this._getApproveSearchList}  />
                            <span className="feedback  demo-icon icon-glyph-115"></span>
                        </div>
                    </div>
                    <div className="search-approval-list">
                        <ApprovalList data={this.state.A_ResultList} />
                    </div>
                </div>
            </div>
            )
    }

    _getApproveSearchList(e){
        //if(e.target.value.trim().length === 0) return;
        ::this._getApproveList(e.target.value);

    }

    _getApproveList(keyword){
        getApproveSearchList(keyword).then((res)=>{
            let retData = packRespnseData(res);
            if (checkRespnseSuccess(res)) {
                var result = [];
                var user = {};

                retData.Data.ResultApproveList.map((item, index)=>{
                    user[item.SHOW_ID] = item;
                });
                retData.Data.ResultTitleList.map((item, index)=>{
                    user[item.SHOW_ID] = item;
                });

                for(var u in user){
                    result.push(user[u]);
                }
                this.setState({"A_ResultList": result});
            } else {
                alert(retData.Reason);
            }
        });
    }
}


Object.assign(SearchApproval.prototype, React.addons.LinkedStateMixin);
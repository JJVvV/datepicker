/**
 * Created by Tyrion on 2015/9/3.
 */

import React, { PropTypes , Component} from 'react/addons.js';
import classnames  from 'classnames';
import PubSub from 'pubsub-js';
import {CHANGE_SLIDER, S,REFRESH_APPROVE} from '../constants/launchr.js';

import {getApproveSendList,getApproveUnreadMsg} from '../services/approveService.js';
import {checkRespnseSuccess,packRespnseData} from '../services/msbService.js';
import ApprovalList from '../components/ApprovalList.js';

export default class ApprovalIssue extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            A_ResultList:[]
        };
    }


    componentDidMount(){
    ::this._getApproveList();
        PubSub.subscribe(REFRESH_APPROVE, (eventName, data) => {
            ::this._getApproveList();
        });
    }

    render(){

        return(

            <div className="">
                <div className="approval-box-body">
                    <ApprovalList data={this.state.A_ResultList} />
                </div>
            </div>
        )
    }


    _getApproveList(){
        getApproveSendList().then((res)=>{
            let retData = packRespnseData(res);
            if (checkRespnseSuccess(res)) {
            ::this.setState({
                    A_ResultList:retData.Data
                });
            } else {
                alert(retData.Reason);
            }
        });
    }


}
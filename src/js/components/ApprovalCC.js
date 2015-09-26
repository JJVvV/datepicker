/**
 * Created by Tyrion on 2015/9/7.
 */
import React, {PropTypes} from 'react';
import classnames  from 'classnames';
import PubSub from 'pubsub-js';

import {getApproveReceiveList} from '../services/approveService.js';
import {checkRespnseSuccess,packRespnseData} from '../services/msbService.js';
import ApprovalList from '../components/ApprovalList.js';
import {CHANGE_SLIDER, SLIDER_ACTIVE, S,REFRESH_APPROVE} from '../constants/launchr.js';

export default class ApprovalCC extends React.Component{
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
            <div className="approval-body">
                <ApprovalList data={this.state.A_ResultList}  />
                </div>
            )
    }


    _getApproveList(){
        getApproveReceiveList("CC").then((res)=>{
            let retData = packRespnseData(res);
            if (checkRespnseSuccess(res)) {
                this.setState({
                    A_ResultList:retData.Data
                });
            } else {
                alert(retData.Reason);
            }
        });
    }

}
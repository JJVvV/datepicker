/**
 * Created by Tyrion on 2015/9/7.
 */
import React, {PropTypes} from 'react';
import classnames  from 'classnames';
import PubSub from 'pubsub-js';

import {CHANGE_SLIDER, S,REFRESH_APPROVE} from '../constants/launchr.js';
import {getApproveReceiveList} from '../services/approveService.js';
import {checkRespnseSuccess,packRespnseData} from '../services/msbService.js';
import ApprovalList from '../components/ApprovalList.js';
import {approve} from '../i18n/index.js';

export default class ApprovalHandle extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            selectActive:true,
            A_ResultList:[],
            msg:props.msg || []
        };

    }

    componentDidMount(){
        ::this._getApproveListByStatus(false);

        PubSub.subscribe(REFRESH_APPROVE, (eventName, data) => {
            let status = this.state.selectActive ? 'wait':'reade';
            ::this.toggleActive(status);
        });
    }

    render(){
        const {show}=this.props;
        return(
            <div>
             <nav className="approval-title approval-title-gap" style={{border:'none'}}>
                        <a href="javascript:;" className={classnames({'approval-title-item':true,'approval-title-left':true,'active':this.state.selectActive})} onClick={this.toggleActive.bind(this,'wait')} >
                            <span >{approve.pending}</span>
                        </a>
                        <a href="javascript:;" className={classnames({'approval-title-item':true,'approval-title-right':true,'active':!this.state.selectActive})} onClick={this.toggleActive.bind(this,'reade')} >
                            <span>{approve.processed}</span>
                        </a>
                    </nav>
                    <div className="approval-body">
                        <ApprovalList data={this.state.A_ResultList} isWait={this.state.selectActive} msg={this.state.msg} onChange={::this._onChange} />
                    </div>
                </div>
            )
    }

    _onChange(type, result){

    }

    getState(){
        let selectActive = this.selectActive(true);
    
        return {...selectActive};

    }

    selectActive(show){

        return{
            selectActive:show
        }
    }

    toggleActive(type){
        //let selectActive = !this.state.selectActive;
        let inner;
        switch(type){
            case 'wait':
                inner = true;
                break;
            case 'reade':
                inner = false;
                break;
        }
        ::this._getApproveListByStatus(!inner);
    }

    _getApproveListByStatus(isProcess) {
        getApproveReceiveList("APPROVE", isProcess ? 1 : 0).then((res)=>{
            let retData = packRespnseData(res);
            if (checkRespnseSuccess(res)) {
                this.setState({
                    A_ResultList:retData.Data,
                    selectActive:!isProcess
                });
            } else {
                alert(retData.Reason);
            }
        });
    }

}
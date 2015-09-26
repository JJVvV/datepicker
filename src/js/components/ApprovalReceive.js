/**
 * Created by Tyrion on 2015/9/3.
 */
import React, {PropTypes} from 'react';
import classnames  from 'classnames';
import PubSub from 'pubsub-js';
import ApprovalHandle from './ApprovalHandle.js';
import ApprovalCC from './ApprovalCC.js';
import {approve} from '../i18n/index.js';

export default class ApprovalReceive extends React.Component{
    constructor(props){
        super(props);
        this.state = this.getState();
        this.state.msgCount = props.msgCount;
    }
    render(){
        const {show}=this.props;
        return(
            <div  className="">
               {this.state.approvalChange?<ApprovalHandle  />:<ApprovalCC />}
                <div className="chat-area-footer-btn">
                    <a className={classnames({'active':this.state.approvalChange})} onClick={this.toggleChange.bind(this, 'handle')}><span>{approve.approve}</span></a>
                    <a className={classnames({'active':!this.state.approvalChange})} onClick={this.toggleChange.bind(this, 'cc')}><span className={this.props.msgCount > 0 && "chat-area-unread"}>{approve.cc}</span></a>
                </div>
            </div>
        )
    }

    getState(){
        let approvalChange = this.approvalChange(true);
        return {...approvalChange};
    }

    approvalChange(show){
        return{
            approvalChange:show
        }
    }

    _onRead(){
        if (this.state.msgCount > 0){
            this.setState({
                msgCount:this.state.msgCount - 1
            });
        }
    }

  toggleChange(value){
      let inner;
      switch(value){
          case 'handle':
              inner = true;
              break;
          case 'cc':
              inner = false;
              break;
      }
      this.setState({
          approvalChange:inner
      });
  }
}
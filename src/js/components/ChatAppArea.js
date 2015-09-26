/**
 * Created by BennetWang on 2015/8/26.
 */
import React, {PropTypes} from 'react';
import $ from 'jquery';
import ChatAppTitle from './ChatAppTitle.js';
import actionContainer from '../services/actionContainer.js';
import reduxContainer from '../services/reduxContainer.js';

import ChatScheduleContent from './chatapp/ChatScheduleContent.js'
import ChatScheduleFooter from './chatapp/ChatScheduleFooter.js';
import ChatApproveContent from './chatapp/ChatApproveContent.js'
import ChatApproveFooter from './chatapp/ChatApproveFooter.js';
import ChatTaskContent from './chatapp/ChatTaskContent.js';
import ChatTaskFooter from './chatapp/ChatTaskFooter.js';

import {Scrollbars} from './scrollbar';


export default class ChatArea extends React.Component{

    constructor(){
        super();
        this.state= {
            content: '',
            message:[]
        }
    }
  
    componentDidUpdate(){
        //$(".chat-content").scrollTop($(".chat-content")[0].scrollHeight);
    }

    componentDidMount(){
        window.addEventListener('resize', (e) => {
            //let chatHeight = window.innerHeight - 71 -
            //this.setState({
            //    chatHeight:
            //});
        })
    }



    render() {
        const {messages, name,code} = this.props.chat;
        const hasPerson = name && name.length;
        let Content=::this._Content(code);
        let footer=::this._Footer(code);

        return (
            <div className="chat-area global-detail-area">
                <div className="chat-area-inner" >
                <ChatAppTitle name={name} />

                <Scrollbars style={{height: this._scrollHeight()}}>
                    <div className="chat-content" ref="content" >
                        {
                            messages.map(function(item,index){
                                return React.cloneElement(
                                    Content,
                                    {
                                        message: item
                                    }
                                )
                            })
                        }
                    </div>
                </Scrollbars>


                    {
                        React.cloneElement(
                            footer,
                            {
                                name: name
                            }
                        )
                    }
                </div>
            </div>
        );
    } 
    _Content(code){
        switch(code){
            case 'Schedule':
                return <ChatScheduleContent></ChatScheduleContent>;
                break;
            case 'Approve':
                return <ChatApproveContent></ChatApproveContent>;
                break;
            case 'Task':
                return <ChatTaskContent></ChatTaskContent>
                break;
        }
    }
    _Footer(code){
        switch(code){
            case 'Schedule':
                return <ChatScheduleFooter></ChatScheduleFooter>;
                break;
            case 'Approve':
                return <ChatApproveFooter></ChatApproveFooter>;
                break;
            case 'Task':
                return <ChatTaskFooter></ChatTaskFooter>
                break;
        }

    }
    _scrollHeight(){
        oHeight=$(document.body).height()-117;

        return oHeight;
    }
}


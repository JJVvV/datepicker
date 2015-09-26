/**
 * Created by Administrator on 2015/7/10.
 */
/*
 * application list item or people list item used in .sub-panel
 */

import React, {PropTypes} from 'react';
import classnames  from 'classnames';
import reduxContainer from '../services/reduxContainer.js';
import { ReplaceUnified } from './chatface/Emoji.js';
import {ThreadListDate} from '../services/dateService.js';
import { CHAT_MESSAGE_TYPE} from '../constants/launchr.js';


export default class ThreadItem extends React.Component {


    render() {
        const {timer, avator, title, active, info, threadID, count} = this.props.item;
        let   infoDetail =((info)=>{
            switch(info.type){
                case  CHAT_MESSAGE_TYPE.IMAGE:
                   return '[ 图片 ]';
                case  CHAT_MESSAGE_TYPE.AUDIO:
                    return '[ 语音 ]';
                default :
                    return ReplaceUnified(typeof(info)=="string"?info:(info.content||""));
            }
        })(info);
        return (
            <li className={classnames({'thread-item': true, 'active': active})}
                onClick={this.props.clickItem.bind(null, threadID, title)}>
                <div className="thread-item-func">
                    <div className="tip"> {typeof(timer) == "number" && ThreadListDate(timer) || timer}</div>
                </div>
                <div className="thread-item-avator avator">
                    <img src={avator} alt="" width="40" height="40"/>
                    {this.generateCount(count)}

                </div>
                <div className="thread-item-info">
                    <h4>{title}</h4>

                    <p dangerouslySetInnerHTML={{__html: infoDetail}}></p>
                </div>
            </li>
        );
    }

    generateCount(count) {
        return count && count > 0 ? (<i className="circle-tip">{count}</i>) : '';
    }
}




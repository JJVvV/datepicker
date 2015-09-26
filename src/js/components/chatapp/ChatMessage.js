/**
 * Created by Administrator on 2015/7/10.
 */
/*
 * application list item or people list item used in .sub-panel
 */

import React, {PropTypes} from 'react';
import classnames  from 'classnames';
import Bubble from './Bubble.js';
import {ThreadListDate,CommentListDate} from '../../services/dateService.js';

export default class ChatMessage extends React.Component {


    render() {
        const {showTime}=this.props;
        const {timer, avator, name, info, me, ...otherProps} = this.props.message;
        return (
            <li className={classnames({'chat-message': true, me: me, you:!me})}>
                {showTime &&
                <p className="chat-message-time">
                    <time>{CommentListDate(timer)}</time>
                </p>}
                {me || <img src={avator} alt="" className="chat-message-avator" width="40" height="40"/>}
                <div className="chat-message-content">
                    {me ||
                    <h4 className="chat-message-name">
                        {name}
                    </h4>}

                    <Bubble {...otherProps} right={me} info={info} changeStar={this.props.changeStar.bind(this)}/>
                    <h4 className="chat-message-sendTime">
                        {typeof(timer) == "number" && ThreadListDate(timer) || timer}
                    </h4>
                </div>

            </li>
        );
    }

}




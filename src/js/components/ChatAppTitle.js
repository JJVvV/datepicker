/**
 * Created by BennetWang on 2015/8/26.
 */
import React, {PropTypes} from 'react';

export default class ChatAppTitle extends React.Component{

    constructor(){
        super();

    }

    render(){
        const {name} = this.props;
        return (
            <div>
                <div className="chat-title" >
                    <span className="chat-title-name">{name+'消息'}</span>
                </div>
            </div>

        );
    }

}
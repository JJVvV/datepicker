/**
 * Created by BennetWang on 2015/9/2.
 */
import React, {PropTypes} from 'react';
import {splitTitle} from '../services/messageService.js';

export default class ChatAppSystemMessage extends React.Component{

    constructor(){
        super();

    }
    render() {
        let {title,content}=this.props;
        //let titlearray=splitTitle(info.content,info.title);
        let titlearray=splitTitle(title,content);
        return (
            <div className="message-bubble">
                <div className="inner-box click" onClick={this.props.click}>
                    {
                        titlearray.map(function(value,i){
                            return  <span className={value==title?'click':'person'}>{value}</span>
                        })
                    }
                </div>
            </div>
        );
    }
}
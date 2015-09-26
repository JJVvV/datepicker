/**
 * Created by JetslyLi on 2015/9/10.
 */

import React, {PropTypes} from 'react';
import {ImagePath,EmojiItems} from './Emoji.js';


export default class ChatFacePanel extends React.Component {
    _clickFace(item){
        this.props.chooseFace({
            ...item,
            url:ImagePath(item.unicode)
        });
    }
    render() {
        let Items = EmojiItems.map(item=> (
            <span onClick={this._clickFace.bind(this,item)}><img className="emoji"
                       title={item.title}
                       src={ImagePath(item.unicode)}
                       data-code={item.code}/></span>
        ));
        return (
            <div className="chat-face-panel">
                <div className="chat-face-header">
                    <span className="chat-face-header-item active"><img className="emoji"
                                                                        src={ImagePath('1f600')}/></span>
                </div>
                <div className="chat-face-body">
                    <div className="chat-face-body-item emoji">
                        {Items}
                    </div>
                </div>
            </div>
        )
    }
}
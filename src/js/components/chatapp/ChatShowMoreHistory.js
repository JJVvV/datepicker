import React, { PropTypes } from 'react';
import { CHAT_CONST_STR} from '../../constants/chat.js';

export default  class ChatShowMoreHistory extends React.Component {
    render() {
        return (
            <li className="chat-show-more-history">
                <span onClick={this.props.showMoreMessage}><i
                    className="icon-glyph-101"></i>&nbsp;&nbsp;{CHAT_CONST_STR.SHOW_MORE_HISTORY}</span>
            </li>
        )
    }
}
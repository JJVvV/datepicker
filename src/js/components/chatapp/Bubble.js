/**
 * Created by Administrator on 2015/7/10.
 */

import React, { PropTypes ,Component} from 'react'
import classnames  from 'classnames';
import { Base64 } from 'js-base64';
import _ from 'lodash';
import { ReplaceUnified } from './../chatface/Emoji.js';
import  _muplayer from '../../lib/player.js';
import { CHAT_URL_ATTACHMENT,CHAT_URL_AUDIO_ATTACHMENT,CHAT_MESSAGE_TYPE} from '../../constants/launchr.js';
import actionContainer from '../../services/actionContainer.js';

export default class Bubble extends Component {

    constructor(props) {
        super(props);
    }


    playerMp3(item) {
        let realUrl = [CHAT_URL_AUDIO_ATTACHMENT, Base64.encode(_.trim(item.fileUrl, '/'))].join('');
        player.stop().setCur(realUrl).off("player:play").on('player:play', ()=> {
            //console.log("start");
        }).off("ended").on("ended", ()=> {
            //console.log("end");
            player.remove(player.getCur());
        }).play();
    }

    modifyBookMark(event) {
        let action = actionContainer.get();
        (this.props.bookMark === 1 ? action.delBookMark : action.addBookMark)(this.props.msgId).then(res=> {
            this.props.changeStar(this.props.msgId, res);
        });
    }

    renderInfo(info) {
        if (info.type == CHAT_MESSAGE_TYPE.TEXT) {
            return <pre dangerouslySetInnerHTML={{__html: ReplaceUnified(info.content)}}></pre>;
        }
        let infoDetail = (()=> {
            let item = JSON.parse(info.content);
            switch (info.type) {
                case  CHAT_MESSAGE_TYPE.IMAGE:
                    return <img title={item.fileName} src={CHAT_URL_ATTACHMENT + item.thumbnail}/>;
                case  CHAT_MESSAGE_TYPE.AUDIO:
                    return (
                        <div className="audio-message" onClick={this.playerMp3.bind(this,item)}>
                            <i className="demo-icon icon-glyph-43"></i>
                            <span className="audio-length">{item.audioLength}&quot;</span>
                        </div>
                    );
                default :
                    return <div></div>;
            }
        })();
        return <pre>{infoDetail}</pre>;
    }

    render() {
        const {right, info,unReadCount,loadIng} = this.props;
        let havStar = (this.props.bookMark === 1);
        return (
            <div className={classnames({bubble: true, left: !right, right: right})}>
                {this.renderInfo(info)}
                {right && unReadCount == 0 && <i className="icon-readed icon-glyph-168"></i>}
                {right && loadIng && <i className="icon-loading icon-glyph-123"></i>}
                <i className={classnames('icon-star',{'icon-glyph-126':!havStar,'icon-glyph-186 added':havStar})}
                   onClick={this.modifyBookMark.bind(this)}></i>
                {/*<i className="icon-fail"></i>*/}
            </div>
        );
    }
}
import React from 'react';
import classnames  from 'classnames';
import _ from 'lodash';
import { ReplaceUnified } from './../chatface/Emoji.js';
import chatAction from '../../actions/chat.js';
import {ThreadListDate} from '../../services/dateService.js';
import { CHAT_MESSAGE_TYPE,CHAT_URL_ATTACHMENT,MESSAGE_RECORD} from '../../constants/launchr.js';
import {Scrollbars} from '../scrollbar';

const STATE_STR = {
    LOOKMSG: '查看前后消息'
}
class ChatMessageRecordTitle extends React.Component {
    render() {
        return (
            <div className="chat-message-record-title">
                <ul>{_.map(this.props.items, (item, i)=>(
                    <li onClick={this.props.click.bind(this,item)} key={i}
                        className={classnames({'active':item.active})}>{item.name}</li>
                ))}</ul>
            </div>
        )
    }
}
class ChatMessageRecordMenu extends React.Component {
    render() {
        return (
            <div className="chat-message-record-menu">
                <ul>{_.map(this.props.items, (item, i)=>(
                    <li onClick={this.props.click.bind(this,item)} key={i}
                        className={classnames({'active':item.active})}>{item.name}</li>
                ))}</ul>
            </div>
        )
    }
}
class ChatMessageRecordPanel extends React.Component {
    _scrollHeight() {
        return document.body.clientHeight - 110;
    }

    renderOperation(item) {
        let msgType = this.props.msgType;
        return (
            <div className="record-opearation">
                {item.bookMark === 1 && <i className='icon-glyph-186  icon-star' onClick={this.props.removeStar.bind(this,item)} ></i>}
                {item.bookMark==undefined&&msgType == CHAT_MESSAGE_TYPE.BOOKMARK &&<i className='icon-glyph-186  icon-star'  onClick={this.props.removeStar.bind(this,item)}></i>}
                {msgType == CHAT_MESSAGE_TYPE.BOOKMARK &&
                <i className="icon-glyph-34  icon-jump" title={STATE_STR.LOOKMSG}
                   onClick={this.props.clickItem.bind(this,item)}></i> }
            </div>
        )
    }

    renderChildInfo(items) {
        items = _.filter(items, n=>(n.type != CHAT_MESSAGE_TYPE.ALERT));
        let msgType = this.props.msgType;
        return _.map(items, (item, i)=> {
            let infoDetail = info=> {
                switch (info.type) {
                    case  CHAT_MESSAGE_TYPE.IMAGE:
                        let imageInfo = JSON.parse(info.content);
                        return (
                            <div className="image-message">
                                <img width="50px" title={imageInfo.fileName}
                                     src={CHAT_URL_ATTACHMENT + imageInfo.thumbnail}/>
                                {this.renderOperation(item)}
                            </div>
                        );
                    case  CHAT_MESSAGE_TYPE.AUDIO:
                        let audioInfo = JSON.parse(info.content);
                        return (
                            <div className="audio-message">
                                <i className="demo-icon icon-glyph-43"></i>
                                <span className="audio-length">{audioInfo.audioLength}&quot;</span>
                                {this.renderOperation(item)}
                            </div>
                        );
                    default :
                        return (
                            <div className="text-message">
                                <span dangerouslySetInnerHTML={{__html: ReplaceUnified(info.content)}}></span>
                                {this.renderOperation(item)}
                            </div>
                        );
                }
            };
            return (
                <li className="record-msg" key={i}>
                    <img className="record-avatar" src="/redux-launchr/public/img/zhangqiuyan.jpg"/>

                    <div className="record-detail">
                        <div>
                            {infoDetail(item)}
                        </div>
                        <div>
                            <span>{item.nickName}</span>
                            <span className="right-tips">{ThreadListDate(item.createDate)}</span>
                        </div>
                    </div>
                    <div className="record-clearfix"></div>
                </li>
            );
        });
    }

    renderChildImage(items) {
        return _.map(this.props.items, (item, i)=> {
            let imageInfo = JSON.parse(item.content);
            return (
                <li className="record-image" key={i}>
                    <img width="150px" title={imageInfo.fileName}
                         src={CHAT_URL_ATTACHMENT + imageInfo.thumbnail}/>
                    <span className="record-image-info">
                        <span>来自{item.nickName}</span>
                        <span className="record-image-time">{ThreadListDate(item.createDate)}</span>
                    </span>
                </li>
            );
        });
    }

    renderChild(items, msgType) {
        if (msgType === CHAT_MESSAGE_TYPE.IMAGE) {
            return this.renderChildImage(items);
        }
        return this.renderChildInfo(items);
    }

    render() {
        return (
            <div className="chat-message-record-panel">
                <Scrollbars style={{height:this._scrollHeight()}} onScroll={this.props.scrollLoad.bind(this)}>
                    <ul>
                        {this.renderChild(this.props.items, this.props.msgType)}
                    </ul>
                </Scrollbars>
            </div>
        )
    }
}


export default class ChatMessageRecord extends React.Component {

    constructor(props) {
        super();
        this.state = {
            title: MESSAGE_RECORD.TITLE,
            menu: MESSAGE_RECORD.MENU,
            currentType: props.type
        }
    }

    componentWillMount() {
        this.props.showHistory();

    }

    componentWillUnmount() {
        this.props.clearHistory();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            menu: _.map(this.state.menu, n=>({
                ...n,
                active: n.type == nextProps.type
            })),
            currentType: nextProps.type
        });
    }

    clickItem(item, event) {
        if (this.state.currentType == CHAT_MESSAGE_TYPE.BOOKMARK) {
            this.props.clickItemHistory(item);
        }
    }

    render() {
        const {historyMessage}=this.props;
        return (
            <div>
                <ChatMessageRecordTitle items={this.state.title} click={this.chooseTitle.bind(this)}/>
                <ChatMessageRecordMenu items={this.state.menu} click={this.chooseMenu.bind(this)}/>
                <ChatMessageRecordPanel msgType={this.state.currentType} items={historyMessage}
                                        removeStar={this.props.removeStar.bind(this)}
                                        clickItem={this.clickItem.bind(this)}
                                        scrollLoad={this.scrollLoad.bind(this)}/>
            </div>
        )
    }

    scrollLoad(event, id) {
        let scrollValue = event.target.scrollTop + event.target.clientHeight;
        let scrollHeight = event.target.scrollHeight;
        if (scrollValue == scrollHeight) {
            this.props.addHistory();
        }
    }

    chooseTitle(item) {
        this.props.clearHistory();
        this.setState({
            currentType: null
        })
    }

    chooseMenu(item) {
        if (this.state.currentType != item.type) {
            this.props.changeHistory(item.type);
        }
    }
}
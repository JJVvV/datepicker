import React, {PropTypes,ReactCSSTransitionGroup } from 'react';
import ChatFacePanel from '../chatface/ChatFacePanel.js';
import ContentEditable from './ContentEditable.js';
import WebUploader from '../../lib/webuploader.js';
import reduxContainer from '../../services/reduxContainer.js';
import actionContainer from '../../services/actionContainer.js';
import jQuery from'jquery';
import {ENTER,CHAT_URL_UPLOAD} from '../../constants/launchr.js';

export default class ChatInputPanel extends React.Component {
    constructor() {
        super();
        this.state = {
            content: '',
            showFacePanel: false
        }
    }
    componentDidMount(){
        uploader=WebUploader.create({
            server: CHAT_URL_UPLOAD,
            pick:{
                id: '#chatFilePicker',
                innerHTML: '<i class="toolbar icon-glyph-118"></i>',
                multiple:false
            },
            duplicate:true,
            formData:{
                type1:"Image",
                to:this.props.chat.currentThreadID,
                from:reduxContainer.me().id,
                info: '{"nickName":"' + reduxContainer.me().name + '"}',
                clientMsgId:+new Date()
            },
            resize: false,
            auto: true
        }).on('uploadSuccess',function(file,response){

            //if(checkRespnseSuccess(response)){
            //  var responseData=packRespnseData(response);

            // this._sendComemntUploadFile(file.name,comment.filePath,comment.showID);
            // }
        }.bind(this));
    }
    render() {
      return (
          <div className="chat-send">
              <div className="chat-send-toolbar">
                  {this.state.showFacePanel && <ChatFacePanel chooseFace={this._chooseFace.bind(this)}/>}
                        <span className="toolbar chat-send-toolbar-records" onClick={this.props.showHistory.bind(this)}>
                          <i className="icon-glyph-101"></i><span>聊天记录</span>
                        </span>
                  <i className="toolbar icon-glyph-10 active" onClick={this._showFace.bind(this)}></i>
                  <span className="feedback-icon "  id="chatFilePicker"></span>
                  {/*<i className=" toolbar icon-glyph-118"></i>*/}
                  <i className=" toolbar icon-glyph-207"></i>
                  <i className=" toolbar icon-app"></i>
              </div>
              <ContentEditable className="chat-send-content" info={this.state.content}
                               onSendMessage={::this.sendMessage}></ContentEditable>

              <div className="chat-send-action clearfix">
                  <span className="chat-send-action-tip">按Enter键发送消息</span>
                  <span className="btn btn-default" onClick={::this._sendMessage}>发送</span>
              </div>
              {/*<Emotion />*/}
          </div>
      )
    }

    sendMessage(content) {
        if (typeof content === 'string' && content.trim().length > 0) {
            content=content.replace(/(<br\/>)?<\/p><p[^>]*>/g, '\n')
                .replace(/<img[^>]*>/g,function(img){
                    return [jQuery(img).attr('data-unicode')].join('');
                })
                .replace(/<p><\/p>/g, '')
                .replace(/<br\/>/g, '\n');
            content= jQuery(content).text();
            actionContainer.get().sendMessage(content).then((a) => {
                //this.setState({
                //    content: ''
                //});
                UM.getEditor('myEditor').setContent('');
            });
        }
        //let message = {avator:"/redux-launchr/public/img/zhangqiuyan.jpg", id:2, name:"听说", info:'', timer: "17:02", me: true};
        //message.info = this.state.content;
    }

    _sendMessage(){
        let content= UM.getEditor('myEditor').getContent();
        this.sendMessage(content);
    }

    _chooseFace(item) {
        let editor= UM.getEditor('myEditor');
        let empty=editor.getContentLength();
        editor.execCommand('insertHtml', "<img src='" + item.url + "' data-unicode='"+item.code+"' class='emoji'/>", false);
        if(!empty){
            editor.setContent(editor.getContent().replace('<br/>',''));
        }
        this.setState({
            showFacePanel: false
        });
    }

    _showFace() {
        this.setState({
            showFacePanel: !this.state.showFacePanel
        })
    }
}
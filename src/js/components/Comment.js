/**
 * Created by BennetWang on 2015/8/26.
 */
import React from 'react';
import WebUploader from '../lib/webuploader.js'
import {getCommentList,sendComment,removeComment} from '../services/commentService.js'
import {checkRespnseSuccess,packRespnseData} from '../services/msbService.js'
import {arrayfind} from '../services/arrayService.js';
import generateUniqueID from '../services/uniqueIDService.js'
import {CommentListDate} from '../services/dateService.js';
import reduxContainer from '../services/reduxContainer.js';
import _ from 'lodash';

let uploader=null;

export default class Comment extends React.Component{

    constructor(props){
        super(props);
        //{
        //    id:"",
        //    showID:"",
        //    creatUserName:"bennetwang",
        //    content:file.name,
        //    filePath:"",
        //    percent:0,
        //    createTime:+new Date()
        //    isAttachment=true,
        //}
        this.state={
            pageIndex:1,
            pageSize:10,
            timeStamp:0,
            comments:[],
            currentComment:""
        };
    }
    componentDidMount(){

        uploader=WebUploader.create({
            server: '/Base-Module/Annex/Mobile',
            pick:{
                id: '#commentFilePicker',
                innerHTML: '<i class="toolbar icon-glyph-118"></i>',
                multiple:false
            },
            duplicate:true,
            formData:{
                appShowID:this.props.appShowID
            },
            resize: false,
            auto: true
        }).on('fileQueued',function(file){

            let comment={
                    id:generateUniqueID(),
                    showID:file.id,
                    creatUserName:reduxContainer.me().name,
                    creatUser:reduxContainer.me().loginName,
                    content:file.name,
                    filePath:"",
                    isComment:true,
                    percent:0,
                    isAttachment:true,
                    createTime:0
            };
            let comments=_.cloneDeep(this.state.comments);

            comments.unshift(comment);
            this.setState({
                comments:comments
            });

        }.bind(this)).on('uploadProgress',function(file, percentage){
                let comments=_.cloneDeep(this.state.comments);
                let comment=arrayfind(comments,function(item,index,array){
                    return item.showID==file.id;
                });
                comment.percent=Math.round(percentage*100);
                this.setState({
                    comments:comments
                });

        }.bind(this)).on('uploadSuccess',function(file,response){
            if(checkRespnseSuccess(response)){
                var responseData=packRespnseData(response);
                let comments=_.cloneDeep(this.state.comments);
                let comment=arrayfind(comments,function(item,index,array){
                    return item.showID==file.id;
                });
                comment.showID=responseData.Data.ShowID;
                comment.percent=100;
                comment.filePath=responseData.Data.path;
                this.setState({
                    comments:comments
                });
                this._sendComemntUploadFile(file.name,comment.filePath,comment.showID);
            }
        }.bind(this));

        let requestData={
            appShowID:this.props.appShowID,
            rm_ShowID:this.props.rmShowID,
            pageIndex:1,
            pageSize:10,
            timeStamp:0
        }

        this._getCommentList(requestData);
    }

    componentWillReceiveProps(nextProps){
        let {appShowID,rmShowID}=nextProps;

        if(appShowID!=this.props.appShowID || rmShowID!=this.props.rmShowID){
            uploader.option("formData",{
                appShowID:appShowID
            });

            let requestData={
                appShowID:appShowID,
                rm_ShowID:rmShowID,
                pageIndex:1,
                pageSize:10,
                timeStamp:0
            }

            this._getCommentList(requestData);
        }

    }

    render() {

      return (
          <div>
              <div className="meeting-chat-group">
                  {
                        this.state.comments.map(function(item,index){
                            let content=null;

                            if(item.isAttachment!=undefined && item.isAttachment){
                                if(item.filePath!=undefined && item.filePath!="" && item.filePath!=null){
                                    content=(
                                            <div className="meeting-chat-detail">
                                                <a href={item.filePath} target="_blank">
                                                    <i className="toolbar icon-glyph-118"></i>
                                                    <span>{item.content}</span>
                                                </a>
                                                {
                                                    this._generateRemove(item)
                                                }

                                            </div>);
                                }
                                else{
                                    content= (<div className="meeting-chat-detail">
                                                <span>
                                                    <div className="affix-rate" style={{width:item.percent+'%'}}></div>
                                                    <i className="toolbar icon-glyph-118"></i>
                                                    <span>{item.content}</span>
                                                    <div className="affix-tips">
                                                        <span className="rate-num">{item.percent}%</span>
                                                        <i className=" icon-glyph-194"></i>
                                                    </div>
                                                 </span>
                                            </div>);
                                }

                            }
                            else {
                                content=(
                                            <div className="meeting-chat-detail">
                                                    <span>{item.content}</span>
                                                    {
                                                        this._generateRemove(item)
                                                    }
                                            </div>
                                        );
                            }

                            return (
                                <div className="meeting-chat-line" key={item.id}>
                                    <div className="meeting-chat-menber" >
                                        <span>{item.creatUserName}:</span>
                                    </div>
                                    {content}
                                    <div className="meeting-chat-time" >{this._commentDateFormat(item.createTime)}</div>
                                </div>);

                      }.bind(this))
                  }
              </div>

              <div className="meeting-group-wrapper">

                  <div className="comment">
                      <span className="attach-btn  icon-magnifier" id="commentFilePicker"></span>
                      <div className="input-group">
                          <div className="form-feedback">
                              <input type="search" className="form-c"  ref="comment" value={this.state.currentComment} onChange={this._commentChange.bind(this)} />
                              <span className="feedback icon-magnifier comment-btn" onClick={this._sendCommentClick.bind(this)}>评论</span>
                          </div>
                      </div>
                  </div>

              </div>
          </div>
      );

    }

    componentWillUnmount(){
        //<div className="form-feedback both-item " >
        //    <input type="search" className="form-c" type="text" ref="comment" value={this.state.currentComment} onChange={this._commentChange.bind(this)} />
        //    <span className="feedback-icon " id="commentFilePicker"></span>
        //    <span className="feedback-comment"  onClick={this._sendCommentClick.bind(this)}>评论</span>
        //</div>
        uploader.destroy();
        uploader=null;
    }

    _generateRemove(comment){
        if(reduxContainer.me().loginName==comment.creatUser && comment.isComment){
            return (
                <div className="affix-tips" onClick={this._removeComment.bind(this,comment)}>
                    <i className=" icon-glyph-194"></i>
                </div>
            )
        }
        else{
            return null;
        }
    }

    _commentChange(event){
        this.setState({
            currentComment:event.target.value
        });

    }

    _commentDateFormat(createTime){
        if(createTime==0){
            return "";
        }

        return CommentListDate(createTime);
    }

    _getCommentList(requestData){
        if(requestData.appShowID!="" && requestData.rm_ShowID!=""){
            getCommentList(requestData).then(res=>{

                if(checkRespnseSuccess(res)){
                    var response=packRespnseData(res);
                    var comments=response.Data.map(function(item,index){
                            return {
                                id:generateUniqueID(),
                                showID:item.showID,
                                creatUserName:item.creatUserName,
                                creatUser:item.creatUser,
                                content:item.content,
                                filePath:item.filePath,
                                isComment:item.isComment==1,
                                percent:100,
                                createTime:item.createTime,
                                isAttachment:item.filePath!=undefined && item.filePath!=null && item.filePath!="",
                            };
                    });
                    this.setState({
                        comments:comments
                    });

                }
            });
        }

    }

    _sendCommentClick(){
        let {appShowID,rmShowID,toUsers,toUserNames,Title,messageAppType}=this.props;

        let requestData={
            appShowID:appShowID,
            rm_ShowID:rmShowID,
            comment:this.state.currentComment,
            toUsers:toUsers,
            toUserNames:toUserNames,
            Title:Title,
            messageAppType:messageAppType,
            isNotSubscribe:1
        };
        this._sendCommentRequest(requestData);

    }

    _sendComemntUploadFile(fileName,filePath,fileShowID){
        let {appShowID,rmShowID,toUsers,toUserNames,Title,messageAppType}=this.props;
        let requestData={
            appShowID:appShowID,
            rm_ShowID:rmShowID,
            comment:fileName,
            filePath:filePath,
            fileShowID:fileShowID,
            toUsers:toUsers,
            toUserNames:toUserNames,
            Title:Title,
            messageAppType:messageAppType,
            isNotSubscribe:1
        };
        this._sendCommentRequest(requestData);
    }

    _sendCommentRequest(requestData){
        sendComment(requestData).then(res=>{
            if(checkRespnseSuccess(res)){
                var response=packRespnseData(res);

                let comments=_.cloneDeep(this.state.comments);

                let comment=null;
                if(requestData.fileShowID!=undefined){
                     comment=arrayfind(comments,function(item,index,array){
                        return item.showID==requestData.fileShowID;
                    });
                    comment.showID=response.Data.showID;
                    comment.createTime=response.Data.createTime;
                }
                else{
                     comment={
                        id:generateUniqueID(),
                        showID:response.Data.showID,
                        creatUserName:response.Data.creatUserName,
                        creatUser:response.Data.creatUser,
                        content:response.Data.content,
                        filePath:"",
                        isComment:true,
                        percent:0,
                        createTime:response.Data.createTime,
                        isAttachment:false
                    };
                    comments.unshift(comment);

                    this.setState({
                        currentComment:""
                    });
                }

                this.setState({
                    comments:comments
                });
                this.props.sendCommentCallBack?this.props.sendCommentCallBack(comment):""
            }
        });
    }

    _removeComment(comment,event){
        let requestData={
            showID:comment.showID
        };
        removeComment(requestData).then(res=>{
            if(checkRespnseSuccess(res)){
                var response=packRespnseData(res);
                let comments=_.cloneDeep(this.state.comments);
                _.remove(comments,function(item){
                      return   item.showID==response.Data.showID;
                });
                this.setState({
                    comments:comments
                });
            }
        });
    }
}

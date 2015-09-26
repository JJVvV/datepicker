/**
 * Created by BennetWang on 2015/9/11.
 */

import React,{ Component} from "react";
import classnames  from 'classnames';
import WebUploader from '../lib/webuploader.js'
import {checkRespnseSuccess,packRespnseData} from '../services/msbService.js'
import generateUniqueID from '../services/uniqueIDService.js'
import {arrayfind} from '../services/arrayService.js';
import _ from 'lodash';
import {loadAttachmentList} from '../services/attachmentService.js'

let uploader=null;
export default class FileUploadComponent extends React.Component{

    constructor(props){
        super(props);
        this.state={
            attachments:[]
        }
        //let attachment={
        //    id:"",
        //    fileID:"",
        //    ShowID:"",
        //    fileName:"",
        //    filePath:"",
        //    percent:""
        //}
    }
    componentWillUnmount(){
        uploader.destroy();
        uploader=null;
    }
    componentDidMount(){
         uploader=WebUploader.create({
            server: '/Base-Module/Annex/Mobile',
            pick:{
                id: '#filePicker',
                innerHTML: '<div class="approval-add-affix"><i class="toolbar icon-glyph-118"></i><span>添加附件</span></div>',
                multiple:false
            },
            formData:{
                appShowID:this.props.appShowID
            },
            resize: false,
            auto: true
        }).on('fileQueued',function(file){
            let fileItem={
                id:generateUniqueID(),
                fileID:file.id,
                fileName:file.name,
                percent:0
            }
             let attachments=_.cloneDeep(this.state.attachments);
             attachments.push(fileItem);
             this.setState({
                 attachments:attachments
             });

        }.bind(this)).on('uploadProgress',function(file, percentage){
            let attachments=_.cloneDeep(this.state.attachments);
            let attachment=arrayfind(attachments,function(item,index,array){
                 return item.fileID==file.id;
             });
            attachment.percent=Math.round(percentage*100);
            this.setState({
                 attachments:attachments
            });


        }.bind(this)).on('uploadSuccess',function(file,response){
             if(checkRespnseSuccess(response)){
                 var responseData=packRespnseData(response);
                 this.props.addFile(responseData.Data.ShowID);
                 let attachments=_.cloneDeep(this.state.attachments);
                 let attachment=arrayfind(attachments,function(item,index,array){
                     return item.fileID==file.id;
                 });
                 attachment.ShowID=responseData.Data.ShowID;
                 attachment.percent=100;
                 attachment.filePath=responseData.Data.path;
                 this.setState({
                     attachments:attachments
                 });


             }

        }.bind(this));

        this._loadAttachmentList({appShowID:this.props.appShowID,rmShowID:this.props.rmShowID});
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.appShowID!=this.props.appShowID || nextProps.rmShowID!=this.props.rmShowID){
            this._loadAttachmentList({appShowID:nextProps.appShowID,rmShowID:nextProps.rmShowID});
        }
    }
    render () {
        return (
            <div>
                <div className="new-approve-attachment-group" id="filePicker">

                </div>

                <div>
                    {
                        this.state.attachments.map(function(item,index){
                            return (
                                <div  className={classnames("new-meeting-affix",{"dash-line":item.percent==100})}>
                                     {
                                        this._renderPercentLine(item)
                                     }
                                    <a href={item.filePath} target="_blank">{item.fileName}</a>
                                      <i className="icon-glyph-194 remove-this" onClick={this._removeFile.bind(this,item)}></i>
                                     {
                                        this._renderPercentNum(item)
                                     }
                                </div>
                            )
                        }.bind(this))
                    }
                </div>
            </div>
        );
    }

    _renderPercentLine(item){
        return item.percent>0 && item.percent<100?(
            <div className="rate-line" style={{width:item.percent+"%"}}></div>
        ):null
    }

    _renderPercentNum(item){
        return item.percent>0 && item.percent<100?<span className="affix-rate">{item.percent+"%"}</span>:""
    }

    _removeFile(item,event){

        if(item.fileID!=""){
            uploader.removeFile(item.fileID,true);
        }

        let newAttachments=_.cloneDeep(this.state.attachments);
        if(item.percent>0 && item.percent<100){
             _.remove(newAttachments,function(file){
                return item.fileID==file.fileID;
            });
        }
        else{
             _.remove(newAttachments,function(file){
                return item.ShowID==file.ShowID;
            });
            this.props.removeFile?this.props.removeFile(item.ShowID):"";
        }

        this.setState({
            attachments:newAttachments
        });
    }

    _loadAttachmentList(requestData) {
        if (requestData.appShowID && requestData.rmShowID ) {
            loadAttachmentList(requestData.appShowID, requestData.rmShowID).then(res=> {
                if (checkRespnseSuccess(res)) {
                    let responseData = packRespnseData(res);
                    let attachments = responseData.Data.map(function (item, index) {
                        return {
                            id: generateUniqueID(),
                            fileID: "",
                            ShowID: item.ShowID,
                            fileName: item.title,
                            filePath: item.path,
                            percent: 100
                        }
                    });

                    let fileShowIds = responseData.Data.map(function (item, index) {
                        return item.ShowID;
                    });
                    this.props.loadAttachments ? this.props.loadAttachments(fileShowIds) : "";
                    this.setState({
                        attachments: attachments
                    });

                }
            });
        }
    }
}
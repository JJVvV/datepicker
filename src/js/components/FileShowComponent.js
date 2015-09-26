/**
 * Created by BennetWang on 2015/9/11.
 */
import React,{ Component} from "react";
import {loadAttachmentList,getAttachmentIconClass} from '../services/attachmentService.js'
import {checkRespnseSuccess,packRespnseData} from '../services/msbService.js'
export default class FileShowComponent extends React.Component{

    constructor(props){
        super(props);

        this.state={
            attachments:[]
        }
    }
    componentDidMount(){
        this._loadAttachmentList({appShowID:this.props.appShowID,rmShowID:this.props.rmShowID});

    }
    componentWillReceiveProps(nextProps){
        if(nextProps.appShowID!=this.props.appShowID || nextProps.rmShowID!=this.props.rmShowID){
            this._loadAttachmentList({appShowID:nextProps.appShowID,rmShowID:nextProps.rmShowID});
        }

    }
    render () {

        if(this.state.attachments.length<=0){
            return null
        }
        return (
            <div className="meeting-line">
                <div className="attend-title pull-left"><span>附件</span>
                </div>
                <div className="attend-meeting-detail">
                    {
                        this.state.attachments.map(function(item,index){
                            return (
                                <div className="meeting-detail-line">
                                    <i className={"toolbar "+getAttachmentIconClass(item.title)}></i>
                                    <a href={item.path} target="_blank"><span className="affix-download">{item.title}</span></a>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        );
    }

    _loadAttachmentList(requestData){
        if(requestData.appShowID!="" && requestData.rmShowID!=""){
            loadAttachmentList(requestData.appShowID,requestData.rmShowID).then(res=>{
                if(checkRespnseSuccess(res)){
                    let responseData=packRespnseData(res);

                    this.setState({
                        attachments:responseData.Data
                    });
                    let fileShowIds=responseData.Data.map(function(item,index){
                        return item.ShowID;
                    });
                    //this.props.loadAttachments?this.props.loadAttachments(fileShowIds):"";

                }
            });
        }

    }
}
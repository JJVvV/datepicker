/**
 * Created by BennetWang on 2015/9/11.
 */
import request from 'reqwest';

export function loadAttachmentList(appShowID,rmShowID){
    return request({
        url:'/Base-Module/Annex',
        method: 'Get',
        type: "json",
        contentType: "application/json",
        data: {
            showID:rmShowID,
            appShowID:appShowID
        }
    })
}

export function getAttachmentIconClass(fileName){
        let extension="";
        if(fileName!=null && fileName!=undefined && fileName.length>0 && fileName.lastIndexOf('.')>0){
            extension=fileName.substring(fileName.lastIndexOf('.'),fileName.length).toLowerCase();
        }
        let retClass="";
        switch(extension){
            case ".png":
            case ".bmp":
            case ".jpeg":
            case ".jpg":
            case ".gif":
                retClass="icon-file-image";
                break;
            case ".doc":
            case ".docx":
                retClass="icon-file-word";
                break;
            case ".xls":
            case ".xlsx":
                retClass="icon-file-excel";
                break;
            case ".ppt":
            case ".pptx":
                retClass="icon-file-powerpoint";
                break;
            case ".pdf":
                retClass="icon-file-pdf";
                break;
            case ".txt":
                retClass="icon-doc-text";
                break;
            default :
                retClass="icon-attention-alt"
        }
    return retClass;
}
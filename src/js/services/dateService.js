/**
 * Created by BennetWang on 2015/8/24.
 */
import moment from 'moment';

export function ThreadListDate(date){
    return moment(date).format('HH:mm')
}

export function CommentListDate(date){
    let currentClientDate= +new Date();
    let currentSpan=currentClientDate-date;

    if(currentSpan<=1000){
            return "刚刚";
    }
    else if(currentSpan<=1000*60){
        return Math.round(currentSpan/1000)+"秒前";
    }
    else if(currentSpan<=1000*60*60){
        return Math.round(currentSpan/(1000*60))+"分钟前";
    }
    else if(moment(currentClientDate).format('YYYY-MM-DD')==moment(date).format('YYYY-MM-DD')){
        return "今天 "+moment(date).format('HH:mm')
    }
    else if(moment(currentClientDate).format('YYYY-MM-DD')==moment(date).add(1, 'day').format('YYYY-MM-DD')){
        return "昨天 "+moment(date).format('HH:mm')
    }
    else{
        return moment(date).format('MM-DD HH:mm');
    }

}

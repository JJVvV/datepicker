/**
 * Created by AlexLiu on 2015/8/21.
 */

import React from 'react';
import NewEvent from '../components/NewEvent.js';
import NewMeeting from '../components/NewMeeting.js';
import NewMeetingFilter from '../components/NewMeetingFilter.js';
import MeetingDetail from '../components/MeetingDetail.js';
import EventDetail from '../components/EventDetail.js';
import SearchApproval from '../components/SearchApproval.js';
import NewApproval from '../components/NewApproval.js';
import SearchCalendar from '../components/SearchCalendar.js';
import ApprovalDetail from '../components/ApprovalDetail.js';
import SearchTask from '../components/SearchTask.js';
import TaskAdd from '../components/ProjectTaskAdd.js';
import TaskDetail from '../components/ProjectTaskDetail.js';
import {S} from '../constants/launchr.js';

export default function getSliderContent(data){

    let sliderChild;


    switch(data.type){
        case S.EVENT:
            sliderChild = <NewEvent event={data.event}/>;
            break;
        case S.MEETING:
            sliderChild = <NewMeeting meeting={data.meeting} />;
            break;
        case S.MEETING_FILTER:
            sliderChild = <NewMeetingFilter meeting={data.meeting} />;
            break;
        case S.MEETING_DETAIL:
            sliderChild = <MeetingDetail meeting={data.meeting} />;
            break;
        case S.EVENT_DETAIL:
            sliderChild = <EventDetail event={data.event} />;
            break;
        case S.APPROVAL_SEARCH:
            sliderChild = <SearchApproval approval={data.approval} />;
            break;
        case S.APPROVAL_PLUS:
            sliderChild = <NewApproval approval={data.approval} />;
            break;
        case S.APPROVAL_DETAIL:
            sliderChild = <ApprovalDetail approval={data.approval} />;
            break;
        case S.CALENDAR_SEARCH:
            sliderChild= <SearchCalendar calendar={data.calendar} />;
            break;
        case S.TASK_SEARCH: //搜索任务
            sliderChild= <SearchTask task={data.task} />;
            break;
        case S.TASK_ADD:
            sliderChild= <TaskAdd task={data.task} />;
            break;
        case S.TASK_DETAIL:
            sliderChild= <TaskDetail task={data.task}  />;
            break;
        default :
            sliderChild = <div></div>;
    }
    return sliderChild;
}
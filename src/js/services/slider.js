/**
 * Created by AlexLiu on 2015/8/21.
 */

//与事件相关

import PubSub from 'pubsub-js';
import {CHANGE_SLIDER, SLIDER_ACTIVE, S} from '../constants/launchr.js';


export function sliderShow(data){
    PubSub.publish(CHANGE_SLIDER, data);
    PubSub.publish(SLIDER_ACTIVE);
}



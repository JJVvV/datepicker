// combine all reducer
import {combineReducers} from 'redux';
import chat,{chatReducer} from './chat';
import userinfo from './contract';
const rootReducer = combineReducers({
    chat,
    userinfo,
    chatReducer
});

export default rootReducer;

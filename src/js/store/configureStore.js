/**
 * Created by AlexLiu on 2015/8/18.
 */

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

const createStoreWithMiddleware = applyMiddleware(
    thunk
)(createStore);

export default function configureStore(initialState) {
    return createStoreWithMiddleware(rootReducer, initialState);
}
/**
 * Created by Administrator on 2015/7/10.
 */

import {Promise} from 'es6-promise';
import reqwest from 'reqwest';
import * as constant from '../constants/articles.js';

const MAIN_URL = 'asdkasdlfkj';

export function login(){

  return dispatch => {
    Promise.resolve( reqwest({
      url: `${MAIN_URL}/login`
    }))

    .then(res => JSON.parse)
    .then(res => {
        if(res.result){
          dispatch({
            type: constant.USER,
            user: res
          })
        }
      })

    .catch(err => {

        const res = {
          result: true,
          user:{
            username: 'alex',
            jwt: 'alexjwt'
          }
        }
        dispatch({
          type: 'LOGIN',
          user: res
        });
      });
  }
}


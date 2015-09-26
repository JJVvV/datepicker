import assign from 'object-assign'
//import * as types from '../constants/articles.js';

const initialState = {
  username:null,
  password:null,
  jwt:'',
  isLogin: false
};

export default function login(state = initialState, action={}){
  const user = assign({}, initialState, action.user);
  user.isLogin = !!user.username;
  return user;
}

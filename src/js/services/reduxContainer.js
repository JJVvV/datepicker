/**
 * Created by Administrator on 2015/7/24.
 */

var _redux;

export default {
  set: (redux) => _redux = redux,
  get: () => _redux,
  chat: () => _redux.getState().chat,
  me: () => _redux.getState().userinfo.me
}
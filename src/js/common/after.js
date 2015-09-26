/**
 * Created by Administrator on 2015/7/25.
 */

// function.after

if(typeof Function.prototype.after === 'undefined'){
  Function.prototype.after = function(fn){
    return (...args) => {
      var returnValue = this(...args);
      if(returnValue){
        return fn.apply(this, args);
      }
      return returnValue;
    }
  }
}
export default {}
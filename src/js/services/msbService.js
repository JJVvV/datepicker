/**
 * Created by BennetWang on 2015/8/25.
 */

export function checkRespnseSuccess(res){
        return res.Header.IsSuccess && res.Body.response.IsSuccess;
}

export function packRespnseData(res){
        if(checkRespnseSuccess(res)){
            return {
                Reason:"",
                TotalCount:res.Body.response.TotalCount,
                Data:res.Body.response.Data
            }
        }
        else{
            return {
                Reason:res.Body.response.Reason,
                TotalCount:0,
                Data:null
            }
        }

}
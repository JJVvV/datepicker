/**
 * Created by BennetWang on 2015/8/24.
 */

import {arrayfind} from './arrayService.js'

export function getcontractUserInfoByID(contracts, id){
    return arrayfind(contracts,(value,index,array)=>{
        return value.id==id;
    });
}
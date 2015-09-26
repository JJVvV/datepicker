/**
 * Created by AllenFeng on 2015/8/24.
 */

//与事件相关
import React from 'react';
import request from 'reqwest';
import {EVENT_TIME_FORMAT} from '../constants/launchr.js';
import {Promise} from 'es6-promise';





//获取树中的人
function  getPerson() {
    return request({
        url:'/Base-Module/CompanyUser/GetList'
    });
}
//获取树中的部门
function getSection(){
    return request({
        url:'/Base-Module/CompanyDept/GetList'
    });
}

//树遍历
function loopTree(tree, callback, name, parent){
    tree.forEach((t, i) => {
        //t.parent = parent;
        callback(t, i);
        if(t[name]){
            loopTree(t[name], callback, name, t);
        }
    });
}

export function loopTreeForLaunchr(...args){
    return loopTree(...args, 'children');
}

//通过ID定位
export function getPositionByID(tree, id){
    let result;
    loopTreeForLaunchr(tree, (t, i) => {
        if(t.id === id){
            result = tree;
        }
    });
}

function combineSectionPerson(sectionList, personList){

    loopTreeForLaunchr(sectionList, (section, i) => {
        personList.forEach((person, j) => {
            if(person.U_DEPT_ID == section.SHOW_ID){
                section.children.push(person);
            }
        });
    });
    return sectionList;
}

//平面数据转换成树

/*
 *      const ID = "id",
 *      TEXT = 'text',
 *      PID = 'pid';
 */

export function toTreeData(data, ID, PID, parentSectionID = ''){
    var pos={};
    var tree=[];
    var i=0;
    let dataI;
    //let parentSectionID = '';
    while(data.length!=0){

        if(data[i][PID] == parentSectionID){
            dataI = data[i];
            tree.push({
                id:data[i][ID],
                children:[],
                ...dataI
            });

            pos[data[i][ID]]=[tree.length-1];
            data.splice(i,1);
            i--;
        }else{
            var posArr=pos[data[i][PID]];
            if(posArr!=undefined){

                var obj=tree[posArr[0]];
                for(var j=1;j<posArr.length;j++){
                    obj=obj.children[posArr[j]];
                }
                dataI = data[i];
                obj.children.push({
                    id:data[i][ID],
                    children:[],
                    ...dataI
                });
                pos[data[i][ID]]=posArr.concat([obj.children.length-1]);
                data.splice(i,1);
                i--;
            }
        }
        i++;
        if(i>data.length-1){
            i=0;
        }
    }
    return tree;
}

function addPersonToSession(sectionList, personList){
    let sessionMap = {},
        list;
    personList.forEach((person) => {
        list = sessionMap[person.U_DEPT_ID] = sessionMap[person.U_DEPT_ID] || [];
        list.push(person);
    });

}

export function getSectionPersionTree(){
    let promiseSection = getSection();
    let promisePerson = getPerson();
    return Promise.all([promiseSection, promisePerson])
        .then(([section, person]) => {

            if(section.Header.IsSuccess && person.Header.IsSuccess)
                return combineSectionPerson(toTreeData(section.Body.response.Data || [], 'SHOW_ID', 'D_PARENTID_SHOW_ID', '35b11f42f4522d8923'), person.Body.response.Data || []);
            else
                throw new Error('getSectionPersion');
        })

        .catch((err) => {
            console.log(err);
        });
}


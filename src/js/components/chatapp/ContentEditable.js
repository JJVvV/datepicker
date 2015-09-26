/**
 * Created by Administrator on 2015/7/10.
 */

import React, { PropTypes } from 'react'
import { Component } from 'react';
import jQuery from'jquery';
import umeditor from '../../lib/umeditor.js';
import {ENTER} from '../../constants/launchr.js';
let editor=null;
export default class ContentEditable extends Component {
    componentDidMount() {
        var that = this;
         editor = UM.getEditor('myEditor',{
            toolbar:[]
            ,focus:true
            ,zIndex : 900
            ,initialFrameWidth: '90%'
            ,initialFrameHeight:70 
            ,initialStyle:''
        });
        editor.addListener('keypress', function (n, t) {
                if (t.keyCode === ENTER) {
                    (that.props.onSendMessage || (()=>{}))(this.getContent());
                    t.preventDefault();
                    t.stopPropagation();
                }
                if (t.keyCode === 10) {
                    var i = this.selection.getRange().txtToElmBoundary(!0);
                    jQuery("<p><\/p>").insertAfter(i.endContainer).html(UM.browser.ie ? "" : "<br/>");
                    this.focus(!0);
                }
            }
        );
    }
    componentWillUnmount(){
        UM.delEditor('myEditor');
    }

    render() {
        return (
            <script type="text/plain" id="myEditor">
            </script>
        );
    }
}
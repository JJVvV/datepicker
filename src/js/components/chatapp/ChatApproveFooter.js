/**
 * Created by TyrionKong on 2015/9/14.
 */
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {sliderShow} from '../../services/slider.js';
import {CHANGE_SLIDER, S} from '../../constants/launchr.js';
import {approve} from '../../i18n/index.js';

export default class ChatApproveFooter extends React.Component{

    constructor(){
        super();

    }

    render(){
        const {name} = this.props;
        return (
            <div className="chat-area-footer-btn">
                <Link to={'/application/approval'}><i className=" toolbar icon-glyph-76"></i><span>{approve.all+name}</span></Link>
                <a onClick={::this.showPlusApproval}>
                    <i className=" toolbar icon-glyph-166"></i>
                    <span>{approve.new+name}</span>
                </a>

            </div>

        );
    }
     showPlusApproval(){
        sliderShow({type:S.APPROVAL_PLUS});
    }
}
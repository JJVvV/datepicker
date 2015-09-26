/**
 * Created by Alex a cool guy
 */
import React, {PropTypes} from 'react';
import classnames  from 'classnames';
import PubSub from 'pubsub-js';
import {CHANGE_SLIDER, SLIDER_ACTIVE, S} from '../../constants/launchr.js';
import {sliderShow} from '../../services/slider.js';
import moment from 'moment';
var aa = moment;
const WEEK_NUM = 42;
export default class Pop extends React.Component{

    static defaultProps = {
        hourGap: 1,
        minuteGap:1,
        selected: new Date()
    }

    state = {
        selected: new Date(),
        timer: new Date(),
        hour:this.props.selected.getHours(),
        minute:this.props.selected.getMinutes()
    }
    constructor(props){
        super(props);

    }

    componentDidMount(){
        this.renderPop();
    }
    componentDidUpdate(){
        this.renderPop();
    }
    renderPop(){
        React.render( this.popoverComponent(), this.popElement );
    }

    popoverComponent(){
        var className = this.props.className;
        return (
            <div className={className}>
                {this.props.children}
            </div>
        );
    }

    componentWillMount(){
        var popContainer = document.createElement('div');
        popContainer.className = 'calendar-container';

        this.popElement = popContainer;
        document.querySelector('body').appendChild(this.popElement);
    }

    componentWillUnmount(){
        React.unmountComponentAtNode(this.popElement);
        this.popElement.parentNode.removeChild(this.popElement);
    }




    render(){
        return <div />
    }



}




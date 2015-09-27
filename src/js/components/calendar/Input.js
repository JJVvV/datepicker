/**
 * Created by Alex a cool guy
 */
import React, {PropTypes} from 'react';
import classnames  from 'classnames';
import PubSub from 'pubsub-js';
import {CHANGE_SLIDER, SLIDER_ACTIVE, S} from '../../constants/launchr.js';
import {sliderShow} from '../../services/slider.js';
import moment from 'moment';
import $ from 'jquery';

export default class Input extends React.Component{

    static defaultProps = {

        dateFormat:'',
        className: "datepicker__input",
        onBlur: function() {}
    }


    constructor(props){
        super(props);

    }

    formatValue(){
        return  moment(+this.props.date).format(this.props.dateFormat);
    }

    cancelBubble(e){
        this.initDocumentClick();
        e.shouldShowCalendar = true;
        //e.cancelBubble = true;
    }

    initDocumentClick(){
        var ev = document.createEvent('HTMLEvents');
        ev.initEvent('click', false, true);
        document.dispatchEvent(ev);
    }
    componentDidMount(){
        this.input = React.findDOMNode(this.refs.input);
        this.input.addEventListener('click', ::this.cancelBubble);
        this.$input = $(this.input);

    }

    setPosition(){
        var offset = this.$input.offset();
        offset.top += 10 + this.input.offsetHeight;
        this.props.setPosition(offset);
    }
    componentWillUnmount(){
        this.input.removeEventListener('click', ::this.cancelBubble);
    }
    handleChange(...args){

    }

    onChange(e){


    }

    handleClick(...args){
        this.setPosition();
        this.props.handleClick(...args);
    }
        render(){

        return <input
            //style={{marginTop:100, marginLeft:100}}
            ref="input"
            type="text"
            name={this.props.name}
            //value={this.safeDateFormat( this.props.date )}
            value = {this.formatValue()}
            onClick={::this.handleClick}
            //onKeyDown={this.handleKeyDown}
            onFocus={this.props.onFocus}
            onBlur={this.props.onBlur}
            //onChange={this.handleChange}
            //onPropertychange={this.handleChange}
            className={this.props.className}
            //onInput={this.handleChange}
            //disabled={this.props.disabled}
            placeholder={this.props.placeholderText}
            onChange={this.onChange}
            //readOnly={this.props.readOnly}
            //required={this.props.required}
        />;
    }



}




Date.prototype.clone = function(){
    return new Date(+this);
}
/**
 * Created by Alex a cool guy
 */
import React, {PropTypes} from 'react';
import classnames  from 'classnames';
import moment from 'moment';



export default class Input extends React.Component{

    static defaultProps = {

        dateFormat:'',
        onBlur: function() {},
        onKeyDown: () => {

        }
    }


    constructor(props){
        super(props);
    }

    formatValue(){
        let {
            date,
            dateFormat
            } = this.props;
        return date.isValid() ? date.format(dateFormat) : '';

    }

    cancelBubble(e){
        //this.initDocumentClick();
        //e.shouldShowCalendar = true;
        //e.cancelBubble = true;
    }

    initDocumentClick(){
        var ev = document.createEvent('HTMLEvents');
        ev.initEvent('click', false, true);
        document.dispatchEvent(ev);
    }
    componentDidMount(){
        this.input = React.findDOMNode(this.refs.input);

    }





    onChange(e){
        this.props.onChange && this.props.onChange(e);
    }

    handleClick(e){
        this.props.handleClick(e);

    }
    focus(e){
        try{
            this.initDocumentClick();
        }catch(e){}
        this.handleClick(e);
    }
    render(){

        return <input
            ref="input"
            type="text"
            name={this.props.name}
            value = {this.formatValue()}
            onClick={::this.handleClick}
            onFocus={::this.focus}
            onBlur={this.props.onBlur}
            className={this.props.className}
            placeholder={this.props.placeholderText}
            onKeyUp={::this.remove}

            />;
    }

    remove(e){

        if(e.which === 8 && e.target.value.trim()){
            this.props.onSelect('');
        }

    }

}




Date.prototype.clone = function(){
    return new Date(+this);
}
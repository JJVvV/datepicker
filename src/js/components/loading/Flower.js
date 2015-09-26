/**
 * Created by Administrator on 2015/6/30.
 */

import React, {PropTypes} from 'react/addons.js';
import { Router} from 'react-router';
import assign from 'object-assign';


//export default function loading(){
//
//
//
//}

const getWrapperStyle = ({style,...props}) => {
    return {
        position:'relative',
        ...style
    }
}


const getFlowerStyle = ({style,...props}) => {
    return {
        ...style

    }
}



export default class Flower extends React.Component {

    state = {
        loaded: false
    }

    componentWillMount(){
    }

    constructor(props){
        super(props);

        this.removeFlower = ::this.removeFlower;
    }

    animationEnd(){
        this.flower.removeEventListener('transitionend', this.removeFlower);
    }

    componentDidMount(){
        this.flower = React.findDOMNode(this.refs.flower);
        this.flower.addEventListener('transitionend', this.removeFlower);
    }

    removeFlower(){
        this.props.removeFlower();
    }

    componentWillUnmount(){
        this.flower.removeEventListener('transitionend', this.animationEnd);
    }
    render(){

        let className = 'flower ' + (this.props.loaded ? 'hide' : '');
        return (
            <span ref="flower" className={className} style={getWrapperStyle(this.props)}></span>
        );

    }
}

Object.assign(Flower.prototype, React.addons.LinkedStateMixin);





















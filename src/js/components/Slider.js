/**
 * Created by Administrator on 2015/7/10.
 */

import React, { PropTypes } from 'react/addons.js'
import classnames  from 'classnames';
import PubSub from 'pubsub-js';
import {SLIDER_ACTIVE,SLIDER_ON_CLOSE, SLIDER_CLOSE} from '../constants/launchr.js';
import throttle from '../services/throttle.js';

const largeGrid = 1600;
const largeWidth = 650;
const normalWidth = 500;

export default class Slider extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      active:false,
      closed:true,
      resultWidth: this.props.width
    }
  }

  componentDidMount(){
    this.activeSlider = PubSub.subscribe(SLIDER_ACTIVE, () => {
      this.setState({
        active:true,
        closed: false
      });
    });

    this.closeSlider = PubSub.subscribe(SLIDER_CLOSE, ::this.onClose);

    this.throttle = throttle(function(e){
       this.setState({

       });
    }.bind(this));
    this.slider = React.findDOMNode(this.refs.slider);
    this.slider.addEventListener('transitionend', ::this.onEnd);
    window.addEventListener('resize', this.throttle);
  }
  componentWillUnMount(){
    PubSub.unsubscribe(this.activeSlider);
    PubSub.unsubscribe(this.closeSlider);
    this.slider.removeEventListener('transitionend', ::this.onEnd);

    window.removeEventListener('resize', this.throttle);

  }
  onEnd(){
    if(!this.state.active){
      typeof this.props.onCloseEnd === 'function' && this.props.onCloseEnd();
      this.setState({
        closed: true
      });
    }

  }

  getWidth(width){
    if(width){
      return width;
    }else if(window.innerWidth > largeGrid){
      return `${largeWidth}px`
    }else{
      return `${normalWidth}px`
    }
  }

  setWidth(){

  }


  render(){

    const {active, closed} = this.state;
    let width = this.getWidth(this.props.width);

    let resultWidth = active ? width : '0px';
    let overflow = active ?  'visible' : 'visible';


    return(
        <div className="slider" style={{transition:'width .3s cubic-bezier(0.69, 0.05, 0.53, 1.03)', width: resultWidth, overflow}} ref="slider">
          <div style={{width: width, height:'100%'}}>
            {closed ||
            React.addons.cloneWithProps(
                this.props.children,
                {
                  onClose: this.onClose.bind(this)
                }
            )
            }
          </div>
        </div>
    );
  }

  onClose(){
    this.setState({
      active:false,
    });
    PubSub.publish(SLIDER_ON_CLOSE,{});
    typeof this.props.onCloseStart === 'function' && this.props.onCloseStart();
  }

}

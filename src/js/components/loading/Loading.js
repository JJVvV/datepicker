/**
 * Created by Administrator on 2015/6/30.
 */

import React, {PropTypes} from 'react/addons.js';
import { Router} from 'react-router';
import assign from 'object-assign';
import Flower from './Flower.js';

//export default function loading(){
//
//
//
//}

const getWrapperStyle = ({style,...props}) => {
    return {
        ...style,
        position:'relative'
    }
}

const getFlowerStyle = () => {
    return {
        position:'absolute',
        top:'50%',
        left:'50%',
        transform: 'translate3d(-50%, -50%, 0)'
    }
}


export default function loading(DecoratedComponent){
    class LoadingComponent extends React.Component {

        state = {
            loading: false
        }

        constructor(props){
            super(props);
        }

        done(){
            this.setState({
                loading: false
            });
        }

        loadingStart(){
            this.setState({
                loading: true,
                hideFlower: false
            });
        }

        removeFlower(){
            this.setState({
                hideFlower: true
            });
        }

        render(){

            let className = 'decoration-wrapper ' + (this.props.className ? this.props.className : '');
            return (
                <div className={className} style={getWrapperStyle(this.props)}>

                    <DecoratedComponent  done={::this.done} loadingStart={::this.loadingStart} { ...this.props} />
                    {this.state.hideFlower || <Flower loaded={!this.state.loading} removeFlower={::this.removeFlower}  style={getFlowerStyle()} />}
                </div>
            );
            //return <DecoratedComponent {...this.props} />
        }
    }

    //assign(LoadingComponent.prototype, Router);

    Object.assign(DecoratedComponent.prototype, React.addons.LinkedStateMixin);
    return LoadingComponent;
}























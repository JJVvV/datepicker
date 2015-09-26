/**
 * Created by Administrator on 2015/6/30.
 */

import React, {PropTypes} from 'react';
import { Router} from 'react-router';
import assign from 'object-assign';

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

const getFlowerStyle = ({style,...props}) => {
    return {
        ...style,
        position:'absolute'
    }
}



export default function loading(DecoratedComponent){
    class LoadingComponent extends React.Component {

        state = {
            loading: true
        }



        constructor(props){
            super(props);

        }
        done(){
            this.setState({
                loading: false
            });
        }
        render(){
            return (
                <div className="decorator-wrapper" style={getWrapperStyle(this.props)}>
                    <DecoratedComponent {...this.props} />
                    {this.state.loading && <Flower style={getFlowerStyle(this.props)} />}
                </div>
            );
            //return <DecoratedComponent {...this.props} />
        }
    }

    //assign(LoadingComponent.prototype, Router);
    return LoadingComponent;
}























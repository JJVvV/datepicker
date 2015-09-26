/**
 * Created by Administrator on 2015/6/30.
 */

import React, {PropTypes} from 'react';
import { Router} from 'react-router';
import assign from 'object-assign';


export default function authentic(){
    return function(DecoratedComponent){
        class AuthenticatedComponent extends React.Component {

            static onEnter(nextState, transition){
                transition.to('/login');
            }

            //static getDefaultProps(){
            //
            //}
            componentWillMount(){


            }

            constructor(props){
                super(props);
            }

            render(){
                return <DecoratedComponent {...this.props} />
            }
        }

        assign(AuthenticatedComponent.prototype, Router);
        return AuthenticatedComponent;
    }


}



























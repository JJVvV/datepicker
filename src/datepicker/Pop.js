/**
 * Created by Alex a cool guy
 */
import React, {PropTypes} from 'react';


export default class Pop extends React.Component{

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
        popContainer.className = 'datepicker-container';

        this.popElement = popContainer;
        document.body.appendChild(this.popElement);
    }

    componentWillUnmount(){
        React.unmountComponentAtNode(this.popElement);
        document.body.removeChild(this.popElement);
    }




    render(){
        return <div />
    }



}




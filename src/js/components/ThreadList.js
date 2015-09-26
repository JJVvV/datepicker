/**
 * Created by Administrator on 2015/7/10.
 */

import React, {PropTypes} from 'react';
import ThreadItem from './ThreadItem.js';
import {Scrollbars} from './scrollbar';
import getScrollHeight from '../services/scrollHeight.js';
import throttle from '../services/throttle.js';


export default class ThreadList extends React.Component {



    constructor(props){
        super(props);
        this.resize = throttle(() => {
            this.setState({})
        });
    }

    _scrollHeight(){
        //oHeight=$(document.body).height()-113;
        var aa = getScrollHeight;
        return getScrollHeight(window, 71);
        //return document.body.clientHeight-70;
    }


    componentDidMount(){
        window.addEventListener('resize', this.resize);

    }

    componentWillUnmount(){
        window.removeEventListener('resize', this.resize);
    }
    render() {
        const {items} = this.props;

        return (
            <Scrollbars style={{height:this._scrollHeight()}}>
                <ul className="thread-list">
                    {this.renderItems(items)}
                </ul>
            </Scrollbars>
        );
    }


    renderItems(items) {
        return items.map(item =>(
            <ThreadItem clickItem={this.props.clickItem.bind(this, item)} item={item} key={item.id}/>
        ));
    }

    clickItem(threadID, name) {
        let action = actionContainer.get();
        //action.changeThreadID(threadID);
        //action.loadChatMessages(threadID, name);
        //action.loadThreadList().then(()=>{
        //
        //});
    }
}




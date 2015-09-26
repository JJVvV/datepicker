import React, { Component, PropTypes, cloneElement } from 'react';
import addClass from './utils/addClass';
import removeClass from './utils/removeClass';
import addStyleSheet from './utils/addStyleSheet';
import getScrollbarWidth from './utils/getScrollbarWidth';
import returnFalse from './utils/returnFalse';

let SCROLLBAR_WIDTH = false;
const BAR_WIDTH = 4;
const classnames = {
    testScrollbar: 'react-custom-scrollbars-test-scrollbar',
    disableSelection: 'react-custom-scrollbars-disable-selection'
};

const stylesheet = [
    `.${classnames.testScrollbar} {
        width: 100px;
        height: 100px;
        position: absolute;
        top: -9999px;
        overflow: scroll;
        -ms-overflow-style: scrollbar;
    }`,
    `.${classnames.disableSelection} {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }`
].join('').replace(/(\s|\n)/g, '');

function getDefaultScrollbarHorizontal({ style, ...props }) {
    const finalStyle = {
        ...style,
        right: 2,
        bottom: 2,
        left: 2,
        borderRadius: 3
    };
    return <div style={finalStyle} {...props} />;
}

function getDefaultScrollbarVertical({ style, ...props }) {
    const finalStyle = {
        ...style,
        right: 2,
        bottom: 2,
        top: 2,
        borderRadius: 3
    };
    return <div style={finalStyle} {...props} />;
}

function getDefaultThumbHorizontal({ style, ...props }) {
    const finalStyle = {
        ...style,
        cursor: 'pointer',
        borderRadius: 'inherit',
        backgroundColor: 'rgba(0,0,0,.2)'
    };
    return <div style={finalStyle} {...props} />;
}

function getDefaultThumbVertical({ style, ...props }) {
    const finalStyle = {
        ...style,
        cursor: 'pointer',
        borderRadius: 'inherit',
        backgroundColor: 'rgba(0,0,0,.2)'
    };
    return <div style={finalStyle} {...props} />;
}

function getDefaultView({ style, ...props }) {
    const finalStyle = {...style};
    return <div style={finalStyle} {...props} />;
}

export default class Scrollbars extends Component {

    static propTypes = {
        scrollbarHorizontal: PropTypes.func,
        scrollbarVertical: PropTypes.func,
        thumbHorizontal: PropTypes.func,
        thumbVertical: PropTypes.func,
        view: PropTypes.func
    };

    static defaultProps = {
        scrollbarHorizontal: getDefaultScrollbarHorizontal,
        scrollbarVertical: getDefaultScrollbarVertical,
        thumbHorizontal: getDefaultThumbHorizontal,
        thumbVertical: getDefaultThumbVertical,
        view: getDefaultView
    };

    constructor(props, context) {
        super(props, context);

        addStyleSheet(stylesheet);
        if (SCROLLBAR_WIDTH === false) {
            SCROLLBAR_WIDTH = getScrollbarWidth(classnames.testScrollbar);
        }

        this.bindHandlers();
        this.needsUpdate = true;
        this.state = {
            x: 0,
            y: 0,
            width: '100%',
            height: '100%',
            heightPercentageInner: 100,
            widthPercentageInner: 100
        };
    }

    componentDidMount() {
        this.addListeners();
        this.update();
    }

    componentWillReceiveProps() {
        this.needsUpdate = true;
    }

    componentDidUpdate() {
        this.update();
    }

    componentWillUnmount() {
        this.removeListeners();
    }

    bindHandlers() {
        this.update = this.update.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.handleVerticalTrackMouseDown = this.handleVerticalTrackMouseDown.bind(this);
        this.handleHorizontalTrackMouseDown = this.handleHorizontalTrackMouseDown.bind(this);
        this.handleVerticalThumbMouseDown = this.handleVerticalThumbMouseDown.bind(this);
        this.handleHorizontalThumbMouseDown = this.handleHorizontalThumbMouseDown.bind(this);
        this.handleDocumentMouseUp = this.handleDocumentMouseUp.bind(this);
        this.handleDocumentMouseMove = this.handleDocumentMouseMove.bind(this);
        this.handleWindowResize = this.handleWindowResize.bind(this);
    }

    addListeners() {
        React.findDOMNode(this.refs.view).addEventListener('scroll', this.handleScroll);
        React.findDOMNode(this.refs.barVertical).addEventListener('mousedown', this.handleVerticalTrackMouseDown);
        React.findDOMNode(this.refs.barHorizontal).addEventListener('mousedown', this.handleHorizontalTrackMouseDown);
        React.findDOMNode(this.refs.thumbVertical).addEventListener('mousedown', this.handleVerticalThumbMouseDown);
        React.findDOMNode(this.refs.thumbHorizontal).addEventListener('mousedown', this.handleHorizontalThumbMouseDown);
        document.addEventListener('mouseup', this.handleDocumentMouseUp);
        window.addEventListener('resize', this.handleWindowResize);
    }

    removeListeners() {
        React.findDOMNode(this.refs.view).removeEventListener('scroll', this.handleScroll);
        React.findDOMNode(this.refs.barVertical).removeEventListener('mousedown', this.handleVerticalTrackMouseDown);
        React.findDOMNode(this.refs.barHorizontal).removeEventListener('mousedown', this.handleHorizontalTrackMouseDown);
        React.findDOMNode(this.refs.thumbVertical).removeEventListener('mousedown', this.handleVerticalThumbMouseDown);
        React.findDOMNode(this.refs.thumbHorizontal).removeEventListener('mousedown', this.handleHorizontalThumbMouseDown);
        document.removeEventListener('mouseup', this.handleDocumentMouseUp);
        window.removeEventListener('resize', this.handleWindowResize);
    }

    getPosition($view = React.findDOMNode(this.refs.view)) {
        const y = ($view.scrollTop * 100) / $view.clientHeight;
        const x = ($view.scrollLeft * 100) / $view.clientWidth;
        return { x, y };
    }

    getInnerSizePercentage($view = React.findDOMNode(this.refs.view)) {
        return {
            widthPercentageInner: $view.clientWidth * 100 / $view.scrollWidth,
            heightPercentageInner: $view.clientHeight * 100 / $view.scrollHeight
        };
    }

    update() {
        if (SCROLLBAR_WIDTH === 0) return;
        if (!this.needsUpdate) return;

        const sizeInnerPercentage = this.getInnerSizePercentage();
        const position = this.getPosition();
        this.needsUpdate = false;
        this.setState({
            ...sizeInnerPercentage,
            ...position
        });
    }

    handleScroll() {
        this.setState(this.getPosition());
    }

    handleVerticalTrackMouseDown(event) {
        const $thumb = React.findDOMNode(this.refs.thumbVertical);
        const $bar = React.findDOMNode(this.refs.barVertical);
        const $view = React.findDOMNode(this.refs.view);
        const offset = Math.abs(event.target.getBoundingClientRect().top - event.clientY);
        const thumbHalf = $thumb.offsetHeight / 2;
        const thumbPositionPercentage = (offset - thumbHalf) * 100 / $bar.offsetHeight;
        $view.scrollTop = thumbPositionPercentage * $view.scrollHeight / 100;
    }

    handleHorizontalTrackMouseDown() {
        const $thumb = React.findDOMNode(this.refs.thumbHorizontal);
        const $bar = React.findDOMNode(this.refs.barHorizontal);
        const $view = React.findDOMNode(this.refs.view);
        const offset = Math.abs(event.target.getBoundingClientRect().left - event.clientX);
        const thumbHalf = $thumb.offsetWidth / 2;
        const thumbPositionPercentage = (offset - thumbHalf) * 100 / $bar.offsetWidth;
        $view.scrollLeft = thumbPositionPercentage * $view.scrollWidth / 100;
    }

    handleVerticalThumbMouseDown(event) {
        this.dragStart(event);
        const { currentTarget, clientY } = event;
        this.prevPageY = (currentTarget.offsetHeight - (clientY - currentTarget.getBoundingClientRect().top));
    }

    handleHorizontalThumbMouseDown(event) {
        this.dragStart(event);
        const { currentTarget, clientX } = event;
        this.prevPageX = (currentTarget.offsetWidth - (clientX - currentTarget.getBoundingClientRect().left));
    }

    handleDocumentMouseUp() {
        this.dragEnd();
    }

    handleDocumentMouseMove(event) {
        if (this.cursorDown === false) return void 0;

        if (this.prevPageY) {
            const $bar = React.findDOMNode(this.refs.barVertical);
            const $thumb = React.findDOMNode(this.refs.thumbVertical);
            const $view = React.findDOMNode(this.refs.view);
            const offset = ($bar.getBoundingClientRect().top - event.clientY) * -1;
            const thumbClickPosition = ($thumb.offsetHeight - this.prevPageY);
            const thumbPositionPercentage = (offset - thumbClickPosition) * 100 / $bar.offsetHeight;
            $view.scrollTop = thumbPositionPercentage * $view.scrollHeight / 100;
            return void 0;
        }

        if (this.prevPageX) {
            const $bar = React.findDOMNode(this.refs.barHorizontal);
            const $thumb = React.findDOMNode(this.refs.thumbHorizontal);
            const $view = React.findDOMNode(this.refs.view);
            const offset = ($bar.getBoundingClientRect().left - event.clientX) * -1;
            const thumbClickPosition = ($thumb.offsetWidth - this.prevPageX);
            const thumbPositionPercentage = (offset - thumbClickPosition) * 100 / $bar.offsetWidth;
            $view.scrollLeft = thumbPositionPercentage * $view.scrollWidth / 100;
            return void 0;
        }
    }

    handleWindowResize() {
        this.needsUpdate = true;
        this.update();
    }

    dragStart(event) {
        event.stopImmediatePropagation();
        this.cursorDown = true;
        addClass(document.body, [classnames.disableSelection]);
        document.addEventListener('mousemove', this.handleDocumentMouseMove);
        document.onselectstart = returnFalse;
    }

    dragEnd() {
        this.cursorDown = false;
        this.prevPageX = this.prevPageY = 0;
        removeClass(document.body, [classnames.disableSelection]);
        document.removeEventListener('mousemove', this.handleDocumentMouseMove);
        document.onselectstart = null;
    }

    render() {
        const {
            x, y,
            widthPercentageInner,
            heightPercentageInner
        } = this.state;

        const {
            style,
            scrollbarHorizontal,
            scrollbarVertical,
            thumbHorizontal,
            thumbVertical,
            view,
            children,
            ...props
        } = this.props;

        const thumbTranslateX = 'translateX(' + x + '%)';
        const thumbTranslateY = 'translateY(' + y + '%)';

        const containerStyle = {
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            height: '100%',
            ...style
        };

        const thumbStyle = {
            position: 'relative',
            display: 'block'
        };

        const thumbHorizontalStyle = {
            ...thumbStyle,
            height: '100%',
            width: (widthPercentageInner < 100) ? (widthPercentageInner + '%') : 0,
            MsTransform: thumbTranslateX,
            WebkitTransform: thumbTranslateX,
            transform: thumbTranslateX
        };

        const thumbVerticalStyle = {
            ...thumbStyle,
            width: '100%',
            height: (heightPercentageInner < 100) ? (heightPercentageInner + '%') : 0,
            MsTransform: thumbTranslateY,
            WebkitTransform: thumbTranslateY,
            transform: thumbTranslateY
        };

        const viewStyle = SCROLLBAR_WIDTH > 0
            ? {
                position: 'absolute',
                top: 0,
                left: 0,
                right: -SCROLLBAR_WIDTH,
                bottom: -SCROLLBAR_WIDTH,
                overflow: 'scroll',
                WebkitOverflowScrolling: 'touch'
            }
            : {
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'scroll',
                WebkitOverflowScrolling: 'touch'
            };

        const scrollbarStyle = {
            position: 'absolute',
            zIndex: 3
        };

        const scrollbarHorizontalStyle = {
            ...scrollbarStyle,
            height: widthPercentageInner < 100 ? BAR_WIDTH : 0
        };

        const scrollbarVerticalStyle = {
            ...scrollbarStyle,
            width: heightPercentageInner < 100 ? BAR_WIDTH : 0
        };

        return (
            <div {...props} style={containerStyle}>
                {
                    cloneElement(
                        scrollbarHorizontal({ style: scrollbarHorizontalStyle }),
                        { ref: 'barHorizontal' },
                        cloneElement(
                            thumbHorizontal({ style: thumbHorizontalStyle }),
                            { ref: 'thumbHorizontal' }
                        )
                    )
                }
                {
                    cloneElement(
                        scrollbarVertical({ style: scrollbarVerticalStyle }),
                        { ref: 'barVertical' },
                        cloneElement(
                            thumbVertical({ style: thumbVerticalStyle }),
                            { ref: 'thumbVertical' }
                        )
                    )
                }
                {
                    cloneElement(
                        view({ style: viewStyle }),
                        { ref: 'view' },
                        children
                    )
                }
            </div>
        );
    }
}

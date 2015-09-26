/**
 * Created by BennetWang on 2015/9/10.
 */
import React,{ Component} from "react";
import {GoogleMap,Marker,SearchBox} from "react-google-maps"

let  inputStyle = {
    "border": "1px solid transparent",
    "borderRadius": "1px",
    "boxShadow": "0 2px 6px rgba(0, 0, 0, 0.3)",
    "boxSizing": "border-box",
    "MozBoxSizing": "border-box",
    "fontSize": "14px",
    "height": "32px",
    "marginTop": "27px",
    "outline": "none",
    "padding": "0 12px",
    "textOverflow": "ellipses",
    "width": "400px"
}

export default class GoogleMapComponent extends React.Component{

    constructor(props){
        super(props);

        if(window.google!=undefined){
            this.state = {
                bounds: null,
                markers:  (this.props.lat!=undefined && this.props.lat!=null && this.props.lat!="") && (this.props.lng!=undefined && this.props.lng!=null && this.props.lng!="")?[ {
                    position:new google.maps.LatLng(Number(this.props.lat),Number(this.props.lng))
                }]: [],
                center:{
                    lat: (this.props.lat!=undefined && this.props.lat!=null && this.props.lat!="")?Number(this.props.lat):47.6205588,
                    lng: (this.props.lng!=undefined && this.props.lng!=null && this.props.lng!="")?Number(this.props.lng):-122.3212725
                },
                defaultZoom:15
            };
        }


    }
    componentDidMount(){
        setTimeout(function(){
            if(window.google!=undefined && this.state.markers.length>0 && this.refs.map.state.map!=undefined){
                var bounds = new google.maps.LatLngBounds();
                bounds.extend(this.state.markers[0].position);
                this.refs.map.fitBounds(bounds);
                this.setState({
                    center: this.state.markers[0].position,
                    bounds:this.refs.map.getBounds()
                });
            }
        }.bind(this),0);
    }
    _handle_places_changed(){
        const places = this.refs.searchBox.getPlaces();
        const markers = [];
        var bounds = new google.maps.LatLngBounds();
        if (places.length == 0) {
            return;
        }

        places.forEach(function (place) {
            markers.push({
                position: place.geometry.location
            });

            if (place.geometry.viewport) {

                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });

        const mapCenter = markers[0].position;
        this.props.onSelectPlace!=null?this.props.onSelectPlace({
            lat:mapCenter.G,
            lng:mapCenter.K
        }):"";
        this.refs.map.fitBounds(bounds);

        this.setState({
            center: mapCenter,
            markers: markers,
            bounds:this.refs.map.getBounds()
        });

        return;
    }

    _handle_bounds_changed (){
        this.setState({
            bounds: this.refs.map.getBounds(),
            center: this.refs.map.getCenter()
        });
    }

    render () {
        if(window.google==undefined){
            return null;
        }
        return (
            <GoogleMap containerProps={{
                  style: {
                    height: "100%",
                  },
            }}
                       ref="map"
                       defaultZoom={15}
                       onBoundsChanged={this._handle_bounds_changed.bind(this)}
                       center={this.state.center} >
                {
                    this.props.showSearch? <SearchBox
                        bounds={this.state.bounds}
                        controlPosition={google.maps.ControlPosition.TOP_LEFT}
                        onPlacesChanged={this._handle_places_changed.bind(this)}
                        ref="searchBox"
                        style={inputStyle} />:""
                }

                {this.state.markers.map((marker, index) => (
                    <Marker position={marker.position} key={index} />
                ))}
            </GoogleMap>
        );
    }
}
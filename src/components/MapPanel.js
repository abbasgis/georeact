import React from "react";
import {Card, CardBody, Col} from "reactstrap";
import Toolbar from "./Toolbar";
import MapModel from "../models/MapModel";
import {connect} from "react-redux";
import {Provider} from "react-redux";

import {store} from "../gistest";


class MapPanel extends React.Component {
    mapModel = null;

    constructor(props) {
        super(props);

        // this.state = {
        //     enable3D: false
        // };
        this.mapModel = new MapModel(this.props);
    }

    componentDidMount() {
        // this.mapModel = new MapModel(this.props.extent, this.props.zoomLevel);
        this.mapModel.createMap();

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.enable3D != this.props.enable3D) {
            this.mapModel.toggle3D(this.props.enable3D)
        }
    }

    render() {
        const mapStyle = {
            width: '100%',
            height: '400px',
        };
        const cardBodyStyle = {
            padding: '1px'
        }
        // return (<div id="map" style={mapStyle}></div>);
        return (

            <Col sm="12">
                <Card>
                    <CardBody style={cardBodyStyle}>
                        <Toolbar store={store}/>
                    </CardBody>
                    <CardBody style={cardBodyStyle}>
                        <div id="map" key={"map"} style={mapStyle}></div>
                    </CardBody>
                </Card>
            </Col>

        );
    }
}

// export default MapPanel;
const mapStateToProps = (state) => {
    return state;
}
const mapDispatchToProps = (dispatch) => {
    return {
        handleEnable3D: (evt) => {
            // console.log("handle input change...");
            dispatch({type: 'TOGGLE_3D_CHANGE'})
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MapPanel);
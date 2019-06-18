import React from 'react';
import ReactDOM from "react-dom";
import { createStore } from 'redux';
import MapPanel from "./components/MapPanel";
import reducer from "./reducers/GISTestReducer";
import {Provider} from "react-redux";

// import reducer from "./store/GISTestStore";


export const store = createStore(reducer);

const mountElem = document.getElementById("map-row");

// ReactDOM.render(<Map2D extent={[
//     6734829.193000, 2692598.219300, 8849899.518100, 4509031.393100
// ]} zoomLevel={5}/>, mountElem)

// let mapPanelRender = () => ReactDOM.render(<MapPanel store={store} />, mountElem);
// mapPanelRender();
// store.subscribe(mapPanelRender);

ReactDOM.render(<Provider store={store}><MapPanel/></Provider>, mountElem)
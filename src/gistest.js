import Map2D from "./components/Map2D";
import * as React from 'react';
import * as ReactDOM from "react-dom";



const mountElem = document.getElementById("map-row");
ReactDOM.render(<Map2D extent={[
    6734829.193000, 2692598.219300, 8849899.518100, 4509031.393100
]} zoomLevel={5}/>,mountElem);
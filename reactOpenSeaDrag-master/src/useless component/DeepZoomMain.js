import React, { useState } from "react";

import DeepZoomViewer from "./DeepZoomViewer";

import SuspectedTileViewer from "./SuspectedTileViewer";


import { Row, Col } from "react-bootstrap";

// import SideMenu from './components/SideMenu';

function DeepZoomMain() {
  const [viewer, setViewer] = useState();
  const [zoomLevel, setZoomLevel] = useState();
  const [viewportHeight, setViewportHeight] = useState();
  const [viewportWidth, setViewportWidth] = useState();

  const [showOSD, setShowOSD] = useState(false);


  const imgHelperValues = (obj) => {
    setZoomLevel(obj.zoomFactor.toFixed(2));
    setViewportHeight(obj.viewportHeight.toFixed(2));
    setViewportWidth(obj.viewportWidth.toFixed(2));
    setViewportCenter(obj.viewportCenter);
    setViewportOrigin(obj.viewportOrigin);
  };

  const updateFilterBrigtness = (filterObj) => {
    viewer.canvas.style.filter = `brightness(${filterObj.brightness}%) contrast(${filterObj.contrast}%) saturate(${filterObj.saturation}%)`;
  };
  const updateFilterContrast = (filterObj) => {
    viewer.canvas.style.filter = `brightness(${filterObj.brightness}%) contrast(${filterObj.contrast}%) saturate(${filterObj.saturation}%)`;
  };
  const updateFilterGamma = (filterObj) => {
    viewer.canvas.style.filter = `brightness(${filterObj.brightness}%) contrast(${filterObj.contrast}%) saturate(${filterObj.saturation}%) gamma(${filterObj.gamma})`;
  };

  //write a similart method for saturation
  const updateFilterSaturation = (filterObj) => {
    viewer.canvas.style.filter = `brightness(${filterObj.brightness}%) contrast(${filterObj.contrast}%) saturate(${filterObj.saturation}%)`;
  };

  // const onShowOSD = (stat) => {
  //   setShowOSD(stat);
  // };

  return (
    <div className="App" style={{boxSizing: "border-box", height:"1rem"}}>
      {/* <Toolbar style={{ "margin-bottom": "1rem" }} /> */}
      {/* <SideMenu /> */}
      {/* <DeepZoomViewer tileSources="https://openseadragon.github.io/example-images/highsmith/highsmith.dzi" slide={slide}/> */}

      <div style={{ display: "flex", boxSizing: "border-box", height:"1rem" }}>
        <div style={{ width: "100%", margin: "1rem" }}>
          <SuspectedTileViewer
            // onZoomPress={onZoomPress}
            updateFilterBrigtness={updateFilterBrigtness}
            updateFilterContrast={updateFilterContrast}
            updateFilterGamma={updateFilterGamma}
            updateFilterSaturation={updateFilterSaturation}
            // onShowOSD={onShowOSD}
          ></SuspectedTileViewer>
        </div>

        {/* //if showOSD is true then render a text here */}
        {showOSD && (
          <div
            style={{ marginTop: "1rem", marginRight: "1rem", border: "none" }}
          > 
            <DeepZoomViewer
              setViewer2={setViewer}
              imgHelperValues={imgHelperValues}
              // onShowOSD={onShowOSD}
            />
            <Row className="info-strip">
              <Col>zoomLevel : {zoomLevel}</Col>
              <Col>viewport Height: {viewportHeight}</Col>
              <Col>viewport Width: {viewportWidth}</Col>
              {/* <Col>
              Viewport Center
              <Col>x: {viewrportcenter.x.toFixed(2)}</Col>
              <Col>y: {viewrportcenter.y.toFixed(2)}</Col>
            </Col>
            <Col>Viewport Origin
              <Col>x: {viewportOrigin.x.toFixed(2)}</Col>
              <Col>y: {viewportOrigin.y.toFixed(2)}</Col>
            </Col> */}
            </Row>
          </div>
        )}
      </div>
    </div>
  );

  // );
}

export default DeepZoomMain;

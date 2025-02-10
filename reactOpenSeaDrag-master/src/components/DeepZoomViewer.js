import React, { useEffect, useRef, useState } from "react";
import OpenSeadragon from "openseadragon";
import * as Annotorious from "@recogito/annotorious-openseadragon";
import "@recogito/annotorious-openseadragon/dist/annotorious.min.css";
import "openseadragon-filtering";
import OpenSeadragonImagingHelper from "@openseadragon-imaging/openseadragon-imaginghelper";
import ShapeLabelsFormatter from "@recogito/annotorious-shape-labels";

// import './openseadragon-svg-overlay.js'

import './openseadragon-scalebar.js'
import './openseadragon-svg-overlay.js'
import './openseadragon-filtering.js'

import { Row, Col } from "react-bootstrap";

const DeepZoomViewer = ({ tileSources, zoomLevel, xCoord, yCoord, annotDetArr, imageSettings, setViewer2, Doctor, tileName, widthTile, heightTile }) => {
  const viewerRef = useRef();


  const [viewer, setViewer] = useState(null); // Define the viewer state variable here 

  const [zoomLevelView, setZoomLevelView] = useState();
  const [viewportHeight, setViewportHeight] = useState();
  const [viewportWidth, setViewportWidth] = useState();

  const [zoomLevelMain, setZoomLevelMain] = useState(zoomLevel);
  const [xCoordMain, setXCoordMain] = useState(xCoord);
  const [yCoordMain, setYCoordMain] = useState(yCoord);


  const [gamma, setGamma] = useState(1);
  const [contrast, setContrast] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [saturation, setSaturation] = useState(100);




  useEffect(() => {


    const viewer = OpenSeadragon({
      id: "viewer",
      // prefixUrl:
      //   "https://cdn.jsdelivr.net/npm/openseadragon@4.1/build/openseadragon/images/",
      //   tileSources: tileSources,
      animationTime: 0.5,
      blendTime: 0.1,
      constrainDuringPan: true,
      maxZoomPixelRatio: 2,
      minZoomImageRatio: 1,
      visibilityRatio: 1,
      zoomPerScroll: 2,
      maxZoomLevel: 128,
      minZoomLevel: 1,
      ajaxWithCredentials: false, // Add this line
      crossOriginPolicy: "Anonymous", // And this line
      // toolbar:       "toolbarDiv"   
      showNavigator: true

    });

    viewer.addHandler('tile-loaded', function () {

      viewer.setFilterOptions({
        filters: {
          processors: OpenSeadragon.Filters.BRIGHTNESS(50),
          // processors: OpenSeadragon.Filters.INVERT()
        },
        loadMode: 'sync'
      });
    })

    let ctrlPressed = false;
    window.addEventListener('keydown', function (event) {
      if (event.key === 'Control') {
        ctrlPressed = true;
        viewer.canvas.style.cursor = 'crosshair';
      }
    });

    window.addEventListener('keyup', function (event) {
      if (event.key === 'Control') {
        ctrlPressed = false;
        viewer.canvas.style.cursor = 'default';
      }
    });

    viewer.addHandler('canvas-enter', function (event) {
      if (ctrlPressed) {
        viewer.canvas.style.cursor = 'crosshair';
      }
    });

    let startPoint = null;
    let overlay = null;
    let line = null;
    let anchor = null;


    viewer.addHandler('canvas-click', function (event) {

      if (!event.originalEvent.ctrlKey) {
        return;
      }

      const viewportPoint = viewer.viewport.pointFromPixel(event.position);

      if (startPoint === null) {

        startPoint = viewportPoint;

        overlay = viewer.svgOverlay();

        anchor = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        anchor.setAttribute('cx', startPoint.x);
        anchor.setAttribute('cy', startPoint.y);
        anchor.setAttribute('r', '0.00005');
        anchor.setAttribute('style', 'fill:rgb(255,0,0)');
        overlay.node().appendChild(anchor);

        // Create the line.
        line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', startPoint.x);
        line.setAttribute('y1', startPoint.y);
        line.setAttribute('x2', startPoint.x);
        line.setAttribute('y2', startPoint.y);
        line.setAttribute('style', 'stroke:rgb(255,0,0);stroke-width:0.00001');
        overlay.node().appendChild(line);


      } else {
        // This is the end of the measurement. Set the end point of the line.
        line.setAttribute('x2', viewportPoint.x);
        line.setAttribute('y2', viewportPoint.y);

        // Create the end anchor.
        const endAnchor = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        endAnchor.setAttribute('cx', viewportPoint.x);
        endAnchor.setAttribute('cy', viewportPoint.y);
        endAnchor.setAttribute('r', '0.00005');
        endAnchor.setAttribute('style', 'fill:rgb(255,0,0)');
        overlay.node().appendChild(endAnchor);



        // Calculate the distance in viewport coordinates.
        const dx = viewportPoint.x - startPoint.x;
        const dy = viewportPoint.y - startPoint.y;
        const distanceInViewportCoordinates = Math.sqrt(dx * dx + dy * dy);

        // Display a message with the distance.
        // console.log('Distance: ' + distanceInViewportCoordinates);
        // alert('Distance: ' + distanceInViewportCoordinates);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', viewportPoint.x);
        text.setAttribute('y', viewportPoint.y);
        text.setAttribute('font-family', 'Arial');
        text.setAttribute('font-size', '0.0002');
        text.setAttribute('fill', 'black');
        text.setAttribute('text-anchor', 'middle');
        text.textContent = distanceInViewportCoordinates; // Set your desired value here
        overlay.node().appendChild(text);

        // Reset the start point and line.
        startPoint = null;
        line = null;
        anchor = null;
        viewer.removeHandler('canvas-drag');
      }

      // Prevent the click from zooming the viewer.
      event.preventDefaultAction = true;
    });

   

    viewer.addHandler("open", function () {

      viewer.viewport.zoomTo(zoomLevel);
      viewer.viewport.panTo(new OpenSeadragon.Point(xCoord, yCoord));
      viewer.forceRedraw();

      viewer.scalebar({
        type: OpenSeadragon.ScalebarType.MICROSCOPY,
        // pixelsPerMeter: 5000000,
        pixelsPerMeter: 4524886.88,
        minWidth: "150px",
        location: OpenSeadragon.ScalebarLocation.BOTTOM_RIGHT,
        yOffset: 5,
        stayInsideImage: false,
        color: "rgb(150,150,150)",
        fontColor: "rgb(100,100,100)",
        backgroundColor: "rgba(255,255,255,0.5)",
        fontSize: "small",
        barThickness: 2
      });

      let overlay = viewer.svgOverlay();

      // viewer.setFilterOptions({
      //   filters: {
      //     processors: OpenSeadragon.Filters.BRIGHTNESS(50)
      //   },
      //   loadMode: 'sync'
      // });

      // var button = document.createElement('button');
      // button.innerHTML = 'Click me';  // Set the button text
      // button.onclick = function () {
      //   // Add your button click handler here
      // };

      // Append the button to the overlay
      // overlay.node().appendChild(button);

      // viewer.setFullScreen(true);

    });

    // viewer.canvas.style.filter = imageSettings;

    viewer.addHandler("open", function () {
      var getTileUrl = viewer.source.getTileUrl;

      viewer.source.getTileUrl = function () {
        return getTileUrl.apply(this, arguments) + "?v=" + "261d9b83";
      };

      // viewer.canvas.style.filter = imageSettings;


    });
    
    
    let image = { "Image": { "Format": "jpeg", "Overlap": 1, "Size": { "Height": heightTile, "Width":  widthTile}, "TileSize": 512, "Url": `http://127.0.0.1:5000/tile/${Doctor}/${tileName}/`, "xmlns": "http://schemas.microsoft.com/deepzoom/2008" }, "crossOriginPolicy": 'Anonymous', "ajaxWithCredentials": false, "useCanvas": true }
    // let image = { "Image": { "Format": "jpeg", "Overlap": 1, "Size": { "Height": heightTile, "Width":  widthTile}, "TileSize": 512, "Url": `http://127.0.0.1:8000/api/open-slide/`, "xmlns": "http://schemas.microsoft.com/deepzoom/2008" }, "crossOriginPolicy": 'Anonymous', "ajaxWithCredentials": false, "useCanvas": true }
    // let image = { "Image": { "Format": "jpeg", "Overlap": 1, "Size": { "Height": 61440, "Width":60928  }, "TileSize": 512, "Url": `http://127.0.0.1:5000/tile/${Doctor}/${tileName}/`, "xmlns": "http://schemas.microsoft.com/deepzoom/2008" }, "crossOriginPolicy": 'Anonymous', "ajaxWithCredentials": false, "useCanvas": true }
    // let image = { "Image": { "Format": "jpeg", "Overlap": 1 , "Size": { "Height": 79360, "Width":75264  }, "TileSize": 512, "Url": `http://127.0.0.1:5000/tile/${Doctor}/${tileName}/`, "xmlns": "http://schemas.microsoft.com/deepzoom/2008" }, "crossOriginPolicy": 'Anonymous', "ajaxWithCredentials": false, "useCanvas": true }


    const anno = Annotorious(viewer);

    const LabelFormtr = new ShapeLabelsFormatter();

    anno.formatters = [...anno.formatters, LabelFormtr];


    anno.on('deleteAnnotation', async (annotation) => {
      // console.log(annotation);
      anno.removeAnnotation(annotation.id);
      await onFetchData('http://127.0.0.1:5000/deleteAnnotation', 'POST', { id: annotation.id })
    });

    anno.on("createAnnotation", async function (annotation) {


      await onFetchData('http://127.0.0.1:5000/getAnnotation', 'POST', annotation)

    });

    for (var i in annotDetArr) {

      anno.addAnnotation({
        "@context": "http://www.w3.org/ns/anno.jsonld",
        id: annotDetArr[i].id,
        type: "Annotation",
        body: [{
          type: "TextualBody",
          value: annotDetArr[i].title,
          format: "text/plain",
        },
        {
          purpose: "tagging",
          value: annotDetArr[i].cat,
        }
        ],
        target: {
          source: "http://example.com/image.jpg", // Replace with your image URL
          selector: {
            type: "FragmentSelector",
            conformsTo: "http://www.w3.org/TR/media-frags/",
            value: annotDetArr[i].xywh, // Replace with your annotation coordinates
          },
        },
      });
    }


    // viewer.addOverlay({
    //   id: "example-overlay",
    //   x: 0.33,
    //   y: 0.75,
    //   width: 0.2,
    //   height: 0.25,
    //   className: "highlight",
    // });



    // var imagingHelper = viewer.activateImagingHelper({
    //   onImageViewChanged: onImageViewChanged,
    // });

    viewer.activateImagingHelper({
      onImageViewChanged: onImageViewChanged,
    });

    function onImageViewChanged(event) {

      setZoomLevelView(event.zoomFactor.toFixed(2));
      setViewportHeight(event.viewportWidth.toFixed(2));
      setViewportWidth(event.viewportHeight.toFixed(2));
      setXCoordMain(event.viewportCenter.x);
      setYCoordMain(event.viewportCenter.y);

    }

    setViewer2(viewer)

    viewer.open(image);

    setViewer(viewer);

  // }, [tileSources]);
  }, []);

  const getSavedAnnotation = async () => {
    let savedData = await onFetchData('http://127.0.0.1:5000/getSavedAnnotation', 'GET',)
    return savedData;
  };

  const onFetchData = async (path, mthod, body) => {
    //write code for fetching data from server based on
    return new Promise((resolve, reject) => {

      fetch(path, {
        method: mthod,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          resolve(data);
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation: ', error);
          reject(error);
        });

    })
  }

  const updateFilterBrigtness = (filterObj) => {
    setBrightness(filterObj.target.value);
    viewer.canvas.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
  };
  const updateFilterContrast = (filterObj) => {
    setContrast(filterObj.target.value);
    viewer.canvas.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
  };
  const updateFilterGamma = (filterObj) => {
    setGamma(filterObj.target.value);
    viewer.canvas.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
  };

  //write a similart method for saturation
  const updateFilterSaturation = (filterObj) => {
    setSaturation(filterObj.target.value);
    viewer.canvas.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
  };

  const resetFilters = function () {
    setBrightness(100);
    setContrast(100);
    setGamma(1);
    setSaturation(100);
    viewer.canvas.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

  };


  return (
    <div>
      <div style={{ display: "flex" }}>
        <div
          id="viewer"
          ref={viewerRef}
          style={{ width: "100%", height: "850px", padding: "none" }}
        />


        {/* <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "0.8rem",
            width: "200px",
          }}
        >
          <button className="btn btn-primary" onClick={resetFilters}>
            Reset
          </button>
          <label>
            Brightness
            <input
              type="range"
              min="0"
              max="200"
              value={brightness}
              onChange={updateFilterBrigtness}
              tooltip="true"
              class="form-range"
            />
          </label>
          <label>
            Contrast
            <input
              type="range"
              min="0"
              max="200"
              value={contrast}
              onChange={updateFilterContrast}
              class="form-range"
            />
          </label>
          <label>
            Gamma
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={gamma}
              onChange={updateFilterGamma}
              class="form-range"
            />
          </label>
          <label>
            Saturation
            <input
              type="range"
              min="0"
              max="200"
              value={saturation}
              onChange={updateFilterSaturation}
              class="form-range"
            />
          </label>
          <Row className="info-strip">
            <Col>zoomLevel : {zoomLevelView}</Col>
            <Col>viewport Height: {viewportHeight}</Col>
            <Col>viewport Width: {viewportWidth}</Col>
            <Col>xCoord: {xCoordMain}</Col>
            <Col>yCoord: {yCoordMain}</Col>
          </Row>
     
        </div> */}
      </div>
    </div>
  );
};

export default DeepZoomViewer;

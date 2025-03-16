import React, { useEffect, useRef, useState, forwardRef } from "react";
import OpenSeadragon from "openseadragon";
import "openseadragon-filtering";
import OpenSeadragonImagingHelper from "@openseadragon-imaging/openseadragon-imaginghelper";
import './openseadragon-scalebar.js';
import './openseadragon-svg-overlay.js';
import './openseadragon-filtering.js';

const DeepZoomViewer = forwardRef(({ 
  tileSources, 
  zoomLevel, 
  xCoord, 
  yCoord, 
  setViewer2, 
  Doctor, 
  tileName, 
  widthTile, 
  heightTile 
}, ref) => {
  const viewerRef = useRef();
  const [viewer, setViewer] = useState(null);
  const [zoomLevelView, setZoomLevelView] = useState();
  const [viewportHeight, setViewportHeight] = useState();
  const [viewportWidth, setViewportWidth] = useState();
  const [zoomLevelMain, setZoomLevelMain] = useState(zoomLevel);
  const [xCoordMain, setXCoordMain] = useState(xCoord);
  const [yCoordMain, setYCoordMain] = useState(yCoord);

  useEffect(() => {
    const viewer = OpenSeadragon({
      id: "viewer",
      animationTime: 0.5,
      blendTime: 0.1,
      constrainDuringPan: false,
      maxZoomPixelRatio: 1,
      minZoomImageRatio: 1,
      visibilityRatio: 0.1,
      zoomPerScroll: 2,
      maxZoomLevel: 7,
      minZoomLevel: 1,
      ajaxWithCredentials: false,
      crossOriginPolicy: "Anonymous",
      showNavigator: true,
      canvasOptions: { willReadFrequently: true }
    });

    viewer.addHandler("open", function () {
      console.log('Zooming to:', zoomLevel, 'at', xCoord, yCoord);
      viewer.viewport.zoomTo(zoomLevel || 1);
      const viewportPoint = new OpenSeadragon.Point(xCoord, yCoord);
  viewer.viewport.panTo(viewportPoint);
      console.log('Viewport center after pan:', viewer.viewport.getCenter());
      viewer.viewport.applyConstraints();
      viewer.forceRedraw();

      // viewer.addOverlay({
      //   x: 0.5,
      //   y: 0.5,
      //   width: 0.05,
      //   height: 0.05,
      //   className: "highlight",
      //   id: "center-overlay"
      // });
      // viewer.viewport.panTo(new OpenSeadragon.Point(0.5, 0.5));

      viewer.addOverlay({
        x: 29922 / 35840, // ≈ 0.8348772321428571
        y: 25152 / 38400, // ≈ 0.6549479166666667
        width: (30044 - 29922) / 35840, // ≈ 0.003404017857142857
        height: (25277 - 25152) / 38400, // ≈ 0.0032552083333333335
        className: "highlight",
        id: "debug-overlay"
      });
      viewer.viewport.panTo(new OpenSeadragon.Point(0.8365792410714286, 0.6566145833333333));

      console.log('Overlay added at:', {
        x: 29922 / 35840, // Match the addOverlay x
        y: 25152 / 38400, // Match the addOverlay y
        width: (30044 - 29922) / 35840,
        height: (25277 - 25152) / 38400
      });
      console.log('Viewport bounds:', viewer.viewport.getBounds());

      viewer.scalebar({
        type: OpenSeadragon.ScalebarType.MICROSCOPY,
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

      var getTileUrl = viewer.source.getTileUrl;
      viewer.source.getTileUrl = function () {
        return getTileUrl.apply(this, arguments) + "?v=" + "261d9b83";
      };
    });

    let image = { 
      "Image": { 
        "Format": "jpeg", 
        "Overlap": 0, 
        "Size": { "Height": heightTile, "Width": widthTile }, 
        "TileSize": 512, 
        "Url": `http://127.0.0.1:8000/api/tile/${Doctor}/${tileName}/`, 
        "xmlns": "http://schemas.microsoft.com/deepzoom/2008" 
      }, 
      "crossOriginPolicy": 'Anonymous', 
      "ajaxWithCredentials": false, 
      "useCanvas": true 
    };

    viewer.activateImagingHelper({
      onImageViewChanged: function(event) {
        setZoomLevelView(event.zoomFactor.toFixed(2));
        setViewportHeight(event.viewportWidth.toFixed(2));
        setViewportWidth(event.viewportHeight.toFixed(2));
        setXCoordMain(event.viewportCenter.x);
        setYCoordMain(event.viewportCenter.y);
      }
    });

    const style = document.createElement('style');
  style.textContent = `
    .openseadragon-canvas .highlight {
      background-color: rgba(0, 255, 8, 0.5) !important;
      border: 2px solid green !important;
      z-index: 1000 !important;
    }
  `;
  document.head.appendChild(style);

    setViewer2(viewer);
    viewer.open(image);
    setViewer(viewer);

  }, []);

  return (
    <div>
      <div style={{ display: "flex" }}>
        <div
          id="viewer"
          ref={viewerRef}
          style={{ width: "100%", height: "850px", padding: "none" }}
        />
      </div>
    </div>
  );
});

export default DeepZoomViewer;
// import React, { useEffect, useRef, useState, forwardRef } from "react";
// import OpenSeadragon from "openseadragon";
// import "openseadragon-filtering";
// import OpenSeadragonImagingHelper from "@openseadragon-imaging/openseadragon-imaginghelper";
// import './openseadragon-scalebar.js';
// import './openseadragon-svg-overlay.js';
// import './openseadragon-filtering.js';

// const DeepZoomViewer = forwardRef(({ 
//   tileSources, 
//   zoomLevel, 
//   xCoord, 
//   yCoord, 
//   setViewer2, 
//   Doctor, 
//   tileName, 
//   widthTile, 
//   heightTile 
// }, ref) => {
//   const viewerRef = useRef();
//   const [viewer, setViewer] = useState(null);
//   const [zoomLevelView, setZoomLevelView] = useState();
//   const [viewportHeight, setViewportHeight] = useState();
//   const [viewportWidth, setViewportWidth] = useState();
//   const [zoomLevelMain, setZoomLevelMain] = useState(zoomLevel);
//   const [xCoordMain, setXCoordMain] = useState(xCoord);
//   const [yCoordMain, setYCoordMain] = useState(yCoord);

//   useEffect(() => {
//     const viewer = OpenSeadragon({
//       id: "viewer",
//       animationTime: 0.5,
//       blendTime: 0.1,
//       constrainDuringPan: false,
//       maxZoomPixelRatio: 2,
//       minZoomImageRatio: 1,
//       visibilityRatio: 0,
//       zoomPerScroll: 2,
//       maxZoomLevel: 128,
//       minZoomLevel: 1,
//       defaultZoomLevel: 0.5, // Start zoomed out to see the whole image
//       ajaxWithCredentials: false,
//       crossOriginPolicy: "Anonymous",
//       showNavigator: true,
//       canvasOptions: { willReadFrequently: true }
//     });

//     viewer.addHandler("open", function () {
//       console.log('Zooming to:', zoomLevel, 'at', xCoord, yCoord);
//       viewer.viewport.zoomTo(zoomLevel || 1);
//       const viewportPoint = new OpenSeadragon.Point(xCoord, yCoord);
//   viewer.viewport.panTo(viewportPoint);
//       console.log('Viewport center after pan:', viewer.viewport.getCenter());
//       viewer.viewport.applyConstraints();
//       viewer.forceRedraw();

//       // viewer.addOverlay({
//       //   x: 0.5,
//       //   y: 0.5,
//       //   width: 0.05,
//       //   height: 0.05,
//       //   className: "highlight",
//       //   id: "center-overlay"
//       // });
//       // viewer.viewport.panTo(new OpenSeadragon.Point(0.5, 0.5));

//       viewer.addOverlay({
//         x: 29922 / 35840, // ≈ 0.8348772321428571
//         y: 25152 / 38400, // ≈ 0.6549479166666667
//         width: (30044 - 29922) / 35840, // ≈ 0.003404017857142857
//         height: (25277 - 25152) / 38400, // ≈ 0.0032552083333333335
//         className: "highlight",
//         id: "debug-overlay"
//       });
//       viewer.viewport.panTo(new OpenSeadragon.Point(0.8365792410714286, 0.6566145833333333));

//       console.log('Overlay added at:', {
//         x: 29922 / 35840, // Match the addOverlay x
//         y: 25152 / 38400, // Match the addOverlay y
//         width: (30044 - 29922) / 35840,
//         height: (25277 - 25152) / 38400
//       });
//       console.log('Viewport bounds:', viewer.viewport.getBounds());

//       viewer.scalebar({
//         type: OpenSeadragon.ScalebarType.MICROSCOPY,
//         pixelsPerMeter: 4524886.88,
//         minWidth: "150px",
//         location: OpenSeadragon.ScalebarLocation.BOTTOM_RIGHT,
//         yOffset: 5,
//         stayInsideImage: false,
//         color: "rgb(150,150,150)",
//         fontColor: "rgb(100,100,100)",
//         backgroundColor: "rgba(255,255,255,0.5)",
//         fontSize: "small",
//         barThickness: 2
//       });

//       var getTileUrl = viewer.source.getTileUrl;
//       viewer.source.getTileUrl = function () {
//         return getTileUrl.apply(this, arguments) + "?v=" + "261d9b83";
//       };
//     });

//     let image = { 
//       "Image": { 
//         "Format": "jpeg", 
//         "Overlap": 0, 
//         "Size": { "Height": heightTile, "Width": widthTile }, 
//         "TileSize": 512, 
//         "Url": `http://127.0.0.1:8000/api/tile/${Doctor}/${tileName}/`, 
//         "xmlns": "http://schemas.microsoft.com/deepzoom/2008" 
//       }, 
//       "crossOriginPolicy": 'Anonymous', 
//       "ajaxWithCredentials": false, 
//       "useCanvas": true 
//     };

//     viewer.activateImagingHelper({
//       onImageViewChanged: function(event) {
//         setZoomLevelView(event.zoomFactor.toFixed(2));
//         setViewportHeight(event.viewportWidth.toFixed(2));
//         setViewportWidth(event.viewportHeight.toFixed(2));
//         setXCoordMain(event.viewportCenter.x);
//         setYCoordMain(event.viewportCenter.y);
//       }
//     });

//     const style = document.createElement('style');
//   style.textContent = `
//     .openseadragon-canvas .highlight {
//       background-color: rgba(0, 255, 8, 0.5) !important;
//       border: 2px solid green !important;
//       z-index: 1000 !important;
//     }
//   `;
//   document.head.appendChild(style);

//     setViewer2(viewer);
//     viewer.open(image);
//     setViewer(viewer);

//   }, []);

//   return (
//     <div>
//       <div style={{ display: "flex" }}>
//         <div
//           id="viewer"
//           ref={viewerRef}
//           style={{ width: "100%", height: "850px", padding: "none" }}
//         />
//       </div>
//     </div>
//   );
// });

// export default DeepZoomViewer;

// reactOpenseadrag-master/src/components/DeepZoomViewer.js
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
  heightTile,
  annotDetArr, // Add annotDetArr prop to receive annotations
  imageSettings
}, ref) => {
  const viewerRef = useRef();
  const [viewer, setViewer] = useState(null);
  const [zoomLevelView, setZoomLevelView] = useState(2); // Default zoom level
  const [cursorCoords, setCursorCoords] = useState({ x: 0, y: 0 }); // Cursor coordinates in pixels

  useEffect(() => {
    console.log('DeepZoomViewer dimensions:', widthTile, heightTile);

    console.log('Annotations:', annotDetArr); // Log annotations to verify they're received

    const viewer = OpenSeadragon({
      id: "viewer",
      animationTime: 0.5,
      blendTime: 0.1,
      constrainDuringPan: false,
      maxZoomPixelRatio: 2,
      minZoomImageRatio: 0.1,
      visibilityRatio: 0,
      zoomPerScroll: 2,
      maxZoomLevel: 128,
      minZoomLevel: 1,
      ajaxWithCredentials: false,
      crossOriginPolicy: "Anonymous",
      showNavigator: true,
      canvasOptions: { willReadFrequently: true }
    });

    

    viewer.addHandler("open", function () {
      // console.log('Zooming to:', zoomLevel, 'at', xCoord, yCoord);
      // viewer.viewport.zoomTo(zoomLevel || 2);
      // const viewportPoint = new OpenSeadragon.Point(xCoord, yCoord);
      // viewer.viewport.panTo(viewportPoint);
      // console.log('Viewport center after pan:', viewer.viewport.getCenter());
      // console.log('Viewport bounds after pan:', viewer.viewport.getBounds());
      // viewer.viewport.applyConstraints();
      // viewer.forceRedraw();
      console.log('Zooming to:', zoomLevel, 'at', xCoord, yCoord);
      viewer.viewport.zoomTo(zoomLevel || 2);

      // Convert pixel coordinates (xCoord, yCoord) to viewport coordinates
      const viewportPoint = viewer.viewport.imageToViewportCoordinates(xCoord, yCoord);
      console.log('Panning viewport coordinates:', viewportPoint);

      // Pan to the converted viewport coordinates
      viewer.viewport.panTo(viewportPoint);
      console.log('Viewport center after pan:', viewer.viewport.getCenter());
      console.log('Viewport bounds after pan:', viewer.viewport.getBounds());
      viewer.viewport.applyConstraints();
      viewer.forceRedraw();

      // Add annotations as overlays
      if (annotDetArr && annotDetArr.length > 0) {
        annotDetArr.forEach((annot, index) => {
          // Check if the annotation already has OpenSeadragon viewport coordinates
          const xywhxyMatch = annot.xywhxy.match(/xywhxy=pixel:(\d+),(\d+),(\d+),(\d+),([\d.]+),([\d.]+)/);
          if (xywhxyMatch) {
            const x1 = parseInt(xywhxyMatch[1], 10); // x-coordinate (top-left)
            const y1 = parseInt(xywhxyMatch[2], 10); // y-coordinate (top-left)
            const width = parseInt(xywhxyMatch[3], 10); // width
            const height = parseInt(xywhxyMatch[4], 10); // height
            // Convert pixel coordinates to OpenSeadragon viewport coordinates
            // const x = parseFloat(xywhxyMatch[5], 10);
            // const y = parseFloat(xywhxyMatch[6], 10);
            const viewportPoint = viewer.viewport.imageToViewportCoordinates(x1, y1);
            const x = viewportPoint.x;
            const y = viewportPoint.y;
            
            const overlayWidth = width / widthTile;
            const overlayHeight = height / heightTile;

            console.log("Overlay width, height",overlayWidth,overlayHeight)

            // Create a custom HTML element for the overlay with a label
            const overlayElement = document.createElement('div');
            overlayElement.className = 'annotation-overlay';
            overlayElement.style.backgroundColor = 'rgba(0, 255, 0, 0.3)'; // Semi-transparent green
            overlayElement.style.border = '1px solid green';
            overlayElement.style.position = 'relative';

            // Add the label
            const labelElement = document.createElement('div');
            labelElement.className = 'annotation-label';
            labelElement.innerText = annot.title || `Annotation ${index + 1}`; // Use title or fallback to index
            labelElement.style.position = 'absolute';
            labelElement.style.top = '-20px'; // Position above the overlay
            labelElement.style.left = '0';
            labelElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            labelElement.style.color = 'white';
            labelElement.style.padding = '2px 5px';
            labelElement.style.borderRadius = '3px';
            labelElement.style.fontSize = '12px';
            overlayElement.appendChild(labelElement);

            console.log(`Annotation ${annot.id} details:`);
            console.log(`  Pixel coordinates: (${x1}, ${y1})`);
            console.log(`  Viewport coordinates: (${x}, ${y})`);
            console.log(`  Overlay dimensions (viewport space): ${overlayWidth} x ${overlayHeight}`);         

            // Add the overlay to the viewer
            viewer.addOverlay({
              element: overlayElement,
              x: x,
              y: y,
              width: overlayWidth,
              height: overlayHeight,
              id: `annot-overlay-${annot.id}`
            });

            console.log(`Added annotation overlay ${annot.id}:`, {
              x,
              y,
              width: overlayWidth,
              height: overlayHeight,
              title: annot.title
            });
          }
          else {
            console.log("ERROR")
            // console.log(annot.openSeaXCoord, annot.openSeaYCoord)
            console.log(annot)
          }    
        });
      }
      
      // Existing debug overlay (optional, can be removed if not needed)
      // viewer.addOverlay({
      //   x: 29922 / widthTile,
      //   y: 25152 / heightTile,
      //   width: (30044 - 29922) / widthTile,
      //   height: (25277 - 25152) / heightTile,
      //   className: "highlight",
      //   id: "debug-overlay"
      // });

      // console.log('Overlay added at:', {
      //   x: 29922 / widthTile,
      //   y: 25152 / heightTile,
      //   width: (30044 - 29922) / widthTile,
      //   height: (25277 - 25152) / heightTile
      // });
      // console.log('Viewport bounds:', viewer.viewport.getBounds());

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

    // viewer.addHandler("tile-loaded", (event) => {
    //   console.log("Tile loaded at level:", event.tile.level, "row:", event.tile.row, "column:", event.tile.column);
    // });
    // viewer.addHandler("tile-drawn", (event) => {
    //   console.log("Tile drawn at level:", event.tile.level, "row:", event.tile.row, "column:", event.tile.column);
    // });
    viewer.addHandler("tile-load-failed", (event) => {
      console.error("Tile failed to load:", event.tile.getUrl());
    });

    // Track zoom level and viewport changes
    viewer.activateImagingHelper({
      onImageViewChanged: function(event) {
        setZoomLevelView(event.zoomFactor.toFixed(2)); // Update zoom level
      }
    });

    // Add a mouse tracker to get cursor coordinates
    const tracker = new OpenSeadragon.MouseTracker({
      element: viewer.container,
      moveHandler: function(event) {
        const webPoint = event.position; // Mouse position in viewport coordinates
        const viewportPoint = viewer.viewport.pointFromPixel(webPoint); // Convert to viewport coordinates
        const imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint); // Convert to image coordinates (pixels)
        setCursorCoords({
          x: Math.round(imagePoint.x),
          y: Math.round(imagePoint.y)
        });
      }
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

    // Apply image settings (brightness, contrast, etc.) if provided
    if (imageSettings && viewer && viewer.canvas) {
      viewer.canvas.style.filter = imageSettings;
    }

    const style = document.createElement('style');
    style.textContent = `
      .openseadragon-canvas .highlight {
        background-color: rgba(0, 255, 8, 0.5) !important;
        border: 2px solid green !important;
        z-index: 1000 !important;
      }
      .info-overlay {
        position: absolute;
        bottom: 40px;
        left: 10px;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 5px 10px;
        border-radius: 5px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        z-index: 1000;
      }
      .annotation-overlay {
        background-color: rgba(0, 255, 0, 0.3);
        border: 1px solid green;
        position: relative;
      }
      .annotation-label {
        position: absolute;
        top: -20px;
        left: 0;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 2px 5px;
        border-radius: 3px;
        font-size: 12px;
        white-space: nowrap;
      }
    `;
    document.head.appendChild(style);

    setViewer2(viewer);
    viewer.open(image);
    setViewer(viewer);

    return () => {
      viewer.destroy();
      tracker.destroy();
    };
  }, [Doctor, tileName, widthTile, heightTile, zoomLevel, xCoord, yCoord, setViewer2, annotDetArr, imageSettings]);

  return (
    <div>
      <div style={{ display: "flex", position: "relative" }}>
        <div
          id="viewer"
          ref={viewerRef}
          style={{ width: "100%", height: "850px", padding: "none", border: "2px solid red" }}
        />
        {/* Zoom and coordinate overlay */}
        <div className="info-overlay">
          <div>Zoom: {(zoomLevelView * 10).toFixed(2)}x</div>
          <div>X: {cursorCoords.x}, Y: {cursorCoords.y}</div>
        </div>
      </div>
    </div>
  );
});

export default DeepZoomViewer;
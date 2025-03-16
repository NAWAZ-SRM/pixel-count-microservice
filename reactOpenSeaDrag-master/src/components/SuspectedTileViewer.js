// Reactopenseadrag-Master/src/component/SuspectedTileViewer.js

// Potential improvement (still needs changes)

import React, { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
import OpenSeadragon from "openseadragon";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { ContextMenu } from 'primereact/contextmenu';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DeepZoomViewer from "./DeepZoomViewer";
import FreqIntGraph from "./FreqIntGraph";
import util from '../util/datamanager';

// Import icons
import gridIcon from "../resources/icons/menu.png";
import nextIcon from "../resources/icons/next.png";
import prevIcon from "../resources/icons/arrow.png";
import fullScreenIcon from "../resources/icons/fullscreen.png";
import nextPatient from '../resources/icons/next (1).png';
import previousPatient from '../resources/icons/back.png';
import measureIcon from '../resources/icons/measure.png';
import imageEdit from '../resources/icons/eye.png';

const SuspectedTileViewer = () => {
  const { Doctor, tileName } = useParams();
  const childRef = useRef();
  const [zoomLevel, setZoomLevel] = useState();
  const [xCoord, setXCoord] = useState();
  const [yCoord, setYCoord] = useState();
  const [annotArr, setAnnotArr] = useState([]);
  const [showDragonView, setShowDragonView] = useState(false);
  const [selectedAnnotaiton, setSelectedAnnotation] = useState(null);
  const [images, setImages] = useState([]);
  const [gridx, setGridx] = useState(4);
  const [gridy, setGridy] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = images.slice(indexOfFirstItem, indexOfLastItem);
  const [imageId, setImageId] = useState();
  const [scaleSelected, setScaleSelected] = useState(false);
  const [gamma, setGamma] = useState(1);
  const [contrast, setContrast] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [imageSettings, setImageSettings] = useState(`brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`);
  const [viewer, setViewer] = useState('');
  const [widthTile, setWidthTile] = useState();
  const [heightTile, setHeightTile] = useState();
  const [RGBGraph, setRGBGraph] = useState(false);
  const [sliderValue, setSliderValue] = useState([20, 80]);
  const cm = useRef(null);

  const items = [
    { label: 'HSIL', command: (event) => handleMenuCategory('HSIL', imageId) },
    { label: 'LSIL', command: (event) => handleMenuCategory('LSIL', imageId) },
    { label: 'ASCH', command: (event) => handleMenuCategory('ASCH', imageId) },
    { label: 'ASCUS', command: (event) => handleMenuCategory('ASCUS', imageId) },
    { label: 'AGUS', command: (event) => handleMenuCategory('AGUS', imageId) },
    { label: 'REVIEW', command: (event) => handleMenuCategory('REVIEW', imageId) },
    { label: 'FP', command: (event) => handleMenuCategory('FP', imageId) },
    { label: 'UNDP', command: (event) => handleMenuCategory('UNDP', imageId) },
  ];

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowRight':
          handlePageClick(currentPage + 1);
          break;
        case 'ArrowLeft':
          handlePageClick(currentPage - 1);
          break;
        case 'F':
        case 'f':
          toggleFullScreen();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const setupScreen = async () => {
      let annotDet = await util.fetchData(`tileSlide/${Doctor}/${tileName}`, 'GET', 'application/json');
      console.log('tileSlide Response:', annotDet);
      setWidthTile(annotDet.tileDetail.width);
      setHeightTile(annotDet.tileDetail.height);

      let imagesArr = annotDet.Predicts.map(x => ({
        id: x.id,
        src: `http://127.0.0.1:8000/api/get_image/${Doctor}/${tileName}/${x.id}`,
        alt: x.title,
        zoom: 1,
        x: x.openSeaXCoord,
        y: x.openSeaYCoord,
        annotation: x.title,
        cat: x.cat,
        title: x.title
      }));

      let annotDetArr = annotDet.Predicts.map(x => ({
        xywh: `xywh=pixel:${x.x1},${x.y1},${x.x2 - x.x1},${x.y2 - x.y1}`,
        id: x.id,
        title: x.title,
        cat: x.cat
      }));

      setAnnotArr(annotDetArr);

      let newImgArr = [];
      let noCalls = Math.floor(imagesArr.length / 12);
      for (let i = 0; i < 3; i++) {
        let Images20 = imagesArr.slice(i * 12, (i + 1) * 12);
        let listImages = await Promise.all(Images20.map(images =>
          util.fetchData(`get_image/${Doctor}/${tileName}/${images.id}`, 'GET', 'image/jpeg')
            .then(response => response.blob())
            .then(blob => URL.createObjectURL(blob))
        ));

        Images20.forEach((x, index) => {
          x.src2 = listImages[index];
        });

        newImgArr = [...newImgArr, ...Images20];
        setImages(newImgArr);
      }
    };

    setupScreen();
  }, []);

  const onRightClick = (event, id) => {
    if (cm.current) {
      setImageId(id);
      cm.current.show(event);
    }
  };

  const handleMenuCategory = (cat, id) => {
    let oldCat = images.find(x => x.id === id).cat;
    if (oldCat.indexOf(cat) > -1) {
      return;
    }

    let newCat = oldCat + "," + cat;
    newCat = newCat.replace('none,', '');
    images.find(x => x.id === id).cat = newCat;
    setImages([...images]);
    currentItems.find(x => x.id === id).cat = newCat;

    util.fetchData(`updateCategory/${Doctor}/${tileName}/${id}/${newCat}`, 'GET', 'application/json');
  };

  const handleImageClick = (zoom, x, y, annotation) => {
    if (scaleSelected) {
      return;
    }
    console.log('Clicked tile data:', images.find(img => img.id === "1")); // For id "1" specifically
    // Or use annotation to match dynamically:
    console.log('Clicked tile data:', images.find(img => img.annotation === annotation));
    setSelectedAnnotation(annotation);
    setShowDragonView(true);
    setZoomLevel(4);
    setXCoord(x);
    setYCoord(y);
  };

  const handlePageClick = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > Math.ceil(images.length / itemsPerPage)) {
      return;
    }
    setCurrentPage(pageNumber);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(images.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const toggleFullScreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    }
  };

  const updateFilterBrigtness = (filterObj) => {
    setBrightness(filterObj.target.value);
    if (viewer && viewer.canvas) {
      viewer.canvas.style.filter = `brightness(${filterObj.target.value}%) contrast(${contrast}%) saturate(${saturation}%)`;
      setImageSettings(`brightness(${filterObj.target.value}%) contrast(${contrast}%) saturate(${saturation}%)`);
    }
  };

  const updateFilterContrast = (filterObj) => {
    setContrast(filterObj.target.value);
    if (viewer && viewer.canvas) {
      viewer.canvas.style.filter = `brightness(${brightness}%) contrast(${filterObj.target.value}%) saturate(${saturation}%)`;
      setImageSettings(`brightness(${brightness}%) contrast(${filterObj.target.value}%) saturate(${saturation}%)`);
    }
  };

  const updateFilterGamma = (filterObj) => {
    setGamma(filterObj.target.value);
    if (viewer && viewer.canvas) {
      viewer.canvas.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) opacity(${filterObj.target.value})`;
      setImageSettings(`brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) opacity(${filterObj.target.value})`);
    }
  };

  const updateFilterSaturation = (filterObj) => {
    setSaturation(filterObj.target.value);
    if (viewer && viewer.canvas) {
      viewer.canvas.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${filterObj.target.value}%)`;
      setImageSettings(`brightness(${brightness}%) contrast(${contrast}%) saturate(${filterObj.target.value}%)`);
    }
  };

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setGamma(1);
    setSaturation(100);
    if (viewer && viewer.canvas) {
      viewer.canvas.style.filter = 'brightness(100%) contrast(100%) saturate(100%)';
      setImageSettings('brightness(100%) contrast(100%) saturate(100%)');
    }
  };

  // Effect to handle viewer initialization
  useEffect(() => {
    if (viewer) {
      viewer.canvas.style.filter = imageSettings;
    }
  }, [viewer, imageSettings]);

  const onClose = () => {
    setRGBGraph(false);
  };

  const handleSliderChange = (newValue) => {
    setSliderValue(newValue);
  };

 
  return (
      <div className="flex flex-col h-screen w-screen bg-blue-50">
        {/* Main content area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Dialog */}
          <Dialog 
            open={RGBGraph} 
            onClose={onClose} 
            fullWidth 
            maxWidth="md"
          >
            <DialogTitle className="bg-blue-600 text-white">
              Frequency Intensity Graph
            </DialogTitle>
            <DialogContent>
              <FreqIntGraph min={0} max={255} step={1} onChange={handleSliderChange} />
            </DialogContent>
            <DialogActions className="bg-gray-50 p-4">
              <button 
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </DialogActions>
          </Dialog>
         
          {/* Sidebar */}
          <div className="w-40 bg-white shadow-lg flex-shrink-0 overflow-hidden">
            <div className="flex flex-col h-full p-3 space-y-3">
              {/* Fullscreen button */}
              <button 
                onClick={toggleFullScreen}
                className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded-md transition-colors"
              >
                <img src={fullScreenIcon} className="w-5 h-5" alt="Full Screen" />
                <span className="text-gray-700 text-sm">Full Screen</span>
              </button>

              {/* Grid dimensions */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 p-2">
                  <img src={gridIcon} className="w-5 h-5" alt="Adjust Dimension" />
                  <span className="text-gray-700 text-sm">Grid Size</span>
                </div>
                <div className="flex space-x-2 px-2">
                  <input
                    type="number"
                    value={gridx}
                    onChange={(event) => {
                      const newGridx = Number(event.target.value);
                      if (newGridx === 0) {
                        setGridx("");
                        return;
                      }
                      setGridx(newGridx);
                      setItemsPerPage(newGridx * gridy);
                    }}
                    className="w-16 p-1 border border-gray-300 rounded-md text-xs"
                  />
                  <input
                    type="number"
                    value={gridy}
                    onChange={(event) => {
                      const newGridy = Number(event.target.value);
                      if (newGridy === 0) {
                        setGridy("");
                        return;
                      }
                      setGridy(newGridy);
                      setItemsPerPage(gridx * newGridy);
                    }}
                    className="w-16 p-1 border border-gray-300 rounded-md text-xs"
                  />
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between px-2">
                <button
                  onClick={() => handlePageClick(currentPage - 1)}
                  className="p-2 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <img src={prevIcon} className="w-5 h-5" alt="Previous Page" />
                </button>
                <button
                  onClick={() => handlePageClick(currentPage + 1)}
                  className="p-2 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <img src={nextIcon} className="w-5 h-5" alt="Next Page" />
                </button>
              </div>

              {/* Image controls */}
              <button
                onClick={() => setScaleSelected(!scaleSelected)}
                className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded-md transition-colors w-full"
              >
                <img src={measureIcon} className="w-5 h-5" alt="Enable Measure" />
                <span className="text-gray-700 text-sm">Enable Measure</span>
              </button>

              {/* Image adjustment controls */}
              <div className="space-y-2 p-2">
                <button
                  onClick={resetFilters}
                  className="w-full px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs"
                >
                  Reset Filters
                </button>
                
                <div className="space-y-1">
                  <label className="text-xs text-gray-600">Brightness ({brightness}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={brightness}
                    onChange={updateFilterBrigtness}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs text-gray-600">Contrast ({contrast}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={contrast}
                    onChange={updateFilterContrast}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs text-gray-600">Gamma ({gamma})</label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={gamma}
                    onChange={updateFilterGamma}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs text-gray-600">Saturation ({saturation}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={saturation}
                    onChange={updateFilterSaturation}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Page navigation */}
              <div className="mt-auto text-center text-gray-700 text-xs">
                Page {currentPage} of {Math.ceil(images.length / itemsPerPage)}
              </div>
            </div>
          </div>
    
          {/* Main content with image grid */}
          <div 
            className="grid flex-grow ml-2 p-4"
            style={{
              gridTemplateColumns: `repeat(${gridx}, 1fr)`,
              gridTemplateRows: `repeat(${gridy}, 1fr)`,
              height: "calc(100vh - 50px)" // Adjusted for better viewport
            }}
          >
            {currentItems.map((image, index) => (
              <div key={index} className="relative group rounded-lg overflow-hidden shadow-md">
                <ContextMenu model={items} ref={cm} />
                <img
                  className={`w-full h-full object-cover rounded-lg ${scaleSelected ? 'cursor-crosshair' : 'cursor-pointer'}`}
                  src={image.src2}
                  alt={image.title}
                  onClick={() => handleImageClick(image.zoom, image.x, image.y, image.annotation)}
                  onContextMenu={(event) => onRightClick(event, image.id)}
                />
                <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white p-1 rounded-md text-xs">
                  {image.title}
                </div>
                {image.cat !== "none" && (
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white p-1 rounded-md text-xs">
                    {image.cat}
                  </div>
                )}
              </div>
            ))}
          </div>


    
          {/* Sliding pane */}
          <SlidingPane
            className="bg-white"
            overlayClassName="bg-black bg-opacity-50"
            isOpen={showDragonView}
            hideHeader={true}
            onRequestClose={() => setShowDragonView(false)}
          >
            <DeepZoomViewer
              widthTile={widthTile}
              heightTile={heightTile}
              setViewer2={setViewer}
              imageSettings={imageSettings}
              ref={childRef}
              zoomLevel={zoomLevel}
              xCoord={xCoord}
              yCoord={yCoord}
              annotDetArr={annotArr}
              Doctor={Doctor}
              tileName={tileName}
            />
          </SlidingPane>
        </div>
      </div>
    );
} 
export default SuspectedTileViewer;
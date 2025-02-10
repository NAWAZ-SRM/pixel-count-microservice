import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import gridIcon from "../resources/icons/menu.png";
import nextIcon from "../resources/icons/next.png";
import prevIcon from "../resources/icons/arrow.png";
import fullScreenIcon from "../resources/icons/fullscreen.png";
import nextPatient from '../resources/icons/next (1).png';
import previousPatient from '../resources/icons/back.png';
import measureIcon from '../resources/icons/measure.png';
import imageEdit from '../resources/icons/eye.png';
import util from '../util/datamanager';
import FreqIntGraph from "./FreqIntGraph";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import DeepZoomViewer from "./DeepZoomViewer";
import OpenSeadragon from "openseadragon";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { ContextMenu } from 'primereact/contextmenu';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

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
  const [brightness, setBrightness] = useState(50);
  const [saturation, setSaturation] = useState(80);
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
      setWidthTile(annotDet.tileDeatil.width);
      setHeightTile(annotDet.tileDeatil.height);

      let imagesArr = annotDet.Predicts.map(x => ({
        id: x.id,
        src: `http://localhost:5000/get_image/${Doctor}/${tileName}/${x.id}`,
        alt: x.title,
        zoom: 64,
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
      for (let i = 0; i < noCalls; i++) {
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

    setSelectedAnnotation(annotation);
    setShowDragonView(true);
    setZoomLevel(zoom);
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
    viewer.setFilterOptions({
      filters: {
        processors: OpenSeadragon.Filters.BRIGHTNESS(filterObj.target.value),
      },
      loadMode: 'sync'
    });
  };

  const updateFilterContrast = (filterObj) => {
    setContrast(filterObj.target.value);
    viewer.canvas.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    setImageSettings(`brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`);
  };

  const updateFilterGamma = (filterObj) => {
    setGamma(filterObj.target.value);
    viewer.setFilterOptions({
      filters: {
        processors: OpenSeadragon.Filters.GAMMA(filterObj.target.value),
      },
      loadMode: 'sync'
    });
  };

  const updateFilterSaturation = (filterObj) => {
    viewer.setFilterOptions({
      filters: {
        processors: OpenSeadragon.Filters.SATURATION(filterObj.target.value),
      },
      loadMode: 'sync'
    });
  };

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setGamma(1);
    setSaturation(100);
  };

  const onClose = () => {
    setRGBGraph(false);
  };

  const handleSliderChange = (newValue) => {
    setSliderValue(newValue);
  };

  return (
    <div className="flex h-screen">
      <Dialog open={RGBGraph} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Frequency Intensity Graph</DialogTitle>
        <DialogContent>
          <FreqIntGraph min={0} max={255} step={1} onChange={handleSliderChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <div className="flex">
        <SideNav onSelect={() => {}} style={{ background: "#faf9f6", width: "150px" }}>
          <SideNav.Toggle />
          <SideNav.Nav defaultSelected="fullScreen">
            <NavItem eventKey="home" onClick={toggleFullScreen}>
              <NavIcon>
                <img src={fullScreenIcon} style={{ width: "2rem" }} alt="Full Screen" />
              </NavIcon>
              <NavText>Full Screen</NavText>
            </NavItem>
            <NavItem eventKey="changeDimension">
              <NavIcon>
                <img src={gridIcon} style={{ width: "2rem" }} alt="Adjust Dimension" />
              </NavIcon>
              <NavText>Adjust Dimension</NavText>
              <NavItem eventKey="charts/linechart">
                <NavText>
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
                    style={{ height: "1rem" }}
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
                    style={{ height: "1rem" }}
                  />
                </NavText>
              </NavItem>
            </NavItem>
            <NavItem eventKey="nextPage">
              <NavIcon>
                <img onClick={() => handlePageClick(currentPage + 1)} src={nextIcon} style={{ width: "2rem" }} alt="Next Page" />
              </NavIcon>
              <NavText>Next Page</NavText>
            </NavItem>
            <NavItem eventKey="previousPage" onClick={() => handlePageClick(currentPage - 1)}>
              <NavIcon>
                <img src={prevIcon} style={{ width: "2rem" }} alt="Previous Page" />
              </NavIcon>
              <NavText>Previous Page</NavText>
            </NavItem>
            <NavItem active={false} eventKey="measure" onClick={() => setScaleSelected(!scaleSelected)}>
              <NavIcon>
                <img src={measureIcon} style={{ width: "2rem" }} alt="Enable Measure" />
              </NavIcon>
              <NavText>Enable Measure</NavText>
            </NavItem>
            <NavItem active={false} eventKey="changeImage" onClick={() => setScaleSelected(!scaleSelected)}>
              <NavIcon>
                <img src={imageEdit} style={{ width: "2rem" }} alt="Change Image" />
              </NavIcon>
              <NavItem>
                <NavText>
                  <div className="flex flex-col ml-2 w-52">
                    <button className="btn btn-primary mb-2" onClick={resetFilters}>
                      Reset
                    </button>
                    <label>
                      Brightness
                      <input
                        type="range"
                        min="-255"
                        max="255"
                        value={brightness}
                        onChange={updateFilterBrigtness}
                        className="form-range"
                        step="1"
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
                        className="form-range"
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
                        className="form-range"
                      />
                    </label>
                    <label>
                      Saturation
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={saturation}
                        onChange={updateFilterSaturation}
                        className="form-range"
                        step="1"
                      />
                    </label>
                  </div>
                </NavText>
              </NavItem>
            </NavItem>
            <NavItem active={false} eventKey="changeImage" onClick={() => setRGBGraph(true)}>
              <NavIcon>
                <img src={imageEdit} style={{ width: "2rem" }} alt="RGB Graph" />
              </NavIcon>
              <NavItem>
                <NavText>
                  <div className="flex flex-col ml-2 w-52 h-52 overflow-y-auto">
                    <FreqIntGraph min={0} max={255} step={1} onChange={handleSliderChange} />
                  </div>
                </NavText>
              </NavItem>
            </NavItem>
            <NavItem eventKey="nextPatient">
              <NavIcon>
                <img src={nextPatient} style={{ width: "2rem" }} alt="Next Patient" />
              </NavIcon>
              <NavText>Next Patient</NavText>
            </NavItem>
            <NavItem eventKey="previousPatient">
              <NavIcon>
                <img src={previousPatient} style={{ width: "2rem" }} alt="Previous Patient" />
              </NavIcon>
              <NavText>Previous Patient</NavText>
            </NavItem>
            <NavItem eventKey="changeDimension">
              <NavText className="ml-2">
                {currentPage}/{Math.ceil(images.length / itemsPerPage)}
              </NavText>
              <NavItem eventKey="charts/linechart">
                <NavText>
                  <input
                    onKeyDown={(event) => {
                      setCurrentPage(event.target.value);
                    }}
                    style={{ height: "1rem" }}
                  />
                </NavText>
              </NavItem>
            </NavItem>
          </SideNav.Nav>
        </SideNav>
        <div className="grid flex-grow ml-4 p-4" style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridx}, 1fr)`,
          gridTemplateRows: `repeat(${gridy}, 1fr)`,
          gap: "1rem"
        }}>
          {currentItems.map((image, index) => (
            <div key={index} className="relative group">
              <ContextMenu model={items} ref={cm} />
              <img
                className={`w-full h-full object-cover ${scaleSelected ? 'cursor-crosshair' : 'cursor-pointer'}`}
                src={image.src2}
                alt={image.title}
                onClick={() => handleImageClick(image.zoom, image.x, image.y, image.annotation)}
                onContextMenu={(event) => onRightClick(event, image.id)}
              />
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white p-1">
                {image.title}
              </div>
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white p-1">
                {image.cat === "none" ? '' : image.cat}
              </div>
            </div>
          ))}
        </div>
        <SlidingPane
          className="fullScreenSlidePane"
          overlayClassName="overlay"
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
};

export default SuspectedTileViewer;

import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';

// import imagereport from "../resources/test.jpg";
// import homeIcon from "../resources/icons/home (1).png";
import gridIcon from "../resources/icons/menu.png";
import nextIcon from "../resources/icons/next.png";
import prevIcon from "../resources/icons/arrow.png";
import fullScreenIcon from "../resources/icons/fullscreen.png";
import nextPatient from '../resources/icons/next (1).png'
import previousPatient from '../resources/icons/back.png'
import measureIcon from '../resources/icons/measure.png'
import imageEdit from '../resources/icons/eye.png'

import util from '../util/datamanager'


// import { Modal } from 'react-bootstrap';
import DeepZoomViewer from "./DeepZoomViewer";
import OpenSeadragon from "openseadragon";
// import Slider from '@mui/material/Slider';
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";

// import Draggable from 'react-draggable';

// import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { ContextMenu } from 'primereact/contextmenu';


import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';

// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css'


const SuspectedTileViewer = () => {
  //api call to get coordinates of selected file from the server

  const { Doctor, tileName } = useParams();

  const childRef = useRef();

  const [zoomLevel, setZoomLevel] = useState();
  const [xCoord, setXCoord] = useState();
  const [yCoord, setYCoord] = useState();

  const [annotArr, setAnnotArr] = useState([]);
  // const [annotArrNDPI, setAnnotArrNDPI] = useState([]);

  const [showDragonView, setShowDragonView] = useState(false);
  const [selectedAnnotaiton, setSelectedAnnotation] = useState(null);

  const [images, setImages] = useState([])

  const [gridx, setGridx] = useState(4);
  const [gridy, setGridy] = useState(3);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = images.slice(indexOfFirstItem, indexOfLastItem);

  const [imageId, setImageId] = useState();

  const [scaleSelected, setScaleSelected] = useState(false)

  const [gamma, setGamma] = useState(1);
  const [contrast, setContrast] = useState(100);
  const [brightness, setBrightness] = useState(50);
  const [saturation, setSaturation] = useState(80);

  const [imageSettings, setImageSettings] = useState(`brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`)

  const [viewer, setViewer] = useState('')

  const [widthTile, setWidthTile] = useState()
  const [heightTile, setHeightTile] = useState()

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
          // Call the function for the right arrow key here
          handlePageClick(currentPage + 1);
          break;
        case 'ArrowLeft':
          // Call the function for the left arrow key here
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

    window.addEventListener('click', (event) => {



      const x = event.clientX;
      const y = event.clientY;

      // Log the coordinates
      console.log(`X: ${x}, Y: ${y}`);

    });

    const setupScreen = async () => {

      let annotDet = await util.fetchData(`tileSlide/${Doctor}/${tileName}`, 'GET', 'application/json')

      setWidthTile(annotDet.tileDeatil.width)
      setHeightTile(annotDet.tileDeatil.height)

      let imagesArr = annotDet.Predicts.map(x => {
        return {
          id: x.id,
          src: `http://0.0.0.0:5000/get_image/${Doctor}/${tileName}/${x.id}`,
          alt: x.title,
          zoom: 64,
          x: x.openSeaXCoord,
          y: x.openSeaYCoord,
          annotation: x.title,
          cat: x.cat,
          title: x.title
        }

      })


      let annotDetArr = annotDet.Predicts.map(x => {
        return {
          xywh: `xywh=pixel:${x.x1},${x.y1},${x.x2 - x.x1},${x.y2 - x.y1}`,
          id: x.id,
          title: x.title,
          cat: x.cat
        }
      })

      setAnnotArr(annotDetArr);

      let Images20, newImgArr = [], newImgArr2;
      let noCalls = Math.floor(imagesArr.length / 12);
      for (var i = 0; i < noCalls; i++) {

        Images20 = imagesArr.slice(i * 12, (i + 1) * 12);

        let listImages = await Promise.all(Images20.map(images =>
          util.fetchData(`get_image/${Doctor}/${tileName}/${images.id}`, 'GET', 'image/jpeg')
            .then(response => response.blob())
            .then(blob => URL.createObjectURL(blob))
        )
        );

        Images20.forEach((x, index) => {

          x.src2 = listImages[index]

        })

        newImgArr = [...newImgArr, ...Images20]

        setImages(newImgArr)
      }

    }

    setupScreen()

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
    newCat = newCat.replace('none,', '')
    images.find(x => x.id === id).cat = newCat;
    setImages([...images]);
    currentItems.find(x => x.id === id).cat = newCat;

    util.fetchData(`updateCategory/${Doctor}/${tileName}/${id}/${newCat}`, 'GET', 'application/json')

  }

  const handleImageClick = (zoom, x, y, annotation) => {

    if (scaleSelected) {
      return;
    }

    setSelectedAnnotation(annotation)
    setShowDragonView(true)
    // setZoomLevel(1);
    // setXCoord(0);
    // setYCoord(0);
    setZoomLevel(zoom);
    setXCoord(x);
    setYCoord(y);

  };



  const handlePageClick = (pageNumber) => {
    if (
      pageNumber < 1
      ||
      pageNumber > Math.ceil(images.length / itemsPerPage)
    ) {
      return;
    }
    setCurrentPage(pageNumber);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(images.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const toggleFullScreen = (event) => {

    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) { /* Firefox */
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { /* IE/Edge */
      document.documentElement.msRequestFullscreen();
    }
  }

  const updateFilterBrigtness = (filterObj) => {
    setBrightness(filterObj.target.value);

    viewer.setFilterOptions({
      filters: {
        processors: OpenSeadragon.Filters.BRIGHTNESS(filterObj.target.value),
        // processors: OpenSeadragon.Filters.INVERT()
      },
      loadMode: 'sync'
    });

    // setImageSettings(`brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`);
    // viewer.canvas.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
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
        // processors: OpenSeadragon.Filters.INVERT()
      },
      loadMode: 'sync'
    });
    // viewer.canvas.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    // setImageSettings(`brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`);
  };

  //write a similart method for saturation
  const updateFilterSaturation = (filterObj) => {

    viewer.setFilterOptions({
      filters: {
        processors: OpenSeadragon.Filters.SATURATION(filterObj.target.value),
        // processors: OpenSeadragon.Filters.INVERT()
      },
      loadMode: 'sync'
    });

    // setSaturation(filterObj.target.value);
    // viewer.canvas.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    // setImageSettings(`brightness(${brightness}%) contrast(${contrast}%) saturate(80%)`);
  };

  const resetFilters = function () {
    setBrightness(100);
    setContrast(100);
    setGamma(1);
    setSaturation(100);
    // viewer.canvas.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

  };

  const filterStyle = {
    // filter: `brightness(${red}%) contrast(${green}%) saturate(${blue}%)`
    filter: `brightness(40%) contrast(200%) saturate(150%)`
  };

  return (
    <div>

      {/* <Draggable >
        <div className="dialogBox" style={{position: "absolute", top: "50%", zIndex:"1000", transform: "translate(-50%, -50%)"}}>
          This dialog box can be dragged around.
        </div>
      </Draggable> */}


      <div style={{ display: "flex" }}>
        <div>
          <SideNav
            onSelect={(selected) => {

            }}
            style={{ background: "#1976d2" }}>
            <SideNav.Toggle />
            <SideNav.Nav defaultSelected="fullScreen">
              <NavItem eventKey="home" onClick={(event) => toggleFullScreen(event)}>
                <NavIcon>

                  <img src={fullScreenIcon} style={{ fontSize: '1rem', width: "2rem", color: "white" }} />
                </NavIcon>
                <NavText>
                  Home
                </NavText>
              </NavItem>

              <NavItem eventKey="changeDimension">
                <NavIcon>

                  <img src={gridIcon} style={{ fontSize: '1rem', width: "2rem", color: "white" }} />
                </NavIcon>
                <NavText>
                  Adjust Dimension
                </NavText>
                <NavItem eventKey="charts/linechart">
                  <NavText>
                    <input
                      type="number"
                      value={gridx}
                      onChange={(event) => {
                        const newGridx = Number(event.target.value);
                        if (newGridx === 0) {
                          setGridx("")
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
                          setGridy("")
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
              <NavItem eventKey="nextPage" >
                <NavIcon>
                  {/* <i src={homeIcon} className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} /> */}
                  <img onClick={() => handlePageClick(currentPage + 1)} src={nextIcon} style={{ fontSize: '1rem', width: "2rem", color: "white" }}>

                  </img>
                  {/* <div style={{position: "absolute", top: "10px", left: "10px", color: "white", background: "rgba(0, 0, 0, 0.5)", padding: "5px"}}>
                    Your Title Here
                  </div> */}
                </NavIcon>
                <NavText>
                  Next Page
                </NavText>
              </NavItem>
              <NavItem eventKey="previousPage" onClick={() => handlePageClick(currentPage - 1)}>
                <NavIcon>
                  {/* <i src={homeIcon} className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} /> */}
                  <img src={prevIcon} style={{ fontSize: '1rem', width: "2rem", color: "white" }} />
                </NavIcon>
                <NavText>
                  Previous Page
                </NavText>
              </NavItem>
              <NavItem active={false} eventKey="measure" onClick={() => { setScaleSelected(!scaleSelected); }}>
                <NavIcon>
                  {/* <i src={homeIcon} className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} /> */}
                  <img src={measureIcon} style={{ fontSize: '1rem', width: "2rem", color: "white" }} />
                </NavIcon>
                <NavText>
                  Enable Measure
                </NavText>
              </NavItem>
              <NavItem active={false} eventKey="changeImage" onClick={() => { setScaleSelected(!scaleSelected); }}>
                <NavIcon>
                  {/* <i src={homeIcon} className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} /> */}
                  <img src={imageEdit} style={{ fontSize: '1rem', width: "2rem", color: "white" }} />
                </NavIcon>
                <NavItem>
                  <NavText>
                    <div
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
                          min="-255"
                          max="255"
                          value={brightness}
                          onChange={updateFilterBrigtness}
                          tooltip="true"
                          class="form-range"
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
                          min="-100"
                          max="100"
                          value={saturation}
                          onChange={updateFilterSaturation}
                          class="form-range"
                          step="1"
                        />
                      </label>


                    </div>
                  </NavText>
                </NavItem>
              </NavItem>
              <NavItem eventKey="nextPatient" >
                <NavIcon>
                  {/* <i src={homeIcon} className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} /> */}
                  <img src={nextPatient} style={{ fontSize: '1rem', width: "2rem", color: "white" }} />
                </NavIcon>
                <NavText>
                  Next Patient
                </NavText>
              </NavItem>
              <NavItem eventKey="previousPatient" >
                <NavIcon>
                  {/* <i src={homeIcon} className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} /> */}
                  <img src={previousPatient} style={{ fontSize: '1rem', width: "2rem", color: "white" }} className={filterStyle} />
                </NavIcon>
                <NavText>
                  Previous Patient
                </NavText>
              </NavItem>


              <NavItem eventKey="changeDimension">

                <NavText style={{ marginLeft: "0.7rem" }}>
                  {currentPage}/{Math.ceil(images.length / itemsPerPage)}
                </NavText>
                <NavItem eventKey="charts/linechart">
                  <NavText>
                    <input onKeyDown={(event) => {
                      setCurrentPage(event.target.value)
                    }} style={{ height: "1rem" }}></input>
                  </NavText>
                </NavItem>
              </NavItem>
            </SideNav.Nav>
          </SideNav>
        </div>
        <div className="grid" style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridx}, 1fr)`,
          gridTemplateRows: `repeat(${gridy}, 1fr)`,
          marginLeft: "65px"
        }}>
          {currentItems.map((image, index) => (
            <div key={index} className="grid-item" style={{ position: 'relative' }}>
              <ContextMenu model={[...items,]} ref={cm} breakpoint="767px" />
              <img className={(scaleSelected) ? 'imageBtnScale' : 'imageBtn'} src={image.src2} alt="" onClick={() => handleImageClick(image.zoom, image.x, image.y, image.annotation)} style={{ height: "100%" }} onContextMenu={(event) => onRightClick(event, image.id)} />


              <div style={{ position: "absolute", top: "10px", left: "10px", color: "white", background: "rgba(0, 0, 0, 0.5)", padding: "5px" }}>
                {image.title}
              </div>
              <div style={{ position: "absolute", bottom: "10px", left: "10px", color: "white", background: "rgba(0, 0, 0, 0.5)", padding: "5px" }}>
                {image.cat === "none" ? '' : image.cat}
              </div>
            </div>
          ))}
        </div>
        <SlidingPane
          className="some-custom-class fullScreenSlidePane"
          overlayClassName="some-custom-overlay-class"
          isOpen={showDragonView}

          // title={selectedAnnotaiton}
          hideHeader={true}

          // subtitle="Optional subtitle."
          onRequestClose={() => {
            // triggered on "<" on left top click or on outside click
            setShowDragonView(false);
          }}
        >
          <DeepZoomViewer widthTile={widthTile} heightTile={heightTile} setViewer2={setViewer} imageSettings={imageSettings} ref={childRef} zoomLevel={zoomLevel} xCoord={xCoord} yCoord={yCoord} annotDetArr={annotArr} Doctor={Doctor} tileName={tileName}></DeepZoomViewer>
        </SlidingPane>
      </div>

    </div >
  );
};

export default SuspectedTileViewer;

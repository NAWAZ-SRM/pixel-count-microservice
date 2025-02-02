import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import "@recogito/annotorious-openseadragon/dist/annotorious.min.css";

// import DeepZoomMain from "./components/DeepZoomMain";
import SuspectedTileViewer from "./components/SuspectedTileViewer";
import FileViewer from "./components/FileViewer";

import ReactGallery from "./components/ReactGallery";


import "./App.css";

// import Toolbar from "./components/Toolbar";

function App() {

  const [doctorAndReport, setDoctorAndReport] = useState([])

  useEffect(() => {

    const fetchData = async (pathT) => {
      const path = `http://localhost:5000/${pathT}`; // Replace with your API path
      const method = 'GET'; // Replace with your method
      const body = {}; // Replace with your body

      return new Promise((resolve, reject) => {
        fetch(path, {
          method: method,
          headers: {
            'Content-Type': 'application/json'
          }
        })

          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response;
          })
          .then((data) => {
            resolve(data.json());
          })
          .catch((error) => {
            console.error('There was a problem with the fetch operation: ', error);
            reject(error);
          });
      });
    }

    const doctorData = async function () {
      let data = await fetchData('getDoctors')

      // let doctorAndReport = data.find(x => x.children).children.map(y => {return {name:y.name, files: y.children}})

      // setDoctorAndReport(data.find(x => x.children).children.map(y => { return { name: y.name, files: y.children } }));
      setDoctorAndReport(data)

      // console.log(data.doctorData)
    }

    doctorData();

  }, [])

  return (

    <div style={{ marginTop: "1rem" }}>
      {/* <Toolbar style={{ "margin-bottom": "1rem" }} /> */}
      {
        doctorAndReport.length > 0 && <BrowserRouter >

          <Routes>
            <Route path="/" element={<FileViewer doctorData={doctorAndReport} />} />
            <Route path="/about/:Doctor/:tileName" element={<SuspectedTileViewer doctorData={doctorAndReport} />} />
            {/* <Route path="/gal" element={<ReactGallery doctorData={doctorAndReport}/>} /> */}

          </Routes>
        </BrowserRouter>

      }

    </div>













    //   <BrowserRouter>
    //   <Routes>
    //     <Route path="/" element={<DeepZoomMain />} />
    //     <Route path="/about" element={<DeepZoomMain />} />
    //   </Routes>
    // </BrowserRouter>


    // <div className="App">
    //   <Toolbar style={{ "margin-bottom": "1rem" }} />
    //   {/* <SideMenu /> */}
    //   {/* <DeepZoomViewer tileSources="https://openseadragon.github.io/example-images/highsmith/highsmith.dzi" slide={slide}/> */}
    //   <div style={{ display: "flex" }}>
    //     <div style={{ width: "50%", margin: '1rem' }}>
    //       <SuspectedTileViewer></SuspectedTileViewer>
    //     </div>
    //     <DeepZoomViewer />

    //   </div>
    // </div>
  );

  // );
}

export default App;

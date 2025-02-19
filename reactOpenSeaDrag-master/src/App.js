// import React, { useEffect, useState } from "react";
// import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import "@recogito/annotorious-openseadragon/dist/annotorious.min.css";

// import SuspectedTileViewer from "./components/SuspectedTileViewer";
// import FileViewer from "./components/FileViewer";
// import ReactGallery from "./components/ReactGallery";
// import ParentComponent from "./components/ParentComponent";

// import "./App.css";

// function App() {
//   const [doctorAndReport, setDoctorAndReport] = useState([]);

//   useEffect(() => {
//     const fetchData = async (pathT) => {
//       const path = `http://localhost:5000/${pathT}`;
//       const method = 'GET';
//       const body = {};

//       return new Promise((resolve, reject) => {
//         fetch(path, {
//           method: method,
//           headers: {
//             'Content-Type': 'application/json'
//           }
//         })
//           .then((response) => {
//             if (!response.ok) {
//               throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             return response;
//           })
//           .then((data) => {
//             resolve(data.json());
//           })
//           .catch((error) => {
//             console.error('There was a problem with the fetch operation: ', error);
//             reject(error);
//           });
//       });
//     }

//     const doctorData = async function () {
//       let data = await fetchData('getDoctors');
//       setDoctorAndReport(data);
//       console.log(data)
//     }

//     doctorData();
//     console.log(doctorData());
//   }, []);

//   return (
//     <div className="min-h-screen flex flex-col bg-blue-50 w-screen">
//       <header className="bg-blue-600 text-white shadow py-4 w-screen">
//         <div className="container mx-auto text-center text-2xl font-semibold w-screen">
//           Clinical Slide Viewer
//         </div>
//       </header>
//       <main className="flex-grow container mx-auto p-6">
//         {doctorAndReport.length > 0 ? (
//           <BrowserRouter>
//             <Routes>
//               <Route path="/" element={<FileViewer doctorData={doctorAndReport} />} />
//               <Route path="/about/:Doctor/:tileName" element={<SuspectedTileViewer doctorData={doctorAndReport} />} />
//               <Route path="/gal" element={<ReactGallery doctorData={doctorAndReport} />} />
//             </Routes>
//           </BrowserRouter>
//         ) : (
//           <div className="flex flex-col items-center justify-center space-y-4">
//             <div className="text-blue-600 text-lg">
//               Loading data...
//             </div>
//             <div className="loader ease-linear rounded-full border-4 border-t-4 border-blue-200 h-12 w-12"></div>
//           </div>
//         )}
//       </main>
//       <footer className="bg-blue-600 text-white py-4 text-center">
//         <div className="container mx-auto">
//           &copy; 2025 Vyuhaa Clinical Slide Viewer. All rights reserved.
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default App;


import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import "@recogito/annotorious-openseadragon/dist/annotorious.min.css";

import SuspectedTileViewer from "./components/SuspectedTileViewer";
import FileViewer from "./components/FileViewer";
import ReactGallery from "./components/ReactGallery";
import ParentComponent from "./components/ParentComponent";

import "./App.css";

function App() {
  const [doctorAndReport, setDoctorAndReport] = useState([]);

  useEffect(() => {
    const fetchData = async (pathT) => {
      const path = `http://34.28.249.83:5000/${pathT}`;
      const method = 'GET';
      const body = {};

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
      let data = await fetchData('getDoctors');
      setDoctorAndReport(data);
      console.log(data)
    }

    doctorData();
    console.log(doctorData());
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-10 bg-blue-50">
      <header className="bg-blue-600 text-white shadow py-4 w-full">
        <div className="container mx-auto text-center text-2xl font-semibold">
          Clinical Slide Viewer
        </div>
      </header>
      <main className="flex-grow container mx-auto p-6 overflow-x-auto">
        {doctorAndReport.length > 0 ? (
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<FileViewer doctorData={doctorAndReport} />} />
              <Route path="/about/:Doctor/:tileName" element={<SuspectedTileViewer doctorData={doctorAndReport} />} />
              <Route path="/gal" element={<ReactGallery doctorData={doctorAndReport} />} />
            </Routes>
          </BrowserRouter>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="text-blue-600 text-lg">
              Loading data...
            </div>
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-blue-200 h-12 w-12"></div>
          </div>
        )}
      </main>
      <footer className="bg-blue-600 text-white py-4 text-center w-full">
        <div className="container mx-auto">
          &copy; 2025 Vyuhaa Clinical Slide Viewer. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;

// // reactOpenseadrag-master/src/App.js
// import React, { useEffect, useState } from "react";
// import { Route, Routes, Navigate } from 'react-router-dom';
// import "@recogito/annotorious-openseadragon/dist/annotorious.min.css";
// import SuspectedTileViewer from "./components/SuspectedTileViewer";
// import FileViewer from "./components/FileViewer";
// import ReactGallery from "./components/ReactGallery";
// import Signup from "./components/Signup";
// import Login from "./components/Login";
// import "./App.css";

// function App() {
//   const [doctorAndReport, setDoctorAndReport] = useState([]);
//   const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

//   console.log('App render - isAuthenticated:', isAuthenticated);

//   useEffect(() => {
//     const handleStorageChange = () => {
//       const token = localStorage.getItem('token');
//       setIsAuthenticated(!!token);
//       console.log('Storage changed - isAuthenticated:', !!token);
//     };

//     handleStorageChange();
//     window.addEventListener('storage', handleStorageChange);
//     return () => {
//       window.removeEventListener('storage', handleStorageChange);
//     };
//   }, []);

//   useEffect(() => {
//     const fetchData = async (pathT) => {
//       const path = `http://34.28.249.83:8000/api/${pathT}`;
//       const token = localStorage.getItem('token');
//       console.log('Fetching data with token:', token);
//       return new Promise((resolve, reject) => {
//         fetch(path, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Token ${token}`,
//           },
//         })
//           .then((response) => {
//             console.log('Fetch response status:', response.status);
//             if (!response.ok) {
//               throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             return response;
//           })
//           .then((data) => resolve(data.json()))
//           .catch((error) => {
//             console.error('Fetch error:', error);
//             reject(error);
//           });
//       });
//     };

//     const doctorData = async () => {
//       try {
//         const data = await fetchData('getDoctors');
//         setDoctorAndReport(data.doctors);
//         console.log('Set doctorAndReport:', data.doctors);
//       } catch (error) {
//         console.error('doctorData Error:', error);
//         setDoctorAndReport([]);
//       }
//     };

//     if (isAuthenticated) {
//       console.log('isAuthenticated is true, fetching doctor data');
//       doctorData();
//     } else {
//       console.log('isAuthenticated is false, skipping fetch');
//     }
//   }, [isAuthenticated]);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     setIsAuthenticated(false);
//     setDoctorAndReport([]);
//     console.log('Logged out, isAuthenticated set to false');
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-10 bg-blue-50">
//       <header className="bg-blue-600 text-white shadow py-4 w-full">
//         <div className="container mx-auto flex justify-between items-center px-6">
//           <div className="text-2xl font-semibold">
//             Clinical Slide Viewer
//           </div>
//           {isAuthenticated && (
//             <button
//               onClick={handleLogout}
//               className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
//             >
//               Logout
//             </button>
//           )}
//         </div>
//       </header>
//       <main className="flex-grow container mx-auto p-6 overflow-x-auto">
//         <Routes>
//           <Route path="/api/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
//           <Route path="/api/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
//           <Route
//             path="/"
//             element={
//               isAuthenticated ? (
//                 doctorAndReport.length > 0 ? (
//                   <FileViewer doctorData={doctorAndReport} />
//                 ) : (
//                   <div className="flex flex-col items-center justify-center space-y-4">
//                     <div className="text-blue-600 text-lg">Loading data...</div>
//                     <div className="loader ease-linear rounded-full border-4 border-t-4 border-blue-200 h-12 w-12"></div>
//                   </div>
//                 )
//               ) : (
//                 <Navigate to="/api/login" replace />
//               )
//             }
//           />
//           <Route
//             path="/about/:Doctor/:tileName"
//             element={
//               isAuthenticated ? (
//                 <SuspectedTileViewer doctorData={doctorAndReport} />
//               ) : (
//                 <Navigate to="/api/login" replace />
//               )
//             }
//           />
//           <Route
//             path="/gal"
//             element={
//               isAuthenticated ? (
//                 <ReactGallery doctorData={doctorAndReport} />
//               ) : (
//                 <Navigate to="/api/login" replace />
//               )
//             }
//           />
//         </Routes>
//       </main>
//       <footer className="bg-blue-600 text-white py-4 text-center w-full">
//         <div className="container mx-auto">
//           © 2025 Vyuhaa Clinical Slide Viewer. All rights reserved.
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default App;









// import React, { useEffect, useState } from "react";
// import { Route, Routes, Navigate } from 'react-router-dom';
// import { UserCircle, LogOut } from "lucide-react"; // Profile & Logout icons
// import "@recogito/annotorious-openseadragon/dist/annotorious.min.css";
// import SuspectedTileViewer from "./components/SuspectedTileViewer";
// import FileViewer from "./components/FileViewer";
// import ReactGallery from "./components/ReactGallery";
// import Signup from "./components/Signup";
// import Login from "./components/Login";
// import "./App.css";

// function App() {
//   const [doctorAndReport, setDoctorAndReport] = useState([]);
//   const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const username = localStorage.getItem('username') || "User"; // Default if username is not stored

//   useEffect(() => {
//     const handleStorageChange = () => {
//       const token = localStorage.getItem('token');
//       setIsAuthenticated(!!token);
//     };

//     handleStorageChange();
//     window.addEventListener('storage', handleStorageChange);
//     return () => {
//       window.removeEventListener('storage', handleStorageChange);
//     };
//   }, []);

//   useEffect(() => {
//     const fetchData = async (pathT) => {
//       const path = `http://34.28.249.83:8000/api/${pathT}`;
//       const token = localStorage.getItem('token');
//       return new Promise((resolve, reject) => {
//         fetch(path, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Token ${token}`,
//           },
//         })
//           .then((response) => {
//             if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//             return response;
//           })
//           .then((data) => resolve(data.json()))
//           .catch((error) => {
//             reject(error);
//           });
//       });
//     };

//     const doctorData = async () => {
//       try {
//         const data = await fetchData('getDoctors');
//         setDoctorAndReport(data.doctors);
//       } catch (error) {
//         setDoctorAndReport([]);
//       }
//     };

//     if (isAuthenticated) doctorData();
//   }, [isAuthenticated]);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('username'); // Remove username on logout
//     setIsAuthenticated(false);
//     setDoctorAndReport([]);
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-10 bg-blue-50">
//       <header className="bg-blue-600 text-white shadow py-4 w-full">
//         <div className="container mx-auto flex justify-between items-center px-6">
//           <div className="text-2xl font-semibold">Clinical Slide Viewer</div>

//           {isAuthenticated && (
//             <div className="relative">
//               {/* Profile Icon */}
//               <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="focus:outline-none">
//                 <UserCircle className="w-8 h-8 text-white hover:text-gray-200" />
//               </button>

//               {/* Profile Dropdown */}
//               {showProfileMenu && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
//                   <div className="px-4 py-2 text-gray-900 border-b border-gray-200">
//                     {username}
//                   </div>
//                   <button
//                     onClick={handleLogout}
//                     className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-100 transition"
//                   >
//                     <LogOut className="w-5 h-5 mr-2" />
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </header>

//       <main className="flex-grow container mx-auto p-6 overflow-x-auto">
//         <Routes>
//           <Route path="/api/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
//           <Route path="/api/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
//           <Route
//             path="/"
//             element={
//               isAuthenticated ? (
//                 doctorAndReport.length > 0 ? (
//                   <FileViewer doctorData={doctorAndReport} />
//                 ) : (
//                   <div className="flex flex-col items-center justify-center space-y-4">
//                     <div className="text-blue-600 text-lg">Loading data...</div>
//                     <div className="loader ease-linear rounded-full border-4 border-t-4 border-blue-200 h-12 w-12"></div>
//                   </div>
//                 )
//               ) : (
//                 <Navigate to="/api/login" replace />
//               )
//             }
//           />
//           <Route path="/about/:Doctor/:tileName" element={isAuthenticated ? <SuspectedTileViewer doctorData={doctorAndReport} /> : <Navigate to="/api/login" replace />} />
//           <Route path="/gal" element={isAuthenticated ? <ReactGallery doctorData={doctorAndReport} /> : <Navigate to="/api/login" replace />} />
//         </Routes>
//       </main>

//       <footer className="bg-blue-600 text-white py-4 text-center w-full">
//         <div className="container mx-auto">© 2025 Vyuhaa Clinical Slide Viewer. All rights reserved.</div>
//       </footer>
//     </div>
//   );
// }

// export default App;






import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from 'react-router-dom';
import { UserCircle, LogOut } from "lucide-react"; 
import "@recogito/annotorious-openseadragon/dist/annotorious.min.css";
import SuspectedTileViewer from "./components/SuspectedTileViewer";
import FileViewer from "./components/FileViewer";
import ReactGallery from "./components/ReactGallery";
import Signup from "./components/Signup";
import Login from "./components/Login";
import "./App.css";

function App() {
  const [doctorAndReport, setDoctorAndReport] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState("");

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const fetchData = async (pathT) => {
      const path = `http://34.28.249.83:8000/api/${pathT}`;
      const token = localStorage.getItem('token');
      return new Promise((resolve, reject) => {
        fetch(path, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        })
          .then((response) => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
          })
          .then((data) => resolve(data))
          .catch((error) => {
            reject(error);
          });
      });
    };

    const doctorData = async () => {
      try {
        const data = await fetchData('getDoctors');
        setDoctorAndReport(data.doctors);
        if (data.doctors.length > 0) {
          setSelectedDoctor(data.doctors[0].name); // Default to first doctor
        }
      } catch (error) {
        setDoctorAndReport([]);
      }
    };

    if (isAuthenticated) doctorData();
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setDoctorAndReport([]);
    setSelectedDoctor(""); // Reset doctor selection on logout
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-10 bg-blue-50">
      {/* <header className="bg-blue-600 text-white shadow py-4 w-full">
        <div className="container mx-auto flex justify-between items-center px-6">
          <div className="text-2xl font-semibold">Clinical Slide Viewer</div>

          {isAuthenticated && (
            
            
            

            <div className="relative">
              
              <div className="flex items-center space-x-6">
              
              <div className="text-white font-semibold">{selectedDoctor}</div></div>

             
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="focus:outline-none">
                <UserCircle className="w-8 h-8 text-white hover:text-gray-200" />
              </button>

             
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="px-4 py-2 text-gray-900 border-b border-gray-200">
                    {selectedDoctor || "Select a doctor"}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-100 transition"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header> */}



<header className="bg-blue-600 text-white shadow py-4 w-full">
  <div className="container mx-auto flex justify-between items-center px-6">
    <div className="text-2xl font-semibold">Clinical Slide Viewer</div>

    {isAuthenticated && (
      <div className="relative flex items-center space-x-4">
        {/* Display Selected Doctor */}
        <div className="text-white font-semibold">{selectedDoctor}</div>

        {/* Profile Icon */}
        <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="focus:outline-none">
          <UserCircle className="w-8 h-8 text-white hover:text-gray-200" />
        </button>

        {/* Profile Dropdown */}
        {showProfileMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="px-4 py-2 text-gray-900 border-b border-gray-200">
              {selectedDoctor || "Select a doctor"}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-100 transition"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        )}
      </div>
    )}
  </div>
</header>


      <main className="flex-grow container mx-auto p-6 overflow-x-auto">
        <Routes>
          <Route path="/api/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/api/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                doctorAndReport.length > 0 ? (
                  <FileViewer doctorData={doctorAndReport} onDoctorSelect={setSelectedDoctor} />
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="text-blue-600 text-lg">Loading data...</div>
                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-blue-200 h-12 w-12"></div>
                  </div>
                )
              ) : (
                <Navigate to="/api/login" replace />
              )
            }
          />
          <Route path="/about/:Doctor/:tileName" element={isAuthenticated ? <SuspectedTileViewer doctorData={doctorAndReport} /> : <Navigate to="/api/login" replace />} />
          <Route path="/gal" element={isAuthenticated ? <ReactGallery doctorData={doctorAndReport} /> : <Navigate to="/api/login" replace />} />
        </Routes>
      </main>

      <footer className="bg-blue-600 text-white py-4 text-center w-full">
        <div className="container mx-auto">© 2025 Vyuhaa Clinical Slide Viewer. All rights reserved.</div>
      </footer>
    </div>
  );
}

export default App;

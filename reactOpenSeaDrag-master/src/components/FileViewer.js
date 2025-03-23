









// reactOpenseadrag-master/src/components/FileViewer.js
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// const FileViewer = ({ doctorData }) => {
//   const navigate = useNavigate();
//   const [show, setShow] = useState(false);
//   const [listReports, setListReports] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [people] = useState(doctorData); // Renamed from doctorData to match old version
//   const [selectedDoctor, setSelectedDoctor] = useState(people[0]?.name || "");

//   const handleItemClick = (files, doctorName) => {
//     setSelectedDoctor(doctorName);
//     setListReports(files);
//     setShow(true);
//   };

//   const handleClose = () => setShow(false);

//   const navigateToPage = async (tileName) => {
//     navigate(`/about/${selectedDoctor}/${tileName}`);
//   };

//   return (
//     <div className="container mx-auto px-4">
//       {/* Modal */}
//       {show && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
//             <div className="p-4 border-b border-gray-200">
//               <div className="flex justify-between items-center">
//                 <h3 className="text-lg font-semibold text-gray-900">Reports</h3>
//                 <button
//                   onClick={handleClose}
//                   className="text-gray-400 hover:text-gray-500"
//                 >
//                   <span className="sr-only">Close</span>
//                   <svg
//                     className="h-6 w-6"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M6 18L18 6M6 6l12 12"
//                     />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//             <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
//               {listReports.map((item, index) => (
//                 <li
//                   key={index}
//                   onClick={() => navigateToPage(item)}
//                   className="p-4 hover:bg-blue-50 cursor-pointer"
//                 >
//                   {item}
//                 </li>
//               ))}
//             </ul>
//             <div className="p-4 border-t border-gray-200">
//               <button
//                 onClick={handleClose}
//                 className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Date Picker Section */}
//       <div className="mt-8 space-y-2">
//         <h2 className="text-xl font-semibold text-gray-900">Select a Date</h2>
//         <DatePicker
//           selected={selectedDate}
//           onChange={(date) => setSelectedDate(date)}
//           dateFormat="dd/MM/yyyy"
//           className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//         />
//       </div>

//       {/* Doctors List */}
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold text-gray-900 mb-4">Doctor's name</h2>
//         <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg">
//           {people.map((person) => (
//             <li
//               key={person.name}
//               onClick={() => handleItemClick(person.patients, person.name)}
//               className="p-4 hover:bg-blue-50 cursor-pointer transition-colors"
//             >
//               <p className="text-gray-900">{person.name}</p>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default FileViewer;










// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// const FileViewer = ({ doctorData }) => {
//   const navigate = useNavigate();
//   const [show, setShow] = useState(false);
//   const [listReports, setListReports] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [people] = useState(doctorData);
//   const [selectedDoctor, setSelectedDoctor] = useState(people[0]?.name || "");

//   const handleItemClick = (files) => {
//     setListReports(files);
//     setShow(true);
//   };

//   const handleClose = () => setShow(false);

//   const navigateToPage = (tileName) => {
//     navigate(`/about/${selectedDoctor}/${tileName}`);
//   };

//   return (
//     <div className="container mx-auto px-4">
//       {/* Greeting */}
//       <h1 className="text-2xl font-bold text-gray-900 mb-4">
//         Hello, {selectedDoctor}
//       </h1>

//       {/* Modal */}
//       {show && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
//             <div className="p-4 border-b border-gray-200 flex justify-between items-center">
//               <h3 className="text-lg font-semibold text-gray-900">Reports</h3>
//               <button
//                 onClick={handleClose}
//                 className="text-gray-400 hover:text-gray-500"
//               >
//                 <span className="sr-only">Close</span>
//                 <svg
//                   className="h-6 w-6"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//             </div>
//             <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
//               {listReports.map((item, index) => (
//                 <li
//                   key={index}
//                   onClick={() => navigateToPage(item)}
//                   className="p-4 hover:bg-blue-50 cursor-pointer"
//                 >
//                   {item}
//                 </li>
//               ))}
//             </ul>
//             <div className="p-4 border-t border-gray-200">
//               <button
//                 onClick={handleClose}
//                 className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Date Picker Section */}
//       <div className="mt-8 space-y-2">
//         <h2 className="text-xl font-semibold text-gray-900">Select a Date</h2>
//         <DatePicker
//           selected={selectedDate}
//           onChange={(date) => setSelectedDate(date)}
//           dateFormat="dd/MM/yyyy"
//           className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//         />
//       </div>

//       {/* Cases List */}
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold text-gray-900 mb-4">
//           Available Cases
//         </h2>
//         <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg">
//           {people
//             .filter((person) => person.name === selectedDoctor)
//             .flatMap((person) => person.patients)
//             .map((caseName, index) => (
//               <li
//                 key={index}
//                 onClick={() => navigateToPage(caseName)}
//                 className="p-4 hover:bg-blue-50 cursor-pointer transition-colors"
//               >
//                 {caseName}
//               </li>
//             ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default FileViewer;



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FileViewer = ({ doctorData, onDoctorSelect }) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [listReports, setListReports] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [people] = useState(doctorData);
  const [selectedDoctor, setSelectedDoctor] = useState(people[0]?.name || "");

  useEffect(() => {
    onDoctorSelect(selectedDoctor);
  }, [selectedDoctor, onDoctorSelect]);

  const handleItemClick = (files) => {
    setListReports(files);
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const navigateToPage = (tileName) => {
    navigate(`/about/${selectedDoctor}/${tileName}`);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Hello, {selectedDoctor}
      </h1>

      {show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Reports</h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {listReports.map((item, index) => (
                <li
                  key={index}
                  onClick={() => navigateToPage(item)}
                  className="p-4 hover:bg-blue-50 cursor-pointer"
                >
                  {item}
                </li>
              ))}
            </ul>
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleClose}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">Select a Date</h2>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="dd/MM/yyyy"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Available Cases
        </h2>
        <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg">
          {people
            .filter((person) => person.name === selectedDoctor)
            .flatMap((person) => person.patients)
            .map((caseName, index) => (
              <li
                key={index}
                onClick={() => navigateToPage(caseName)}
                className="p-4 hover:bg-blue-50 cursor-pointer transition-colors"
              >
                {caseName}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default FileViewer;


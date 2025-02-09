import React from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate  } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



import { Modal, Button } from 'react-bootstrap';

const FileViewer = (doctorData) => {

  const navigate = useNavigate();

  const [show, setShow] = useState(false)
  const [listReports, setListReports] = useState([])

  const [selectedDate, setSelectedDate] = useState(null);
  // const [people] = useState(doctorData.doctorData);
  const [people] = useState(doctorData.doctorData);

  const [selectedDoctor, setSelectedDoctor] = useState('')

  const handleItemClick = (files, doctorName) => {

    setSelectedDoctor(doctorName)

    setListReports(files)
    setShow(true)
    // Navigate to /about when a list item is clicked
    // You need to set up React Router for this navigation to work
    // Example: <Link to="/about">About</Link>
    // This assumes you have React Router set up in your application
  };

  const handleClose = () => {
    setShow(false)
  }

  const openModal = () => {

    setShow(true)
  }

  const navigateToPage = async (tileName) => {

    // let data = await fetchData(`loadTile/${selectedDoctor}/${tileName}`) 
    // console.log(data);
    navigate(`/about/${selectedDoctor}/${tileName}`);

  }

  const fetchData = async (pathT) => {
    const path = `http://127.0.0.1:5000/${pathT}`; // Replace with your API path
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

  return (
    <div className="container">

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Reports</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul className="list-group">
            {listReports.map((item, index) => (
              <li key={index} className="list-group-item" onClick={() => {navigateToPage(item)}}>{item}</li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="mt-3">
        <h2>Select a Date</h2>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="dd/MM/yyyy"
          className="form-control"
        />
      </div>
      <h2>Doctor's name</h2>
      <ul className="list-group">
        {people.map((person) => (

          <li
            key={person.name}
            className="list-group-item"
            onClick={() => { handleItemClick(person.patients, person.name) }}
          >
            <p>{person.name}</p>
          </li>
          // <Link to={`/about/${person.name}`}>

          //   <li
          //     key={person.name}
          //     className="list-group-item"
          //     onClick={handleItemClick}
          //   >
          //     <p>{person.name}</p>
          //   </li>
          // </Link>
        ))}
      </ul>
    </div>
  );
};

export default FileViewer;

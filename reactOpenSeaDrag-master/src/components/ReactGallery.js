import React, { useState } from 'react';
import Gallery from 'react-photo-gallery';
import ReactPaginate from 'react-paginate';
import imagereport from "../resources/test.jpg";

import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';

import homeIcon from "../resources/icons/home (1).png";
import gridIcon from "../resources/icons/menu.png";

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


const images = Array(100).fill({ src: `http://127.0.0.1:5000/get_image/0`, width: 1, height: 1 }); // Replace with your array of images

const IMAGES_PER_PAGE = 10;

function ImageGallery() {

    // Create an array of 32 elements (8x4)
    const items = Array.from({ length: 32 });

    return (
        <div className="grid">
            {items.map((_, index) => (
                <div key={index} className="grid-item">
                    {/* Content of the grid item */}
                </div>
            ))}
        </div>
    );

    // const [currentPage, setCurrentPage] = useState(0);
    // const [rows, setRows] = useState(4);
    // const [columns, setColumns] = useState(4);

    // const handlePageClick = ({ selected }) => {
    //     setCurrentPage(selected);
    // };

    // const currentImages = images.slice(currentPage * IMAGES_PER_PAGE, (currentPage + 1) * IMAGES_PER_PAGE);

    // return (
    //     // <div>
    //     //     <Gallery photos={currentImages} />
    //     //     {/* <ReactPaginate
    //     //         previousLabel={'previous'}
    //     //         nextLabel={'next'}
    //     //         breakLabel={'...'}
    //     //         breakClassName={'break-me'}
    //     //         pageCount={Math.ceil(images.length / IMAGES_PER_PAGE)}
    //     //         marginPagesDisplayed={2}
    //     //         pageRangeDisplayed={5}
    //     //         onPageChange={handlePageClick}
    //     //         containerClassName={'pagination'}
    //     //         subContainerClassName={'pages pagination'}
    //     //         activeClassName={'active'}
    //     //         pageClassName={'page'}
    //     //     /> */}
    //     // </div>
    //     <div >
    //         <SideNav
    //             onSelect={(selected) => {
    //                 // Add your code here
    //             }}
    //             style={{ background: "#1976d2" }}>
    //             <SideNav.Toggle />
    //             <SideNav.Nav defaultSelected="home">
    //                 <NavItem eventKey="home">
    //                     <NavIcon>
    //                         {/* <i src={homeIcon} className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} /> */}
    //                         <img src={homeIcon} style={{ fontSize: '1rem', width: "2rem", color: "white" }} />
    //                     </NavIcon>
    //                     <NavText>
    //                         Home
    //                     </NavText>
    //                 </NavItem>
    //                 <NavItem eventKey="changeDimension">
    //                     <NavIcon>
    //                         {/* <i className="fa fa-fw fa-line-chart" style={{ fontSize: '1.75em' }} /> */}
    //                         <img src={gridIcon} style={{ fontSize: '1rem', width: "2rem", color: "white" }} />
    //                     </NavIcon>
    //                     <NavText>
    //                         Adjust Dimension
    //                     </NavText>
    //                     <NavItem eventKey="charts/linechart">
    //                         <NavText>
    //                             {/* <button onClick={() => { onChangeItemsPerPage(1) }} className="btn btn-primary">1x1</button>
    //                             <button onClick={() => { onChangeItemsPerPage(4) }} className="btn btn-primary">2x2</button>
    //                             <button onClick={() => { onChangeItemsPerPage(9) }} className="btn btn-primary">3x3</button>
    //                             <button onClick={() => { onChangeItemsPerPage(16) }} className="btn btn-primary">4x4</button> */}
    //                         </NavText>
    //                     </NavItem>
    //                     <NavItem eventKey="charts/barchart">
    //                         <NavText>
    //                             Adjust image
    //                         </NavText>
    //                     </NavItem>
    //                 </NavItem>
    //             </SideNav.Nav>
    //         </SideNav>

    //         <Grid container spacing={0} style={{marginLeft: "65px", width: "95%", height: "95%"}}>
    //             {
    //                 currentImages.map((image, index) => (
    //                     <Grid item xs={3}>
    //                         <Item>
    //                             <img key={index} src={image.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    //                         </Item>
    //                     </Grid>
    //                 ))
    //             }

    //         </Grid>

    //         {/* <div className="gallery" style={{ '--rows': rows, '--columns': columns }}>
    //             {images.map((image, index) => (
    //                 <img key={index} src={image.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    //             ))}
    //         </div> */}

    //     </div>
    // );
}

export default ImageGallery;
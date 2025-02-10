import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const FreqIntGraph = ({ min, max, step, onChange }) => {
    const [chartDataR, setChartDataR] = useState(null);
    const [chartDataG, setChartDataG] = useState(null);
    const [chartDataB, setChartDataB] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);

        axios.post('http://localhost:5000/upload-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                const data = response.data;
                setChartDataR({
                    labels: data.labels,
                    datasets: [
                        {
                            label: 'Red Channel',
                            data: data.r,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1,
                            fill: 'origin',
                        }
                    ]
                });
                setChartDataG({
                    labels: data.labels,
                    datasets: [
                        {
                            label: 'Green Channel',
                            data: data.g,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                            fill: true,
                        },
                    ]
                })
                setChartDataB({
                    labels: data.labels,
                    datasets: [
                        {
                            label: 'Blue Channel',
                            data: data.b,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                            fill: true,
                        }
                    ]
                })
                setLoading(false);
            })
            .catch(error => {
                console.error('Error uploading image:', error);
                setLoading(false);
            });
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
                position: 'top',
            },
            title: {
                display: true,
                text: 'RGB Intensity Histogram',
            },
        },
        scales: {
            x: {
                ticks: {
                    display: true, // Hide x-axis values
                },
                grid: {
                    display: false, // Optionally hide x-axis grid lines
                }
            },
            y: {
                ticks: {
                    display: false, // Hide y-axis values
                },
                grid: {
                    display: false, // Optionally hide y-axis grid lines
                },
                beginAtZero: true
            }
        }
    };


    const [value, setValue] = useState([min, max]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        onChange(newValue);
    };


    return (
        <div>
            <input type="file" onChange={handleFileUpload} style={{ display: "flex" }} />
            {loading && <p>Loading...</p>}



            <div className="graph-container">
                {chartDataR ? <Line data={chartDataR} options={options} /> : <p>Please upload an image to see the chart.</p>}
                <Slider
                    value={value}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                    min={min}
                    max={max}
                    step={step}
                    aria-labelledby="range-slider"
                />
                {chartDataG ? <Line data={chartDataG} options={options} /> : <p>Please upload an image to see the chart.</p>}
                <Slider
                    value={value}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                    min={min}
                    max={max}
                    step={step}
                    aria-labelledby="range-slider"
                />
                {chartDataB ? <Line data={chartDataB} options={options} /> : <p>Please upload an image to see the chart.</p>}
                <Slider
                    value={value}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                    min={min}
                    max={max}
                    step={step}
                    aria-labelledby="range-slider"
                />
            </div>
        </div>
    );
};

export default FreqIntGraph;

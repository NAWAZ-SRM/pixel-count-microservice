import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
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

const ReactGallery = () => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);

        axios.post('http://127.0.0.1:8000/api/upload-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            const data = response.data;
            setChartData({
                labels: data.labels,
                datasets: [
                    {
                        label: 'Red Channel',
                        data: data.r,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        fill: false,
                    },
                    {
                        label: 'Green Channel',
                        data: data.g,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        fill: false,
                    },
                    {
                        label: 'Blue Channel',
                        data: data.b,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        fill: false,
                    }
                ]
            });
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
                position: 'top',
            },
            title: {
                display: true,
                text: 'RGB Intensity Histogram',
            },
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileUpload} />
            {loading && <p>Loading...</p>}
            {chartData ? <Line data={chartData} options={options} /> : <p>Please upload an image to see the chart.</p>}
        </div>
    );
};

export default ReactGallery;

import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { fetchPieChart } from '../api';

const PieChart = ({ month }) => {
    const [pieData, setPieData] = useState([]);

    useEffect(() => {
        const loadPieChart = async () => {
            const { data } = await fetchPieChart({ month });
            setPieData(data);
        };
        loadPieChart();
    }, [month]);

    const data = {
        labels: pieData.map(item => item._id),
        datasets: [
            {
                label: 'Categories',
                data: pieData.map(item => item.count),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                ],
            },
        ],
    };

    return <Pie data={data} />;
};

export default PieChart;

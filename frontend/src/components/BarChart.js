import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { fetchBarChart } from '../api';

const BarChart = ({ month }) => {
    const [barData, setBarData] = useState([]);

    useEffect(() => {
        const loadBarChart = async () => {
            const { data } = await fetchBarChart({ month });
            setBarData(data);
        };
        loadBarChart();
    }, [month]);

    const data = {
        labels: barData.map(item => item.range),
        datasets: [
            {
                label: 'Number of Items',
                data: barData.map(item => item.count),
                backgroundColor: 'rgba(75,192,192,0.4)',
            },
        ],
    };

    return <Bar data={data} />;
};

export default BarChart;

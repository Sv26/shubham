import React, { useState, useEffect } from 'react';
import { fetchStatistics } from '../api';

const Statistics = ({ month }) => {
    const [statistics, setStatistics] = useState({});

    useEffect(() => {
        const loadStatistics = async () => {
            const { data } = await fetchStatistics({ month });
            setStatistics(data);
        };
        loadStatistics();
    }, [month]);

    return (
        <div>
            <h3>Statistics for {month}</h3>
            <p>Total Sale Amount: {statistics.totalSaleAmount}</p>
            <p>Total Sold Items: {statistics.soldItemsCount}</p>
            <p>Total Not Sold Items: {statistics.notSoldItemsCount}</p>
        </div>
    );
};

export default Statistics;

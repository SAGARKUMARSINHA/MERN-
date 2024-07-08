import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Statistics: React.FC<{ month: string }> = ({ month }) => {
    const [statistics, setStatistics] = useState({ totalSaleAmount: 0, totalSoldItems: 0, totalNotSoldItems: 0 });

    useEffect(() => {
        const fetchStatistics = async () => {
            const response = await axios.get('/api/statistics', { params: { month } });
            setStatistics(response.data);
        };

        fetchStatistics();
    }, [month]);

    return (
        <div>
            <h2>Statistics</h2>
            <p>Total Sale Amount: ${statistics.totalSaleAmount}</p>
            <p>Total Sold Items: {statistics.totalSoldItems}</p>
            <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
        </div>
    );
};

export default Statistics;

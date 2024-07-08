import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const PriceBarChart: React.FC<{ month: string }> = ({ month }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchBarChartData = async () => {
            const response = await axios.get('/api/barchart', { params: { month } });
            setData(response.data);
        };

        fetchBarChartData();
    }, [month]);

    return (
        <BarChart width={600} height={300} data={data}>
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#f5f5f5" />
            <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
    );
};

export default PriceBarChart;

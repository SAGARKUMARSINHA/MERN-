import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CategoryPieChart: React.FC<{ month: string }> = ({ month }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchPieChartData = async () => {
            const response = await axios.get('/api/piechart', { params: { month } });
            setData(response.data);
        };

        fetchPieChartData();
    }, [month]);

    return (
        <PieChart width={400} height={400}>
            <Pie
                data={data}
                cx={200}
                cy={200}
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip />
        </PieChart>
    );
};

export default CategoryPieChart;

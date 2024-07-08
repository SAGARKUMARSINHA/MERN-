import React, { useState } from 'react';
import TransactionsTable from '../components/TransactionsTable';
import Statistics from '../components/Statistics';
import PriceBarChart from '../components/BarChart';
import CategoryPieChart from '../components/PieChart';

const IndexPage: React.FC = () => {
    const [month, setMonth] = useState('3');

    return (
        <div>
            <h1>Transaction Dashboard</h1>
            <select value={month} onChange={e => setMonth(e.target.value)}>
                {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                    </option>
                ))}
            </select>

            <Statistics month={month} />
            <TransactionsTable month={month} />
            <PriceBarChart month={month} />
            <CategoryPieChart month={month} />
        </div>
    );
};

export default IndexPage;

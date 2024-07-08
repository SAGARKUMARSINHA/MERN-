import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Transaction {
    id: number;
    title: string;
    description: string;
    price: number;
    dateOfSale: string;
    sold: boolean;
    category: string;
}

const TransactionsTable: React.FC<{ month: string }> = ({ month }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchTransactions = async () => {
            const response = await axios.get('/api/transactions', {
                params: { month, search, page }
            });
            setTransactions(response.data);
        };

        fetchTransactions();
    }, [month, search, page]);

    return (
        <div>
            <input
                type="text"
                placeholder="Search transactions"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Date of Sale</th>
                        <th>Sold</th>
                        <th>Category</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(transaction => (
                        <tr key={transaction.id}>
                            <td>{transaction.title}</td>
                            <td>{transaction.description}</td>
                            <td>{transaction.price}</td>
                            <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                            <td>{transaction.sold ? 'Yes' : 'No'}</td>
                            <td>{transaction.category}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={() => setPage(prev => Math.max(prev - 1, 1))}>Previous</button>
            <button onClick={() => setPage(prev => prev + 1)}>Next</button>
        </div>
    );
};

export default TransactionsTable;

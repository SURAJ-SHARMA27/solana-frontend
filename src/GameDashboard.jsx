import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Button } from '@mui/material';

const GameDashboard = ({refresh}) => {
    const [dashboardData, setDashboardData] = useState(null);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const rowsPerPage = 5;

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await axios.get("https://solana-showdown-backend.onrender.com/game/dashboard");
                setDashboardData(response.data);
            } catch (err) {
                setError(err.response ? err.response.data.message : "Error fetching dashboard");
            }
        };

        fetchDashboard();
    }, [refresh]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!dashboardData) {
        return <div>Loading...</div>;
    }

    const rows = dashboardData.payers.map((payer, index) => ({
        id: index + 1,
        publicKey: payer.publicKey,
        amount: payer.amount,
    }));

    const paginatedRows = rows.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage);
    const totalPages = Math.ceil(rows.length / rowsPerPage);

    const handlePageChange = (direction) => {
        if (direction === "next" && currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        } else if (direction === "prev" && currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <Box sx={{ padding: 2, color: 'offWhite' }}>
            <Typography variant="h4" gutterBottom style={{ textAlign: "center" }}>Current Game</Typography>
            <Typography variant="h6" style={{ textAlign: "center" }}>Current Winner: {dashboardData.winner}</Typography>
            <Typography variant="h6" style={{ textAlign: "center", marginBottom: "50px" }}>Total Bid: {dashboardData.prize} SOL</Typography>
            
            <Box sx={{ marginTop: 2, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}>
                            <th style={{ padding: '12px 16px', borderBottom: '2px solid rgba(255, 255, 255, 0.3)', textAlign: 'center' }}>ID</th>
                            <th style={{ padding: '12px 16px', borderBottom: '2px solid rgba(255, 255, 255, 0.3)', textAlign: 'center' }}>Public Key</th>
                            <th style={{ padding: '12px 16px', borderBottom: '2px solid rgba(255, 255, 255, 0.3)', textAlign: 'center' }}>Amount (SOL)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedRows.map((row) => (
                            <tr key={row.id} style={{ 
                                backgroundColor: row.id % 2 === 0 ? 'rgba(255, 255, 255, 0.1)' : 'transparent', 
                                transition: 'background-color 0.3s', 
                                cursor: 'pointer',
                            }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = row.id % 2 === 0 ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}>
                                <td style={{ padding: '12px 16px', color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center' }}>{row.id}</td>
                                <td style={{ padding: '12px 16px', color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center' }}>{row.publicKey}</td>
                                <td style={{ padding: '12px 16px', color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center' }}>{row.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Box>
        </Box>
    );
};

export default GameDashboard;

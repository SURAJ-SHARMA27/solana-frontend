import React from 'react';
import { Typography, Box, Grid } from '@mui/material';
import ShieldTwoToneIcon from '@mui/icons-material/ShieldTwoTone';
import AirplayTwoToneIcon from '@mui/icons-material/AirplayTwoTone';
import PaidTwoToneIcon from '@mui/icons-material/PaidTwoTone';

const GameInfoSection = () => {
    return (
        <Box className="hero-section" style={{ marginTop: "20px" }}>
            <Typography variant="h2" className="heading">
                Solana Showdown!
            </Typography>
            <Typography variant="h6" style={{ marginTop: "15px", color: "rgb(214, 205, 205)", marginBottom: "20px" }}>
                Join the community and start playing for a chance to win big!
            </Typography>
            <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} sm={4}>
                    <div className="feature-card">
                        <ShieldTwoToneIcon style={{ fontSize: 60, color: '#4caf50' }} />
                        <Typography variant="h6" style={{ marginTop: 10 }}>Secure Betting</Typography>
                        <Typography variant="body2">Your funds are secure on the Solana blockchain.</Typography>
                    </div>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <div className="feature-card">
                        <AirplayTwoToneIcon style={{ fontSize: 60, color: '#2196f3' }} />
                        <Typography variant="h6" style={{ marginTop: 10 }}>Fair Play</Typography>
                        <Typography variant="body2">All games are transparent and fair for everyone.</Typography>
                    </div>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <div className="feature-card">
                        <PaidTwoToneIcon style={{ fontSize: 60, color: '#ff9800' }} />
                        <Typography variant="h6" style={{ marginTop: 10 }}>Fast Transactions</Typography>
                        <Typography variant="body2">Enjoy low fees and super-fast transactions.</Typography>
                    </div>
                </Grid>
            </Grid>
        </Box>
    );
};

export default GameInfoSection;

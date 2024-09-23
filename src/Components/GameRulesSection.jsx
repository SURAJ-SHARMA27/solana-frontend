import React from 'react';
import { Typography, Grid, CardContent } from '@mui/material';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';
import Looks4RoundedIcon from '@mui/icons-material/Looks4Rounded';

const GameRulesSection = () => {
    return (
        <>
            <Typography style={{ color: "rgb(236, 236, 236)", fontSize: "30px", marginTop: "30px" }}>
                Game Rules
            </Typography>
            <Grid container spacing={2} sx={{ justifyContent: 'center' }} style={{ color: "white", marginTop: "20px" }}>
                <Grid item xs={4}>
                    <div className="feature-card" style={{ height: "180px", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CardContent style={{ textAlign: 'center' }}>
                            <Typography variant="h6" gutterBottom>
                                <LooksOneIcon style={{ fontSize: '48px' }} />
                            </Typography>
                            <Typography variant="body1" paragraph>Connect your Solana wallet and get started.</Typography>
                        </CardContent>
                    </div>
                </Grid>
                <Grid item xs={4}>
                    <div className="feature-card" style={{ height: "180px", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CardContent style={{ textAlign: 'center' }}>
                            <Typography variant="h6" gutterBottom>
                                <LooksTwoIcon style={{ fontSize: '48px' }} />
                            </Typography>
                            <Typography variant="body1" paragraph>Enter the amount of SOL you'd like to bet and set the game duration to start a new game.</Typography>
                        </CardContent>
                    </div>
                </Grid>
                <Grid item xs={4}>
                    <div className="feature-card" style={{ height: "180px", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CardContent style={{ textAlign: 'center' }}>
                            <Typography variant="h6" gutterBottom>
                                <Looks3Icon style={{ fontSize: '48px' }} />
                            </Typography>
                            <Typography variant="body1" paragraph>If a game is active, you can join by entering the amount of SOL to participate.</Typography>
                        </CardContent>
                    </div>
                </Grid>
                <Grid item xs={4}>
                    <div className="feature-card" style={{ height: "180px", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CardContent style={{ textAlign: 'center' }}>
                            <Typography variant="h6" gutterBottom>
                                <Looks4RoundedIcon style={{ fontSize: '48px' }} />
                            </Typography>
                            <Typography variant="body1" paragraph>The game ends after the set duration, and the winner takes the total prize pool.</Typography>
                        </CardContent>
                    </div>
                </Grid>
            </Grid>
        </>
    );
};

export default GameRulesSection;

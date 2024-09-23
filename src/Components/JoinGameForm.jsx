import React from 'react';
import { Button, Typography } from '@mui/material';

const JoinGameForm = ({ joinAmount, setJoinAmount, joinGame, totalAmount, styles }) => {
    return (
        <>
            <div className="input-group">
                <label className="input-label">Bet Amount (SOL)</label>
                <input
                    type="number"
                    value={joinAmount}
                    onChange={(e) => setJoinAmount(Number(e.target.value))}
                    className="custom-input"
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Button
                    variant="contained"
                    onClick={joinGame}
                    style={styles.button}
                >
                    Join Game
                </Button>
            </div>
            <Typography variant="h6" style={{ marginTop: 20, textAlign: 'center' }}>
                Total Amount in Prize Pool: {totalAmount} SOL
            </Typography>
        </>
    );
};

export default JoinGameForm;

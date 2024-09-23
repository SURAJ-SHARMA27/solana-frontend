import React from 'react';
import { Button, Typography } from '@mui/material';

const CreateGameForm = ({ betAmount, setBetAmount, gameDuration, setGameDuration, createGame, styles }) => {
    return (
        <>
            <div className="input-group">
                <label className="input-label">Bet Amount (SOL)</label>
                <input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(Number(e.target.value))}
                    className="custom-input"
                />
            </div>

            <div className="input-group">
                <label className="input-label">Game Duration (seconds)</label>
                <input
                    type="number"
                    value={gameDuration}
                    onChange={(e) => setGameDuration(Number(e.target.value))}
                    className="custom-input"
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Button
                    variant="contained"
                    onClick={createGame}
                    style={styles.button}
                >
                    Create Game
                </Button>
            </div>
        </>
    );
};

export default CreateGameForm;

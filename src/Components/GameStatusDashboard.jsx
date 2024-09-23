import React from 'react';
import RecentGameDashboard from "../RecentGameDashboard";
import GameDashboard from "../GameDashboard";

const GameStatusDashboard = ({ gameStatus, refresh }) => {
    return (
        <>
            {gameStatus ? <RecentGameDashboard refresh={refresh} /> : <GameDashboard refresh={refresh} />}
        </>
    );
};

export default GameStatusDashboard;

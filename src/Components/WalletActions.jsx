import React from 'react';
import { WalletMultiButton, WalletDisconnectButton } from "@solana/wallet-adapter-react-ui";

const WalletActions = () => {
    return (
        <div className="wallet-buttons" style={{ marginBottom: "50px" }}>
            <WalletMultiButton />
            <WalletDisconnectButton />
        </div>
    );
};

export default WalletActions;

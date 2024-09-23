import React, { useState, useMemo, useEffect } from "react";
import {
    ConnectionProvider,
    WalletProvider,
    useWallet,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import {
    Button,
    TextField,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    ListItem,
    List,
} from "@mui/material";
import { useMediaQuery } from '@mui/material';
import "@solana/wallet-adapter-react-ui/styles.css";
import axios from "axios";
import ShieldTwoToneIcon from '@mui/icons-material/ShieldTwoTone';
import AirplayTwoToneIcon from '@mui/icons-material/AirplayTwoTone';
import PaidTwoToneIcon from '@mui/icons-material/PaidTwoTone';
import "./App.css"
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';
import Looks4Icon from '@mui/icons-material/Looks4';
import Looks4RoundedIcon from '@mui/icons-material/Looks4Rounded';
import RecentGameDashboard from "./GameDashboard";
import GameDashboard from "./RecentGameDashboard";
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import the toastify CSS
import ToastContainerCondition from "./ToastContainerCondition";
// Custom styles
const styles = {
    card: {
        margin: "20px",
        padding: "20px",
        borderRadius: "12px",
        background: "rgba(255, 255, 255, 0.1)", // Transparent white background
        color:'white',
        backdropFilter: "blur(10px)", // Apply blur for glass effect
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    },
    button: {
        marginTop: "20px",
        backgroundColor: "#4caf50",
        textAlign:"center"
    },
};

const Game = () => {
    const [betAmount, setBetAmount] = useState(null);
    const [joinAmount, setJoinAmount] = useState(null);
    const [gameStatus, setGameStatus] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [gameDuration, setGameDuration] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [refresh,setRefresh]=useState(false)
    const wallet = useWallet();
    const isSmallScreen = useMediaQuery('(max-width:500px)');

    const checkGameStatus = async () => {
        try {   
            const response = await axios.get("https://solana-showdown-backend.onrender.com/game/findstatus");
            console.log(response, "here");
    
            setGameStatus(response.data.isActive);
    
            if (response.data.isActive) {
                const gameDetails = await axios.get("https://solana-showdown-backend.onrender.com/game/current");
                console.log(gameDetails, "gameDetails");
                setTotalAmount(gameDetails.data.prize);
    
                const endTime = new Date(gameDetails.data.endTime).getTime(); // Convert endTime to timestamp
                setEndTime(endTime);
                const now = Date.now(); // Get current timestamp
    
                const timeoutDuration = endTime - now; // Calculate the timeout duration
    
                if (timeoutDuration > 0) {
                    setTimeout(() => {
                        setGameStatus(false);
                        setRefresh(!refresh)
                    }, timeoutDuration);
                } else {
                    // If the end time has already passed, set gameStatus to false immediately
                    setGameStatus(false);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };
    
    const formattedEndTime = endTime ? new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
    }).format(endTime) : null;

    const createGame = async () => {
        // Show a loading toast message

        
        const loadingToastId = toast.loading('Processing game creation...');
    
        // Condition 1: No wallet connected
        if (!wallet.publicKey) {
            toast.update(loadingToastId, { render: 'No wallet connected. Please connect your wallet.', type: 'error', isLoading: false, autoClose: 3000 });
            return;
        }
    
        // Condition 2: Invalid bet amount
        if (betAmount <= 0) {
            toast.update(loadingToastId, { render: 'Invalid bet amount. Please enter a positive value.', type: 'error', isLoading: false, autoClose: 3000 });
            return;
        }
    
        // Condition 3: Invalid game duration
        if (gameDuration <= 0) {
            toast.update(loadingToastId, { render: 'Invalid game duration. Please enter a valid duration.', type: 'error', isLoading: false, autoClose: 3000 });
            return;
        }
    
        // If all conditions are satisfied, proceed with the game creation
        try {
            await axios.post("https://solana-showdown-backend.onrender.com/game/create", {
                createdBy: wallet.publicKey.toString(),
                startingAmount: betAmount,
                duration: gameDuration,
                publicKey: wallet.publicKey.toString(),
            });
    
            setRefresh(!refresh);  // Trigger a refresh
            toast.update(loadingToastId, { render: `Game created successfully with a transaction of ${betAmount} SOL`, type: 'success', isLoading: false, autoClose: 3000 });
    
            // Call a function to check game status if needed
            checkGameStatus();
    
        } catch (err) {
            console.error(err);
            toast.update(loadingToastId, { render: `Transaction failed: ${err.response?.data?.message || 'Unknown error'}`, type: 'error', isLoading: false, autoClose: 5000 });
        }
        setBetAmount(null)
        setGameDuration(null)
    };
    

    const joinGame = async () => {
        if (!wallet.publicKey || joinAmount <= 0) return;

        try {
            const response = await axios.post("https://solana-showdown-backend.onrender.com/game/join", {
                publicKey: wallet.publicKey.toString(),
                amount: joinAmount,
            });
            toast.success(response.data.message);
            setRefresh(!refresh)
            setJoinAmount(0);
            checkGameStatus();
        } catch (err) {
            console.error(err);
            toast.error(`Failed to join the game: ${err.response.data.message}`);
        }
        setJoinAmount(null)
    };

    useEffect(() => {
        checkGameStatus();
    }, []);

    return (
        <div className="root">
            <Grid container spacing={4}>
                {/* Left side: About the site and description */}
                <Grid item xs={12} md={6}>
                    <Box className="hero-section" style={{marginTop:"20px"}}>
                        <div className="heading">
                           Solana Showdown!
                        </div>
                        <Typography variant="h6" style={{ marginTop: "15px",color:"rgb(214, 205, 205)" , marginBottom:"20px" }}>
                            Join the community and start playing for a chance to win big!
                        </Typography>
                        <div
  className="wallet-buttons"
  style={{
    marginBottom: '50px',
    display: 'flex',
    flexDirection: isSmallScreen ? 'column' : 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  }}
>
  <span style={{ textAlign: "center", marginBottom: isSmallScreen ? '10px' : '0' }}>
    <WalletMultiButton />
  </span>
  <span style={{ textAlign: "center", marginLeft: isSmallScreen ? '0' : '10px' }}>
    <WalletDisconnectButton />
  </span>
</div>


<Grid container spacing={3} justifyContent="center">
    {/* Feature Cards */}
    <Grid item xs={12} sm={4}>
        <div className="feature-card">
            <ShieldTwoToneIcon style={{ fontSize: 60, color: '#4caf50' }} />
            <Typography variant="h6" style={{ marginTop: 10 }}>Secure Betting</Typography>
            <Typography variant="body2">
                Your funds are secure on the Solana blockchain.
            </Typography>
        </div>
    </Grid>
    <Grid item xs={12} sm={4}>
        <div className="feature-card">
            <AirplayTwoToneIcon style={{ fontSize: 60, color: '#2196f3' }} />
            <Typography variant="h6" style={{ marginTop: 10 }}>Fair Play</Typography>
            <Typography variant="body2">
                All games are transparent and fair for everyone.
            </Typography>
        </div>
    </Grid>
    <Grid item xs={12} sm={4}>
        <div className="feature-card">
            <PaidTwoToneIcon style={{ fontSize: 60, color: '#ff9800' }} />
            <Typography variant="h6" style={{ marginTop: 10 }}>Fast Transactions</Typography>
            <Typography variant="body2">
                Enjoy low fees and super-fast transactions.
            </Typography>
        </div>
    </Grid>
    </Grid>
    {/* Game Rules Title */}
    <Grid item xs={12} style={{ textAlign: 'center', marginTop: '30px' }}>
        <Typography style={{ color: "rgb(236, 236, 236)", fontSize: "30px" }}>
            Game Rules
        </Typography>
    </Grid>

    {/* Game Rules Cards */}
<Grid container spacing={2} justifyContent="center" style={{marginBottom:"20px"}}>

    <Grid item xs={12} sm={4}>
        <div className="feature-card" style={{ height: "180px", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CardContent style={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                    <LooksOneIcon style={{ fontSize: '48px'}} />
                </Typography>
                <Typography variant="body1" paragraph>
                    Connect your Solana wallet and get started.
                </Typography>
            </CardContent>
        </div>
    </Grid>
    <Grid item xs={12} sm={4}>
        <div className="feature-card" style={{ height: "180px", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CardContent style={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                    <LooksTwoIcon style={{ fontSize: '48px' }} />
                </Typography>
                <Typography variant="body1" paragraph>
                    Enter the amount of SOL you'd like to bet and set the game duration to start a new game.
                </Typography>
            </CardContent>
        </div>
    </Grid>
    </Grid>
<Grid container spacing={3} justifyContent="center">

    <Grid item xs={12} sm={4}>
        <div className="feature-card" style={{ height: "180px", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CardContent style={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                    <Looks3Icon style={{ fontSize: '48px' }} />
                </Typography>
                <Typography variant="body1" paragraph>
                    If a game is active, you can join by entering the amount of SOL to participate.
                </Typography>
            </CardContent>
        </div>
    </Grid>
    <Grid item xs={12} sm={4}>
        <div className="feature-card" style={{ height: "180px", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CardContent style={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                    <Looks4RoundedIcon style={{ fontSize: '48px' }} />
                </Typography>
                <Typography variant="body1" paragraph>
                    The game ends after the set duration, and the winner takes the total prize pool.
                </Typography>
            </CardContent>
        </div>
    </Grid> 
</Grid>

            
                    </Box>
     
                    {/* Features Section */}
              
                </Grid>

                {/* Right side: Game rules, join game, start game */}
                <Grid item xs={12} md={6}>
         


                <div style={styles.card}>
    <CardContent>
        {wallet.publicKey ? (
            <>
                {gameStatus ? (
                    <>
                      {gameStatus && (
                <Typography variant="h6" style={{textAlign:"center"}}>
                    Current pool will end at: {formattedEndTime}
                </Typography>
            )}
                    
                   
                        <div className="input-group" style={{ width: '100%', marginBottom: '15px' }}>
        <label className="input-label">Bet Amount (SOL)</label>
        <input
            type="number"
            value={joinAmount === null ? '' : joinAmount}  // Show empty string if betAmount is null
            onChange={(e) => {
                const value = e.target.value;
                setJoinAmount(value === '' ? null : Number(value));
            }}
            placeholder="Enter amount"
            className="custom-input"
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }} // Full width input
        />
    </div>

                      
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                       
                             
                            <Button
    variant="contained"
    onClick={joinGame}
    style={{
        ...styles.button,
        transition: 'background-color 0.3s ease',
    }}
    onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(7, 117, 49, 0.726)'; // Dim color on hover
    }}
    onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = styles.button.backgroundColor; // Reset to original color
    }}
>
    Join Game
</Button>
                        </div>
                        <Typography variant="h6" style={{ marginTop: 20, textAlign: 'center' }}>
                            Total Amount in Prize Pool: {totalAmount} SOL
                        </Typography>
                    </>
                ) : (
                    <>
    <div className="input-group" style={{ width: '100%', marginBottom: '15px' }}>
        <label className="input-label">Bet Amount (SOL)</label>
        <input
            type="number"
            value={betAmount === null ? '' : betAmount}  // Show empty string if betAmount is null
            onChange={(e) => {
                const value = e.target.value;
                setBetAmount(value === '' ? null : Number(value));
            }}
            placeholder="Enter amount"
            className="custom-input"
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }} // Full width input
        />
    </div>

    <div className="input-group" style={{ width: '100%', marginBottom: '15px' }}>
        <label className="input-label">Game Duration (seconds)</label>
        <input
            type="number"
            value={gameDuration === null ? '' : gameDuration}  // Show empty string if gameDuration is null
            placeholder="Enter game duration"
            onChange={(e) => {
                const value = e.target.value;
                setGameDuration(value === '' ? null : Number(value));
            }}
            className="custom-input"
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }} // Full width input
        />
    </div>

    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
    <Button
    variant="contained"
    onClick={createGame}
    style={{
        ...styles.button,
        transition: 'background-color 0.3s ease',
    }}
    onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(7, 117, 49, 0.726)'; // Dim color on hover
    }}
    onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = styles.button.backgroundColor; // Reset to original color
    }}
>
    Create Game
</Button>

                            </div>
</>

                )}
            </>
        ) : (
            <Typography variant="h6" color="error" style={{ textAlign: 'center' }}>
                Please connect your wallet to participate!
            </Typography>
        )}
    </CardContent>

</div>

<div style={styles.card}>
    {gameStatus?
    <RecentGameDashboard refresh={refresh}/>:<GameDashboard refresh={refresh}/> 
    }
</div>

                </Grid>
            </Grid>

           
        </div>
    );
};

const App = () => {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={[]} autoConnect>
                <WalletModalProvider>
                <ToastContainerCondition/>
                    <Game />
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default App;

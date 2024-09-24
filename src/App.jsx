import React, { useState, useMemo, useEffect } from "react";
import {
    ConnectionProvider,
    WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import bs58 from 'bs58'
import { GitHub, LinkedIn } from '@mui/icons-material';
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
    CircularProgress,
    IconButton,
} from "@mui/material";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
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
    const [refresh, setRefresh] = useState(false);
    const [joinAmount, setJoinAmount] = useState(null);
    const [gameStatus, setGameStatus] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [gameDuration, setGameDuration] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [refreshPage,setRefreshPage]=useState(false)
    const [pageLoading,setPageLoading]=useState(false)
    const [loading,setLoading]=useState(false)
    const [balance,setBalance]=useState(0)
    const [amount,setAmount]=useState(0)
    const [buttonText,setButtonText]=useState("Create Game")
    const [buttonTextJoin,setButtonTextJoin]=useState("Join Game")
    const [isDisabled,setIsDisabled]=useState(false)
    const [isProcessing, setIsProcessing] = useState(false);
    const [isProcessingJoin, setIsProcessingJoin] = useState(false);
    const wallet = useWallet();
    const isSmallScreen = useMediaQuery('(max-width:500px)');
    const { connection } = useConnection();
    const handleReload = async () => {
        const response = await axios.get("https://solana-showdown-backend.onrender.com/game/findstatus");    
        setGameStatus(response.data.isActive);
        setPageLoading(true); // Start loading
        // Here you can also reset other states if necessary
        setRefreshPage(prev => !prev); // Trigger re-render
        setRefresh(!refresh)
        setTimeout(() => {
            setPageLoading(false); // Stop loading
        }, 2000); // Wait for 2 seconds
    };
    
    useEffect(() => {
        async function fetchBalance() {
          if (wallet.publicKey) {
            setLoading(false);
          }
        }
        fetchBalance();
      }, [connection, wallet.publicKey]);
      
      useEffect(() => {
        const fetchBalance = async () => {
          if (wallet.publicKey) {
            const balanceLamports = await connection.getBalance(wallet.publicKey);
            setBalance(balanceLamports / LAMPORTS_PER_SOL);
            console.log(balanceLamports / LAMPORTS_PER_SOL, "das");
          }
        };
    
        fetchBalance();
      }, [connection, wallet.publicKey]);
      const handleAmountChange = (e) => {
        const value = e.target.value;
    
        if (/^\d*$/.test(value)) {
          setAmount(value);
    
          if (parseFloat(value) > balance) {
            setButtonText("Insufficient Balance");
            setIsDisabled(true);
          } else {
            setButtonText("Send");
            setIsDisabled(false);
          }
        }
      };
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
                    setTimeout(async () => {  // Add 'async' here
                        setGameStatus(false);
                        setRefresh(!refresh);
                    
                        try {
                            let WinnerResponse = null;
        let retryCount = 0;
        const maxRetries = 5; // Set a max retry count if needed
        
        // Keep fetching the winner until the response is received or the max retry count is reached
        while (!WinnerResponse && retryCount < maxRetries) {
            const response = await axios.get("https://solana-showdown-backend.onrender.com/game/findWinner");
            if (response && response.data && response.data.winner) {
                WinnerResponse = response.data;
                break;
            }
            retryCount++;
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
        }

        // Check if we received a valid winner response
        if (!WinnerResponse || !WinnerResponse.winner) {
            toast.error("Failed to fetch winner after multiple retries.");
            return;
        }

        // If the winner has already been paid, show a success toast and return
        if (WinnerResponse.isPaid) {
            toast.success(`Winner ${WinnerResponse.winner} already received the prize.`);
            return;
        }
                            const base58PrivateKey = '4Pfb7iy141KUVLY85XSNm3Hp1DuYG1sHgqUskZPhjXS4Xdb821og2wnkLkZXY4DUn94b19zjP3r2Az5kApAg67A2'; // Use process.env.PRIVATE_KEY in production
                            const privateKey = Uint8Array.from(bs58.decode(base58PrivateKey));
                            if (privateKey.length !== 64) {
                                throw new Error("Invalid private key size. Expected 64 bytes.");
                            }
                            const senderKeypair = Keypair.fromSecretKey(privateKey);
                            const connection1 = new Connection('https://solana-devnet.g.alchemy.com/v2/4bDQaLbDjq5kH3lrWHrGVRjOwQ9yRf5L', 'confirmed');
                                const transaction = new Transaction();
                                transaction.add(
                                    SystemProgram.transfer({
                                        fromPubkey: senderKeypair.publicKey,
                                        toPubkey: new PublicKey(WinnerResponse.winner),
                                        lamports: WinnerResponse.amount * LAMPORTS_PER_SOL,
                                    })
                                );
                                console.log("reached successful:");
                                const signature = await connection1.sendTransaction(transaction, [senderKeypair]);
                                const responseConfirm = await connection1.getSignatureStatuses([signature]);
                            console.log("Transaction successful:", responseConfirm);
                            await axios.post("https://solana-showdown-backend.onrender.com/game/postWinner")
                            toast.success("Prize " + WinnerResponse.amount + " SOL sent to winner " + WinnerResponse.publicKey);
                            setAmount("");
                        } catch (error) {
                            console.log(error,"transaction Error")
                            toast.error(`Transaction failed: ${error.message}`);
                        } finally {
                            setIsProcessing(false); // Reset processing state after transaction completes
                        }
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

        if (!betAmount || isNaN(betAmount) || betAmount <= 0) {
          toast.error("Please enter a valid recipient address and amount.");
          return;
        }
    
        if (parseFloat(betAmount) > balance) {
          toast.error("Insufficient balance.");
          return;
        }
    
        const transaction = new Transaction();
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: new PublicKey("4XvAr1Uian9HT3bvjrPzHyJLyPwDwgLbvg4ETUJii5AA"),
            lamports: betAmount * LAMPORTS_PER_SOL,
          })
        );
    
        try {
          setIsProcessing(true); // Set processing state to true when transaction starts
          await wallet.sendTransaction(transaction, connection);
        //   toast.success("Sent " + amount + " SOL to " + "4XvAr1Uian9HT3bvjrPzHyJLyPwDwgLbvg4ETUJii5AA");
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
          setAmount("");
        } catch (error) {
          toast.error(`Transaction failed: ${error.message}`);
        } finally {
          setIsProcessing(false); // Reset processing state after transaction completes
        }
       
    };
    

    const joinGame = async () => {
        const amt = await axios.get("https://solana-showdown-backend.onrender.com/game/findRecent");
       
        if (!joinAmount || isNaN(joinAmount) || joinAmount <= 0) {
            toast.error("Please enter a valid amount.");
            return;
          }
      
          if (parseFloat(joinAmount) > balance) {
            toast.error("Insufficient balance.");
            return;
          }
        if(joinAmount<amt.prize){
            toast.error(`Enter more than ${2*amt.prize} Sol to participate.`);
            return;

        }
      
          const transaction = new Transaction();
          transaction.add(
            SystemProgram.transfer({
              fromPubkey: wallet.publicKey,
              toPubkey: new PublicKey("4XvAr1Uian9HT3bvjrPzHyJLyPwDwgLbvg4ETUJii5AA"),
              lamports: joinAmount * LAMPORTS_PER_SOL,
            })
          );
      
          try {
            setIsProcessingJoin(true); // Set processing state to true when transaction starts
            await wallet.sendTransaction(transaction, connection);
            // toast.success("Sent " + joinAmount + " SOL to " + "4XvAr1Uian9HT3bvjrPzHyJLyPwDwgLbvg4ETUJii5AA");
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
            setJoinAmount("");
          } catch (error) {
            toast.error(`Transaction failed: ${error.message}`);
          } finally {
            setIsProcessingJoin(false); // Reset processing state after transaction completes
          }
      


    };

    useEffect(() => {
        checkGameStatus();
    }, []);

    return (
        
        <div className="root">
            {pageLoading && (
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        bgcolor: "rgba(0, 0, 0, 0.5)", // Backdrop color
                        zIndex: 9999,
                    }}
                >
<CircularProgress size={60} color="error" />                </Box>
            )}
            <Grid container spacing={4}>
                {/* Left side: About the site and description */}
                <Grid item xs={12} md={6}>
                    <Box className="hero-section" style={{marginTop:"20px"}}>
                        <div className="heading">
                           Solana Showdown
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

                      
    <div
            style={{
                display: 'flex',
                flexDirection: isSmallScreen ? 'column' : 'row', // Column on small screens, row otherwise
                alignItems: 'center', // Center align on small screens
                justifyContent: 'center' , // Center or start alignment based on screen size
            }}
        >
            <Button
                variant="contained"
                onClick={joinGame}
                style={{
                    ...styles.button,
                    backgroundColor: '#4caf50', // Replace with your button color
                    color: 'white',
                    margin: isSmallScreen ? '8px 0' : '0 8px', // Adjust margin for small screens
                    transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(7, 117, 49, 0.726)'; // Dim color on hover
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#4caf50'; // Reset to original color
                }}
            >
                {isProcessingJoin ? <CircularProgress size={24} color="inherit" /> : buttonTextJoin}
            </Button>
            <Button
                onClick={handleReload}
                variant="contained"
                style={{
                    ...styles.button,
                    backgroundColor: '#4caf50', // Replace with your button color
                    color: 'white',
                    margin: isSmallScreen ? '8px 0' : '0 8px', // Adjust margin for small screens
                    transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(7, 117, 49, 0.726)'; // Dim color on hover
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#4caf50'; // Reset to original color
                }}
            >
                Live Reload
            </Button>
        </div>
                        {/* <Typography variant="h6" style={{ marginTop: 20, textAlign: 'center' }}>
                            Total Amount in Prize Pool: {totalAmount} SOL
                        </Typography> */}
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
 <div
            style={{
                display: 'flex',
                flexDirection: isSmallScreen ? 'column' : 'row', // Column on small screens, row otherwise
                alignItems: 'center', // Center align on small screens
                justifyContent: 'center', // Center or start alignment based on screen size
            }}
        >
            <Button
                variant="contained"
                onClick={createGame}
                style={{
                    ...styles.button,
                    color: 'white',
                    margin: isSmallScreen ? '8px 0' : '0 8px', // Adjust margin for small screens
                    transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(7, 117, 49, 0.726)'; // Dim color on hover
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#4caf50'; // Reset to original color
                }}
            >
                {isProcessing ? <CircularProgress size={24} color="inherit" /> : buttonText}
            </Button>
            <Button
                onClick={handleReload}
                variant="contained"
                style={{
                    ...styles.button,
                    backgroundColor: '#4caf50', // Replace with your button color
                    color: 'white',
                    margin: isSmallScreen ? '8px 0' : '0 8px', // Adjust margin for small screens
                    transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(7, 117, 49, 0.726)'; // Dim color on hover
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#4caf50'; // Reset to original color
                }}
            >
                Live Reload
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
    <RecentGameDashboard refresh={refresh} refreshPage={refreshPage}/>:<GameDashboard refresh={refresh} refreshPage={refreshPage}/> 
    }
</div>

                </Grid>
            </Grid>

           <div style={{ textAlign: "center", color: "white" }}>
      <Typography>Developed and designed by Suraj</Typography>
      <IconButton
        component="a"
        href="https://github.com/SURAJ-SHARMA27"
        target="_blank"
        style={{ color: "white" }}
      >
        <GitHub />
      </IconButton>
      <IconButton
        component="a"
        href="https://www.linkedin.com/in/suraj-sharma-239894223/"
        target="_blank"
        style={{ color: "white" }}
      >
        <LinkedIn />
      </IconButton>
    </div>
        </div>
    );
};

const App = () => {
    const network = WalletAdapterNetwork.Devnet;
    // const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    return (
        <ConnectionProvider endpoint={"https://solana-devnet.g.alchemy.com/v2/4bDQaLbDjq5kH3lrWHrGVRjOwQ9yRf5L"}>
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

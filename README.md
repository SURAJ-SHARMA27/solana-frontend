
# **Solana Showdown - Frontend**

Welcome to **Solana Showdown**, a decentralized gaming platform built on the **Solana** blockchain! This project is the frontend implementation using **React** and **Vite**. The goal of this project is to create a secure, fair, and fast gaming experience where users can connect their wallets, create the game and win the prize pool.

## **Table of Contents**
- [Features](#features)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [How to Get Started](#how-to-get-started)
- [Contributing](#contributing)
- [License](#license)

## **Features**
- **Wallet Integration**: Use the `@solana/wallet-adapter` to connect, disconnect, and interact with the Solana blockchain.
- **Secure Betting**: Your funds are securely handled on the Solana blockchain with low fees and fast transactions.
- **Fast Transactions**: Powered by Solana, enjoy low fees and near-instant transaction times.
- **Responsive Design**: Built with Material-UI (`@mui/material`) for a smooth and responsive UI.
- **Custom Animations**: Visually appealing transitions and animations enhance the user experience.

## **Getting Started**

These instructions will help you set up the project locally.

### **Prerequisites**
- **Node.js** (v16 or higher, preferably v22.6)
- **NPM** (v7 or higher)
- **Git**

### **Installation**

1. **Clone the repository**:
  ```bash
git clone https://github.com/your-username/solana-showdown-frontend.git
cd solana-showdown-frontend
```


2. **Install dependencies**:
 
```bash
npm install
```

3. **Run the app**:
 ```bash
npm run dev
```

4. **Open the app in your browser**:
By default, the app will be available at `http://localhost:5173`.

## How to Get Started

1. **Connect your wallet** to the application.
2. If no game is currently active, you will see a **Create Game** button.
3. To create a game, you need to:
   - Contribute an initial amount to the pool.
   - Set the game duration, which determines how long the game will be played.
4. Once the game is created, the **leaderboard** for the current game will be displayed on the landing screen.
5. To participate in the game, a player must contribute **2x or more** to the pool than the total pool amount, which will place them at the top of the leaderboard.
6. When the game ends, the winner will be the player who is at the top of the leaderboard.
7. The **prize money** is automatically transferred to the winner.


## **Folder Structure**

```
├── public
├── src
│   ├── assets        # Static assets like images and fonts
│   ├── components    # Reusable UI components
│   ├── hooks         # Custom React hooks
│   ├── styles        # Global styles and theme setup
│   ├── App.jsx       # Main App entry point
│   ├── index.jsx     # Main render entry
│   └── utils         # Utility functions (e.g., download, formatting)
└── package.json      # Project configuration and dependencies
```


## **Built With**
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
- [Vite](https://vitejs.dev/) - A fast development build tool.
- [Material-UI](https://mui.com/) - Modern React UI library.
- [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter) - Wallet connection handling for Solana.
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/) - JavaScript SDK for Solana blockchain interactions.

## **Contributing**

Contributions are welcome! If you'd like to contribute to the project, please follow these steps:

1. Fork the project.
2. Create your feature branch: `git checkout -b feature/YourFeature`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/YourFeature`.
5. Open a pull request.

## **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

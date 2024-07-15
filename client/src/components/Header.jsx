import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header({ account, connectWallet }) {
  const shortenAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  // console.log(account);
  return (
    <header className="header">
      <Link to="/" className="logo">ChainFlip Affiliate</Link>
      <nav>
          <Link to="/create" className="nav-link">Create Campaign</Link>
          <Link to="/active" className="nav-link">Active Campaigns</Link>
      </nav>
      {account ? (
        <span className="user-address">{shortenAddress(account)}</span>
      ) : (
        <button className="connect-button" onClick={connectWallet}>Connect Wallet</button>
      )}
    </header>
  );
}

export default Header;

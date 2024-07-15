import { ethers } from 'ethers';
import factoryAbi from '../contracts/CampaignFactory.json';
import campaignAbi from '../contracts/Campaign.json';
import { useState, useEffect } from 'react';

export function useConnectWallet() {
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [isWalletConnected, setWalletConnected] = useState(false);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        await updateSignerAndAccount();
        setWalletConnected(true);
        console.log("Wallet connected successfully");
      } catch (error) {
        console.error("An error occurred", error);
      }
    } else {
      console.log("Please install MetaMask!");
    }
  };

  const updateSignerAndAccount = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const newSigner = await provider.getSigner();
    setSigner(newSigner);
    setAccount(await newSigner.getAddress());
  };

  const disconnectWallet = () => {
    setSigner(null);
    setAccount(null);
    setWalletConnected(false);
    console.log("Wallet disconnected");
  };

  useEffect(() => {
    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        await updateSignerAndAccount();
      }
    };

    const handleDisconnect = () => {
      disconnectWallet();
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('disconnect', handleDisconnect);

      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            connectWallet();
          }
        });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      }
    };
  }, []);

  return { signer, account, isWalletConnected, connectWallet, disconnectWallet };
}
export function useCampaignFactory(factoryAddress, signer) {
    const [factory, setFactory] = useState(null);

    useEffect(() => {
        if (signer && factoryAddress) {
            setFactory(new ethers.Contract(factoryAddress, factoryAbi, signer));
        }
    }, [signer, factoryAddress]);

    return factory;
}

export function useCampaign(campaignAddress, signer) {
    const [campaign, setCampaign] = useState(null);

    useEffect(() => {
        if (signer && campaignAddress) {
            setCampaign(new ethers.Contract(campaignAddress, campaignAbi, signer));
        }
    }, [signer?.address, campaignAddress]);

    return campaign;
}
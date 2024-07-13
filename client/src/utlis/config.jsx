import { ethers } from 'ethers';
import factoryAbi from '../contracts/CampaignFactory.json';
import campaignAbi from '../contracts/Campaign.json';
import { useState, useEffect } from 'react';

export function useConnectWallet() {
    const [signer, setSigner] = useState(null);
    const [account, setAccount] = useState(null);
    const [isWalletConnected, setWalletConnected] = useState(null);
    useEffect(() => {
        async function connectWallet() {
            if (typeof window.ethereum !== 'undefined') {
                try {
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const newSigner = await provider.getSigner();
                    setSigner(newSigner);
                    setAccount(newSigner.address);
                    setWalletConnected(true);
                    console.log("Wallet connected successfully");
                } catch (error) {
                    console.error("An error occurred", error);
                }
            } else {
                console.log("Please install MetaMask!");
            }
        }
        connectWallet();
    }, []);

    return {signer,account,isWalletConnected};
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
    }, [signer, campaignAddress]);

    return campaign;
}
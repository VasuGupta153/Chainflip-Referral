import { useState } from 'react';
import { ethers, BaseWallet } from 'ethers';
import { VerificationLevel, IDKitWidget } from "@worldcoin/idkit";
import { useNavigate ,useParams} from 'react-router-dom';
import {useConnectWallet, useCampaign} from '../utils/config';
import { useAuth } from '../contexts/AuthContext';

export default function WorldID() {
    const navigate = useNavigate();
    let nullifierHash;
    const { user, setUser } = useAuth();
    // console.log(user);
    // console.log('hi');
    const params = useParams();
    const campaignAddress = params.campaignAddress;
    // console.log(campaignAddress);
    const {signer} =  useConnectWallet();
    // console.log(signer);
    const campaign = useCampaign(campaignAddress,signer);
    // console.log(campaign);

    if (!import.meta.env.VITE_PUBLIC_WLD_APP_ID) {
        throw new Error("app_id is not set in environment variables!");
    }
    if (!import.meta.env.VITE_PUBLIC_WLD_ACTION) {
        throw new Error("action is not set in environment variables!");
    }
    if (!import.meta.env.VITE_PLATFORM_PRIVATE_KEY) {
        throw new Error("Platform private key is not set in environment variables!");
    }

    const setVerified = async () => {
        if (!nullifierHash) {
            console.error("Nullifier hash is not set");
            return;
        }

        try {
            // Create a provider
            const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_RPC_URL);
            const privateKey = import.meta.env.VITE_PLATFORM_PRIVATE_KEY;
            // Create a wallet instance using the platform's private key
            const platformWallet = new ethers.Wallet(privateKey, provider);            
            // Call the setNullifierHash function
            const tx = await campaign.connect(platformWallet).setNullifierHash(signer.address, nullifierHash);
            await tx.wait();
            console.log("Nullifier hash set successfully");
            // console.log(user);
            setUser({ ...user, worldIDVerified: true });
            console.log(user);
            navigate(`/verified-user/${campaignAddress}`);

        } catch (error) {
            console.error("Error setting nullifier hash:", error);
        }

    };

    const onSuccess = async (result) => {
        window.alert("Successfully verified with World ID! Your nullifier hash is: " + result.nullifier_hash);
    };

    const handleProof = async (result) => {
        console.log("Proof received from IDKit:\n", JSON.stringify(result));
        const response = await campaign.hasNullifierHash(signer.address, result.nullifier_hash);        
        if(response){
            console.log('User already verified!');
            setUser({ ...user, worldIDVerified: true });
            navigate(`/verified-user/${campaignAddress}`);
        }
        else{
            const reqBody = {
                merkle_root: result.merkle_root,
                nullifier_hash: result.nullifier_hash,
                proof: result.proof,
                verification_level: result.verification_level,
                action: import.meta.env.VITE_PUBLIC_WLD_ACTION,
                signal: "",
            };
            console.log("Sending proof to backend for verification:\n", JSON.stringify(reqBody));
            try {
                const res = await fetch(import.meta.env.VITE_BACKEND, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(reqBody),
                });
                const data = await res.json();
                if (res.status == 200) {
                    nullifierHash = result.nullifier_hash;
                    console.log(result.nullifier_hash);
                    console.log("Successful response from backend:\n", data);
                    await setVerified();
                } else {
                    throw new Error(`Error code ${res.status} (${data.code}): ${data.detail}` || "Unknown error.");
                }
            } catch (error) {
                console.error("Error during verification:", error);
            }
        }
    };


    return (
        <div>
            <div className="flex flex-col items-center justify-center align-middle h-screen">
                <p className="text-2xl mb-5">World ID Cloud Template</p>
                <IDKitWidget
                    action={import.meta.env.VITE_PUBLIC_WLD_ACTION}
                    app_id={import.meta.env.VITE_PUBLIC_WLD_APP_ID}
                    onSuccess={onSuccess}
                    handleVerify={handleProof}
                    verification_level={VerificationLevel.Orb}
                >
                    {({ open }) =>
                        <button className="border border-black rounded-md" onClick={open}>
                            <div className="mx-3 my-1">Verify with World ID</div>
                        </button>
                    }
                </IDKitWidget>
            </div>
        </div>
    );
}

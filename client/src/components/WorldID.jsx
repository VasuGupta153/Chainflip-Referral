import { VerificationLevel, IDKitWidget } from "@worldcoin/idkit";

export default function Home() {
    if (!import.meta.env.VITE_PUBLIC_WLD_APP_ID) {
        throw new Error("app_id is not set in environment variables!");
    }
    if (!import.meta.env.VITE_PUBLIC_WLD_ACTION) {
        throw new Error("app_id is not set in environment variables!");
    }

    const onSuccess = (result) => {
        // This is where you should perform frontend actions once a user has been verified, such as redirecting to a new page
        window.alert("Successfully verified with World ID! Your nullifier hash is: " + result.nullifier_hash);
    };

    const handleProof = async (result) => {
        console.log("Proof received from IDKit:\n", JSON.stringify(result)); // Log the proof from IDKit to the console for visibility
        const reqBody = {
            merkle_root: result.merkle_root,
            nullifier_hash: result.nullifier_hash,
            proof: result.proof,
            verification_level: result.verification_level,
            action: import.meta.env.VITE_PUBLIC_WLD_ACTION,
            signal: "",
        };
        console.log("Sending proof to backend for verification:\n", JSON.stringify(reqBody)) // Log the proof being sent to our backend for visibility
        try {
            const res = await fetch("http://localhost:3000/api/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reqBody),
            });
            const data = await res.json();
            if (res.status == 200) {
                console.log("Successful response from backend:\n", data); // Log the response from our backend for visibility
                
            } else {
                throw new Error(`Error code ${res.status} (${data.code}): ${data.detail}` || "Unknown error."); // Throw an error if verification fails
            }
        } catch (error) {
            console.error("Error during verification:", error);
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
                    verification_level={VerificationLevel.Orb} // Change this to VerificationLevel.Device to accept Orb- and Device-verified users
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
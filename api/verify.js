import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

const WLD_API_BASE_URL = process.env.PUBLIC_WLD_API_BASE_URL;
const WLD_APP_ID = process.env.PUBLIC_WLD_APP_ID;


const verifyEndpoint = `${WLD_API_BASE_URL}/api/v1/verify/${WLD_APP_ID}`;

app.post('/api/verify', async (req, res) => {
  console.log("Received request to verify credential:\n", req.body);
  const reqBody = {
    nullifier_hash: req.body.nullifier_hash,
    merkle_root: req.body.merkle_root,
    proof: req.body.proof,
    verification_level: req.body.verification_level,
    action: req.body.action,
    signal: req.body.signal,
  };
  console.log("Sending request to World ID /verify endpoint:\n", reqBody);
  
  try {
    const verifyRes = await fetch(verifyEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });

    const wldResponse = await verifyRes.json();
    console.log(
      `Received ${verifyRes.status} response from World ID /verify endpoint:\n`,
      wldResponse
    );

    if (verifyRes.status === 200) {
      console.log(
        "Credential verified! This user's nullifier hash is: ",
        wldResponse.nullifier_hash
      );
      res.status(200).json({
        code: "success",
        detail: "This action verified correctly!",
      });
    } else {
      res.status(verifyRes.status).json({ 
        code: wldResponse.code, 
        detail: wldResponse.detail 
      });
    }
  } catch (error) {
    console.error("Error during verification:", error);
    res.status(500).json({ 
      code: "error", 
      detail: "An error occurred during verification." 
    });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
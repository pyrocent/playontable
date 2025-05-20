import Ably from "ably";
import express from "express";

const app  = express();
const rest = new Ably.Rest(process.env.ABLY_API_KEY);

app.get("/api/auth", (req, res) => {
    const clientId = req.query.clientId;
    rest.auth.createTokenRequest({clientId}, (err, tokenRequest) => {
        res.json(tokenRequest);
    });
});

app.listen(3000);
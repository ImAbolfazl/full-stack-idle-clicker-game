import dotenv from "dotenv";
dotenv.config();
import cors from "cors"
import express from "express";
import gameIdRoute from "../routes/gameIdRoute.js"

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({origin: "*", credentials: true}))
app.use(express.json());
app.use("/game", gameIdRoute)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
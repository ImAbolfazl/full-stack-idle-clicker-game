import express from "express";
import crypto, { randomUUID } from "crypto"
import { createGame, getGame, updateGame } from "../src/db.js";

const router = express.Router();

router.get("/create", (req, res) => {
    try{
        const uuid = crypto.randomUUID()
        createGame(uuid)
        res.status(200).json({status: "success", id: uuid})
    }catch(err){
        console.log(err);
        return res.status(500).json({status: "error"})
    }
});

router.post("/update/:id", (req, res) => {
    try{
        const id = req.params.id
        const {points, shopInfo} = req.body
        updateGame(points, shopInfo, id)
        res.status(200).json({status: success})
    }catch(err){
        console.log(err);
        return res.status(500).json({status: "error"})
    }
})

router.get("/get/:id", (req, res) => {
    try{
        const id = req.params.id
        const result = getGame(id)
        res.status(200).json({status:"success", date: result})
    }catch(err){
        console.log(err);
        return res.status(500).json({status: "error"})
    }
})

export default router
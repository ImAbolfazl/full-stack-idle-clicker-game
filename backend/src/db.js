import Database from "better-sqlite3"
import path from "path"

const dbPath = "./data.db"
const db = new Database(dbPath)

db.exec(`
    CREATE TABLE IF NOT EXISTS game (
        id TEXT PRIMARY KEY,
        points INTEGER,
        shopInfo TEXT
    )
`)

export function createGame(id, points, shopInfo){
    try{        
        const stmt = db.prepare("INSERT INTO game (id, points, shopInfo) VALUES (?, ?, ?)")
        stmt.run(id, points, shopInfo)
    }catch(err){
        console.log(err);
        throw err;
    }
}

export function updateGame(points, shopInfo, id){
    try{
        const stmt = db.prepare("UPDATE game SET points = ?, shopInfo = ? WHERE id = ?")
        stmt.run(points, shopInfo, id)
    }catch(err){
        console.log(err);
        throw err
    }
}

export function getGame(id){
    try{
        const stmt = db.prepare("SELECT * FROM game WHERE id = ?")
        const result = stmt.get(id)
        return result
    }catch(err){
        console.log(err);
        throw err
    }
}
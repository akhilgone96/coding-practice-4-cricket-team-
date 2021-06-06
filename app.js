const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;
app.use(express.json());


const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

//API1

app.get("/players/", async (request, response) => {
  const playerListQuery = `SELECT * FROM cricket_team ORDER BY player_id`;
  const playersList = await db.all(playerListQuery);
  response.send(
    playersList.map((eachPlayer) => {
      convertDbObjectToResponseObject(eachPlayer);
    })
  );
});

//API2

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `INSERT INTO cricket_team (playerName,jerseyNumber,role) 
  VALUES (
      ${playerName},
      ${jerseyNumber},
      ${role}
  );`;
  const dbResponse = await db.run(addPlayerQuery);
  const playerId = dbResponse.latsID;
  response.send(`Player Added to Team`);
});

//API3

app.get("/players/:playerId/", async (request, response) => {
  const playerId = request.params;
  const playerQuery = `SELECT * FROM cricket_team WHERE player_id = ${playerId};`;
  const player = await db.get(playerQuery);
  response.send(convertDbObjectToResponseObject(player));
});

//API4

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayerQuery = `UPDATE cricket_team 
  SET playerName = '${playerName}',
  jerseyNumber = '${jerseyNumber}',
  role = '${role}'
  WHERE player_id = ${playerID};`;
  await db.run(updatePlayerQuery);
  response.send(`Player Details Updated`)
});

//API5

app.delete("/players/:playerId/" async (request,response) => {
    const {playerId} = request.params;
    const deletePlayerQuery = `DELETE * FROM cricket_team WHERE player_id = ${playerID};`;
    await db.run(deletePlayerQuery);
    response.send("Player Removed") 
});

module.exports = app;

const express = require("express"); 
const app = express(); 
const Joi = require("joi"); 
const multer = require("multer"); 
app.use(express.static("public")); 
app.use(express.json()); 
const cors = require("cors"); 
app.use(cors()); 
const mongoose = require("mongoose"); 

const upload = multer({ dest:__dirname + "/public/images"});

mongoose
  .connect(
    "mongodb+srv://zakelguindi:Zakary13@cluster0.nj3vpi4.mongodb.net/"
  )
  .then(() => console.log("Connected to mongodb..."))
  .catch((err) => console.error("could not connect ot mongodb...", err));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html"); 
});

const teamSchema = new mongoose.Schema({
  name: String, 
  city: String, 
  arena: String, 
  bestPlayer: String, 
  titlesWon: Number, 
  starting5: [String],
});

const Team = mongoose.model("Team", teamSchema); 


app.get("/api/nbateams", (req, res) => {
  getTeams(res); 
});

const getTeams = async(res) => {
  const teams = await Team.find(); 
  res.send(teams); 
};

app.post("/api/nbateams", upload.single("img"), (req, res) => {
  const result = validateTeam(req.body);

  if (result.error) {
      res.status(400).send(result.error.details[0].message);
      return;
  }

  const team = new Team ({
    name: req.body.name,
    city: req.body.city, 
    arena: req.body.arena, 
    bestPlayer: req.body.bestPlayer, 
    titlesWon: req.body.titlesWon, 
    starting5: req.body.starting5.split(",")
  }); 

  createTeam(team, res); 
});

const createTeam = async(team, res) => {
  const result = await team.save(); 
  res.send(team); 
};

app.put("/api/nbateams/:id", upload.single("img"), (req, res) => {
  const result = validateTeam(req.body); 

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  updateTeam(req, res);
});

const updateTeam = async (req, res) => {

  let fieldsToUpdate = {
    name: req.body.name,
    city: req.body.city, 
    arena: req.body.arena, 
    bestPlayer: req.body.bestPlayer, 
    titlesWon: req.body.titlesWon, 
  
    starting5: req.body.starting5.split(","), 
  };

  const result = await Team.updateOne({ _id: req.params.id }, fieldsToUpdate); 
  const team = await Team.findById(req.params.id); 
  res.send(team); 
};

app.delete("/api/nbateams/:id", upload.single("img"), (req, res) => {
  removeTeam(res, req.params.id); 
});

const removeTeam = async(res, id) => {
  const team = await Team.findByIdAndDelete(id); 
  res.send(team); 
};


const validateTeam = (team) => {
  const schema = Joi.object({
    _id:Joi.allow(""),
    name: Joi.string().min(3), 
    city: Joi.string().min(2), 
    arena: Joi.string(), 
    bestPlayer: Joi.string(), 
    titlesWon: Joi.number(), 
    starting5: Joi.allow()
  });

  return schema.validate(team); 
};

app.listen(3004, () => {
  console.log("Listening...");
})
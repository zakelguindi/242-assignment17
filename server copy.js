const express = require("express"); 
const app = express(); 
const Joi = require("joi"); 
const multer = require("multer"); 
app.use(express.static("public")); 
app.use(express.json()); 
const cors = require("cors"); 
app.use(cors()); 

const upload = multer({ dest:__dirname + "/public/images"});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html"); 
});

let nbateams = [
  {
  _id: 1,
  name: "Philadelphia 76ers",
  city: "Philadelphia, Pennsylvania",
  arena: "Wells Fargo Center",
  bestPlayer: "Joel Embiid",
  titlesWon: 3,
  starting5: [
  "Tyrese Maxey",
  "De'Anthony Melton",
  "Kelly Oubre Jr.",
  "Tobias Harris",
  "Joel Embiid"
  ]
  },
  {
  _id: 2,
  name: "Boston Celtics",
  city: "Boston, Massachussetts",
  arena: "TD Garden",
  bestPlayer: "Jayson Tatum",
  titlesWon: 17,
  starting5: [
  "Jrue Holiday",
  "Derrick White",
  "Jaylen Brown",
  "Jayson Tatum",
  "Kristaps Porzingis"
  ]
  },
  {
  _id: 3,
  name: "Los Angeles Lakers",
  city: "Los Angeles, California",
  arena: "Crypto.com Arena",
  bestPlayer: "LeBron James",
  titlesWon: 17,
  starting5: [
  "D'Angelo Russell",
  "Gabe Vincent",
  "Austin Reaves",
  "LeBron James",
  "Anthony Davis"
  ]
  },
  {
  _id: 4,
  name: "Miami Heat",
  city: "Miami, Florida",
  arena: "American Airlines Center",
  bestPlayer: "Jimmy Butler",
  titlesWon: 3,
  starting5: [
  "Kyle Lowry",
  "Tyler Herro",
  "Jimmy Butler",
  "Haywood Highsmith",
  "Bam Adebayo"
  ]
  },
  {
  _id: 5,
  name: "Chicago Bulls",
  city: "Chicago, Illinois",
  arena: "United Center",
  bestPlayer: "Zach LaVine",
  titlesWon: 6,
  starting5: [
  "Coby White",
  "Zach LaVine",
  "DeMar DeRozan",
  "Torrey Craig",
  "Nikola Vucevic"
  ]
  },
  {
  _id: 6,
  name: "Golden State Warriors",
  city: "San Francisco, California",
  arena: "Chase Center",
  bestPlayer: "Steph Curry",
  titlesWon: 4,
  starting5: [
  "Steph Curry",
  "Klay Thompson",
  "Andrew Wiggins",
  "Draymond Green",
  "Kevon Looney"
  ]
  }
];

app.get("/api/nbateams", (req, res) => {
  res.send(nbateams);
});

app.post("/api/nbateams", upload.single("img"), (req, res) => {
  const result = validateTeam(req.body);

  if (result.error) {
      res.status(400).send(result.error.details[0].message);
      return;
  }
});

app.put("/api/nbateams/:id", upload.single("img"), (req, res) => {
  const id = parseInt(req.params.id); 
  const team = nbateams.find((r) => r._id === id);
  const result = validateTeam(req.body); 

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  
  team.name = req.body.name; 
  team.city = req.body.city; 
  team.arena = req.body.arena; 
  team.bestPlayer = req.body.bestPlayer; 
  team.titlesWon = req.body.titlesWon; 

  team.starting5 = req.body.starting5.split(","); 

  res.send(team); 
});

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

app.delete("/api/recipes/:id", upload.single("img"), (req, res) => {
  const id = parseInt(req.params.id); 
  const team = nbateams.find((r) => r._id === id); 

  if (!team) {
    res.status(404).send("The recipe was not found");
    return;
  }

  const index = nbateams.indexOf(team); 
  nbateams.splice(index, 1);
  res.send(team);  
});

app.listen(3004, () => {
  console.log("Listening...");
})
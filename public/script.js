
const getTeams = async() => {
  try {
    return (await fetch("api/nbateams/")).json(); 
  } catch(error) {
    console.log(error); 
  }
};

const showTeams = async() => {
  let teams = await getTeams(); 
  let teamsDiv = document.getElementById("nba-teams-div");
  teamsDiv.innerHTML = ""; 
  teams.forEach((team) => {
    const section = document.createElement("section"); 
    section.classList.add("team");
    teamsDiv.append(section); 

    const link = document.createElement("a"); 
    link.href = "#"; 
    section.append(link); 
    
    const name = document.createElement("h3"); 
    name.innerHTML = team.name; 
    link.append(name); 

    link.onclick = (e) => {
      e.preventDefault(); 
      displayDetails(team); 
    };

  });
};

const displayDetails = (team) => {
  const teamDetails = document.getElementById("teams-details"); 
  teamDetails.innerHTML = ""; 

  const name = document.createElement("h3"); 
  name.innerHTML = team.name; 
  teamDetails.append(name); 

  const deleteLink = document.createElement("a"); 
  deleteLink.innerHTML = "	&#x2715;";
  teamDetails.append(deleteLink); 
  deleteLink.id = "delete-link"; 

  const editLink = document.createElement("a"); 
  editLink.innerHTML = "&#9998;"; 
  teamDetails.append(editLink); 
  editLink.id = "edit-link"; 

  const city = document.createElement("p"); 
  city.innerHTML = team.city; 
  teamDetails.append(city); 

  const arena = document.createElement("p"); 
  arena.innerHTML = team.arena; 
  teamDetails.append(arena); 

  const bestPlayer = document.createElement("p"); 
  bestPlayer.innerHTML = team.bestPlayer; 
  teamDetails.append(bestPlayer); 

  const titlesWon = document.createElement("p"); 
  titlesWon.innerHTML = team.titlesWon; 
  teamDetails.append(titlesWon); 

  const startersDiv = document.createElement("div"); 
  const startersDivTitle = document.createElement("h3"); 
  startersDivTitle.innerHTML = "Starting 5"; 
  startersDiv.append(startersDivTitle);

    let i = 1; 
    let position = "PG"; 
    team.starting5.forEach((player) => {
      if(i == 1) {
        position = "PG"
      } else if(i ==2) {
        position = "SG"; 
      } else if(i == 3) {
        position = "SF"; 
      } else if(i == 4) {
        position = "PF"; 
      } else {
        position = "C"
      }
      const thisPlayer = document.createElement("ul"); 
      thisPlayer.innerHTML = position + ": " + player; 
      i++; 
      startersDiv.append(thisPlayer);
  });

  startersDiv.classList.add("starting5list"); 
  teamDetails.append(startersDiv); 

  editLink.onclick = (e) => {
    e.preventDefault(); 
    document.querySelector(".dialog").classList.remove("transparent"); 
    document.getElementById("add-edit-title").innerHTML = "Edit Team"; 
  }


  deleteLink.onclick = (e) => {
    e.preventDefault(); 
    deleteTeam(team); 
  }

  editTeamForm(team); 
}

const editTeamForm = (team) => {
  const form = document.getElementById("add-edit-team-form");
  form._id.value = team._id; 
  form.name.value = team.name; 
  form.city.value = team.city; 
  form.arena.value = team.arena; 
  form.bestPlayer.value = team.bestPlayer; 
  form.titlesWon.value = team.titlesWon; 
  populateStarting5(team); 
};

const populateStarting5 = (team) => {
  const players = document.getElementById("player-boxes"); 
  players.innerHTML = ""; 

  team.starting5.forEach((player) => {
    const input = document.createElement("input"); 
    input.type = "text"; 
    input.value = player; 
    players.append(input); 
  });

}

const deleteTeam = async(team) => {
  let response = await fetch(`/api/nbateams/${team._id}`, {
    method: "DELETE", 
    headers: {
      "Content-Type": "application/json;charset=utf-8"
    }
  });

  if(response.status != 200) {
    console.log("delete error"); 
    return;
  }

  let result = await response.json(); 
  showTeams(); 
  document.getElementById("teams-details").innerHTML = ""; 
};

const addEditTeam = async(e) => {
  e.preventDefault(); 
  const form = document.getElementById("add-edit-team-form");
  const formData = new FormData(form); 
  formData.append("starting5", getStarting5()); 

  let response; 
  //adding new team 
  if(form._id.value == -1) {
    e.preventDefault(); 
    formData.delete("_id"); 

    console.log(...formData); 
    
    response = await fetch("/api/nbateams", {
      method: "POST", 
      body: formData
    });
  } 
  
  //edit existing team
  else {
    console.log(...formData); 
    response = await fetch(`/api/nbateams/${form._id.value}`, {
      method: "PUT",
      body: formData      
    });

  }

  //got data from server 
  if(response.status != 200) {
    console.log("error posting data"); 
  }

  team = await response.json(); 

  if(form._id.value != -1) {
    displayDetails(team); 
  }
  resetForm(); 
  document.querySelector(".dialog").classList.add("transparent"); 
  showTeams(); 
  
};

const getStarting5 = () => {
  const inputs = document.querySelectorAll("#player-boxes input"); 
  let players = []; 
  console.log(inputs); 
  inputs.forEach((player) => {
    players.push(player.value); 
  });

  console.log(...players); 

  return players; 
};

const resetForm = () => {
  const form = document.getElementById("add-edit-team-form"); 
  form.reset(); 
  form._id = -1; 
  document.getElementById("player-boxes").innerHTML = ""; 
};

const showHideAdd = (e) => {
  e.preventDefault();
  document.querySelector(".dialog").classList.remove("transparent");
  document.getElementById("add-edit-title").innerHTML = "Add Team";
  resetForm();
};

const addPlayer = (e) => {
  e.preventDefault();
  const section = document.getElementById("player-boxes");
  const input = document.createElement("input");
  input.type = "text";
  section.append(input);
}



window.onload = () => {
  showTeams(); 

  document.querySelector(".close").onclick = () => {
    document.querySelector(".dialog").classList.add("transparent");
  };

  document.getElementById("add-edit-team-form").onsubmit = addEditTeam; 
  document.getElementById("add-link").onclick = showHideAdd; 

  document.getElementById("add-player").onclick = addPlayer;
}
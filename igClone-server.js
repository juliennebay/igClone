//server - igClone

const http = require("http");
const path = require("path");
const fs = require("fs");

const FILES = {
  ".js": "igClone.js",
  ".css": "igClone.css"
};

//signup function stores email addresses in a file (users-images.json)
function signUp(request, response) {
  let body = [];
  //chunk is a Buffer object
  request.on("data", chunk => body.push(chunk));
  request.on("end", () => {
    //body is an array of Buffer objects. Buffer.concat(arrayOfBuffers) --> A new Buffer
    //toString() of this gives us the string that was sent in the POST request, which is the stringified object
    const emailAdd = Buffer.concat(body).toString();
    const usersFile = fs.readFileSync("./users-images.json");
    //access the list of IDs in users-images.json (file)
    const usersObj = JSON.parse(usersFile);
    //check if user ID already exists
    //first if statement - user already exists
    if (Object.keys(usersObj).includes(emailAdd)) {
      response.writeHead(422, { "Content-Type": "text" });
      response.end("user already exists", "utf-8");
    } else {
      //if the user id is not in file, add the ID to file (users.json)
      usersObj[emailAdd] = [];
      //the line below will update the file (users-images.json)
      fs.writeFileSync("./users-images.json", JSON.stringify(usersObj));
      response.writeHead(200, { "Content-Type": "text" });
      response.end();
    }
  });
}

//this function checks if the user ID is in users-images.json file
function login(request, response) {
  let body = [];
  //chunk is a Buffer object
  request.on("data", chunk => body.push(chunk));
  request.on("end", () => {
    //body is an array of Buffer objects. Buffer.concat(arrayOfBuffers) --> A new Buffer
    //toString() of this gives us the string that was sent in the POST request, which is the stringified object
    const userID = Buffer.concat(body).toString();
    const usersFile = fs.readFileSync("./users-images.json");
    //right now, it's a string (because JSON is a text file format). so we'll use JSON parse to convert it into an obj
    const usersObj = JSON.parse(usersFile);
    if (Object.keys(usersObj).includes(userID)) {
      response.writeHead(200, { "Content-Type": "text" });
      response.end("login successful", "utf-8");
    } else {
      //if the user id is not in file
      response.writeHead(401, { "Content-Type": "text" });
      response.end("login unsuccessful", "utf-8");
    }
  });
}

function getUserId(cookie) {
  console.log("cookie is:", cookie);
  return cookie && cookie.match(/userID=(.*)/)[1];
}

//this function stores images in a file (users-images.json)
function addImage(request, response) {
  let body = [];
  //chunk is a Buffer object
  request.on("data", chunk => body.push(chunk));
  request.on("end", () => {
    //body is an array of Buffer objects. Buffer.concat(arrayOfBuffers) --> A new Buffer
    //toString() of this gives us the string that was sent in the POST request, which is the stringified object
    const dataURL = Buffer.concat(body).toString();
    const usersFile = fs.readFileSync("./users-images.json");
    //get userID
    const userID = getUserId(request.headers.cookie);

    //store images in a file (users-images.json)
    //right now, it's a string (because JSON is a text file format). so we'll use JSON parse to convert it into an obj
    const usersObj = JSON.parse(usersFile);
    //make sure the user is valid
    if (usersObj[userID]) {
      usersObj[userID].push({ time: new Date().toISOString(), image: dataURL });
      //the line below will update the file (images.json)
      fs.writeFileSync("./users-images.json", JSON.stringify(usersObj));
      response.writeHead(204);
      response.end();
    } else {
      response.writeHead(401);
      response.end();
    }
  });
}

//this function deletes the selected image & updates users-images.json file
function deleteImage(request, response) {
  let body = [];
  request.on("data", chunk => body.push(chunk));
  request.on("end", () => {
    const dataURL = Buffer.concat(body).toString();
    //get users file
    const usersFile = fs.readFileSync("./users-images.json");
    //make it into an object
    const usersObj = JSON.parse(usersFile);
    //get the current user ID from cookie
    const userID = getUserId(request.headers.cookie);

    if (usersObj[userID]) {
      //get the current images of the user (array of objects)
      const savedImages = usersObj[userID];
      const imagesNotToDelete = savedImages.filter(
        picObj => picObj.image !== dataURL
      );
      //set the value of the user object to "images not to delete"
      usersObj[userID] = imagesNotToDelete;
      fs.writeFileSync("./users-images.json", JSON.stringify(usersObj));
      response.writeHead(204);
      response.end();
    } else {
      response.writeHead(401);
      response.end();
    }
  });
}

const server = http.createServer((request, response) => {
  console.log("req url: ", request.url, "req method: ", request.method);
  if (request.method === "POST") {
    if (request.url === "/signup") {
      signUp(request, response);
    } else if (request.url === "/login") {
      login(request, response);
    } else if (request.url === "/add_image") {
      addImage(request, response);
    } else if (request.url === "/delete_image") {
      deleteImage(request, response);
    }
  } else if (request.url === "/images") {
    //this reads images from file (of the logged in user) & sends it back to the browser
    const userID = getUserId(request.headers.cookie);
    const usersFile = fs.readFileSync("./users-images.json");
    const usersObj = JSON.parse(usersFile);
    const usersImages = usersObj[userID];

    if (usersImages) {
      response.writeHead(200, { "Content-Type": `application/json` });
      response.end(JSON.stringify(usersImages), "utf-8");
    } else {
      response.writeHead(401);
      response.end();
    }
  } else {
    const fileName = FILES[path.extname(request.url)] || "index.html";
    const contentType = `text/${path.extname(request.url).replace(".", "") ||
      "html"}`;
    const responseContent = fs.readFileSync(`./${fileName}`);
    response.writeHead(200, { "Content-Type": contentType });
    response.end(responseContent, "utf-8");
  }
});

server.listen(3000);

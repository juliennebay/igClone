//server - igClone

const http = require("http");
const path = require("path");
const fs = require("fs");

const FILES = {
  ".js": "igClone.js"
};

//signup function stores email addresses in a file (users.json)
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

//this function checks if the user ID is in users.json file
function login(request, response) {
  let body = [];
  //chunk is a Buffer object
  request.on("data", chunk => body.push(chunk));
  request.on("end", () => {
    //body is an array of Buffer objects. Buffer.concat(arrayOfBuffers) --> A new Buffer
    //toString() of this gives us the string that was sent in the POST request, which is the stringified object
    const userID = Buffer.concat(body).toString();
    const usersFile = fs.readFileSync("./users-images.json");
    //right now, it's a string (because JSON is a text file format). so we'll use JSON parse to convert it into an array
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

//this function stores images in a file (images.json)
function addImage(request, response) {
  let body = [];
  //chunk is a Buffer object
  request.on("data", chunk => body.push(chunk));
  request.on("end", () => {
    //body is an array of Buffer objects. Buffer.concat(arrayOfBuffers) --> A new Buffer
    //toString() of this gives us the string that was sent in the POST request, which is the stringified object
    const dataURL = Buffer.concat(body).toString();
    console.log(dataURL.slice(0, 50));
    const imagesFile = fs.readFileSync("./images.json");
    //store images in a file (images.json)
    //right now, it's a string (because JSON is a text file format). so we'll use JSON parse to convert it into an array
    const imagesArray = JSON.parse(imagesFile);
    imagesArray.push(dataURL);
    //the line below will update the file (images.json)
    fs.writeFileSync("./images.json", JSON.stringify(imagesArray));
  });
  response.writeHead(204);
  response.end();
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
    }
  } else if (request.url === "/images") {
    //this reads images from file & sends it back to the requester
    const imagesFile = fs.readFileSync("./images.json");
    const contentType = `application/json`;
    response.writeHead(200, { "Content-Type": contentType });
    response.end(imagesFile, "utf-8");
  } else {
    const fileName = FILES[path.extname(request.url)] || "index.html";
    const contentType = `text/${path.extname(request.url).replace(".", "") ||
      "html"}`;
    const responseContent = fs.readFileSync(`./${fileName}`);
    response.writeHead(200, { "Content-Type": contentType });
    response.end(responseContent, "ut f-8");
  }
});

server.listen(3000);

//THIS FILE HAS SIGNUP AND LOGIN FUNCTIONS (for authentication)
const fs = require("fs");
const bcrypt = require("bcrypt");

//signup function stores email addresses in a file (users-images.json)
function signUp(request, response) {
  let body = [];
  //chunk is a Buffer object
  request.on("data", chunk => body.push(chunk));
  request.on("end", () => {
    //body is an array of Buffer objects. Buffer.concat(arrayOfBuffers) --> A new Buffer
    //toString() of this gives us the string that was sent in the POST request, which is the stringified object
    const userInfo = JSON.parse(Buffer.concat(body).toString());
    const usersFile = fs.readFileSync("./users-images.json");
    //access the list of IDs in users-images.json (file)
    const usersObj = JSON.parse(usersFile);
    //check if user ID already exists
    //first if statement - user already exists
    if (Object.keys(usersObj).includes(userInfo.id)) {
      response.writeHead(422, { "Content-Type": "text" });
      response.end("user already exists", "utf-8");
    } else {
      //hash the password before storing it
      const password = userInfo.password;
      bcrypt.hash(password, 10).then(hash => {
        //if the user id is not in file, add the ID to file (users.json)
        usersObj[userInfo.id] = {
          password: hash,
          images: [],
          following: []
        };
        //the line below will update the file (users-images.json)
        fs.writeFileSync("./users-images.json", JSON.stringify(usersObj));
        response.writeHead(200, { "Content-Type": "text" });
        response.end();
      });
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
    const userInfo = JSON.parse(Buffer.concat(body).toString());
    const usersFile = fs.readFileSync("./users-images.json");
    //right now, it's a string (because JSON is a text file format). so we'll use JSON parse to convert it into an obj
    const usersObj = JSON.parse(usersFile);
    const existingUser = usersObj[userInfo.id];
    //check if user exists
    if (existingUser) {
      const hashedPassword = existingUser.password;
      //compare hashed password
      bcrypt.compare(userInfo.password, hashedPassword).then(result => {
        if (result) {
          response.writeHead(200, { "Content-Type": "text" });
          response.end("login successful", "utf-8");
        } else {
          //if the password is wrong
          response.writeHead(401, { "Content-Type": "text" });
          response.end("login unsuccessful", "utf-8");
        }
      });
    } else {
      //the user doesn't exist
      response.writeHead(401, { "Content-Type": "text" });
      response.end("login unsuccessful", "utf-8");
    }
  });
}

module.exports = { signUp, login };

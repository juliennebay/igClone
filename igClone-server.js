//server - igClone
//THIS FILE CREATES THE SERVER & DEFINES THE ROUTES

const http = require("http");
const path = require("path");
const fs = require("fs");

//require from auth.js file
const { signUp, login } = require("./auth");

//require from users-images.js file
const { addImage, deleteImage, images } = require("./users-images");

const FILES = {
  ".js": "igClone.js",
  ".css": "igClone.css"
};

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
    images(request, response);
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

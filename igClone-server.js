//server - igClone

const http = require("http");
const path = require("path");
const fs = require("fs");

const FILES = {
  ".js": "igClone.js"
};

const server = http.createServer((request, response) => {
  console.log("req url: ", request.url);
  if (request.method === "POST") {
    let body = [];
    //chunk is a Buffer object
    request.on("data", chunk => body.push(chunk));
    request.on("end", () => {
      console.log("data transmission end");
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
  } else if (request.url === "/images") {
    //need to fetch images from file
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
    response.end(responseContent, "utf-8");
  }
});

server.listen(3000);

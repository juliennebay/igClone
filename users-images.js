//THIS FILE HAS THE FUNCTIONS NEEDED FOR igClone-server.js (except signup and login)
const fs = require("fs");

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
    const dataObj = JSON.parse(Buffer.concat(body).toString());
    const usersFile = fs.readFileSync("./users-images.json");
    //get userID
    const userID = getUserId(request.headers.cookie);

    //store images in a file (users-images.json)
    //right now, it's a string (because JSON is a text file format). so we'll use JSON parse to convert it into an obj
    const usersObj = JSON.parse(usersFile);
    //make sure the user is valid
    if (usersObj[userID]) {
      usersObj[userID].images.push({
        time: new Date().toISOString(),
        image: dataObj.image,
        comment: dataObj.comment
      });
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
      //get the current images of the user (array of objects, which is stored as the value of key "images")
      const savedImages = usersObj[userID].images;
      const imagesNotToDelete = savedImages.filter(
        picObj => picObj.image !== dataURL
      );
      //set the value of the user object to "images not to delete"
      usersObj[userID].images = imagesNotToDelete;
      fs.writeFileSync("./users-images.json", JSON.stringify(usersObj));
      response.writeHead(204);
      response.end();
    } else {
      response.writeHead(401);
      response.end();
    }
  });
}

//this function reads images from file (of the logged in user) & sends it back to the browser
//(the main images page)
function images(request, response) {
  const userID = getUserId(request.headers.cookie);
  const usersFile = fs.readFileSync("./users-images.json");
  const usersObj = JSON.parse(usersFile);
  const existingUser = usersObj[userID];
  if (existingUser) {
    const usersImages = existingUser.images;
    response.writeHead(200, { "Content-Type": `application/json` });
    response.end(JSON.stringify(usersImages), "utf-8");
  } else {
    response.writeHead(401);
    response.end();
  }
}

//this function reads the names of other app users (other than the logged in user) & sends them back to the browser
//(the "otherUsersList" page)
function otherUsers(request, response) {
  //we want to show all the users who are NOT currently logged in
  const loggedInUserID = getUserId(request.headers.cookie);
  const usersFile = fs.readFileSync("./users-images.json");
  const usersObj = JSON.parse(usersFile);
  //filter out all the users who are NOT logged in
  const loggedInUserObj = usersObj[loggedInUserID];
  const loggedInUserObjFollowing = loggedInUserObj.following;
  const otherUserObjs = Object.keys(usersObj)
    .filter(id => id !== loggedInUserID)
    .map(id => ({
      userID: id,
      following: loggedInUserObjFollowing.includes(id)
    }));
  response.writeHead(200, { "Content-Type": "application/json" });
  response.end(JSON.stringify(otherUserObjs), "utf-8");
}

//this function lets the user "follow" the selected user when a POST request is made
function followUser(request, response) {
  const body = [];
  request.on("data", chunk => body.push(chunk));
  request.on("end", () => {
    const userIdToFollow = Buffer.concat(body).toString();
    const currentUserId = getUserId(request.headers.cookie);
    const usersFile = fs.readFileSync("./users-images.json");
    const usersObj = JSON.parse(usersFile);
    usersObj[currentUserId].following.push(userIdToFollow);
    fs.writeFileSync("./users-images.json", JSON.stringify(usersObj));
    response.writeHead(204);
    response.end();
  });
}

//unfollow the user when the POST request is made
function unfollowUser(request, response) {
  const body = [];
  request.on("data", chunk => body.push(chunk));
  request.on("end", () => {
    const userIdToFollow = Buffer.concat(body).toString();
    const currentUserId = getUserId(request.headers.cookie);
    const usersFile = fs.readFileSync("./users-images.json");
    const usersObj = JSON.parse(usersFile);
    usersObj[currentUserId].following = usersObj[
      currentUserId
    ].following.filter(user => user !== userIdToFollow);
    fs.writeFileSync("./users-images.json", JSON.stringify(usersObj));
    response.writeHead(204);
    response.end();
  });
}

module.exports = {
  addImage,
  deleteImage,
  images,
  otherUsers,
  followUser,
  unfollowUser
};

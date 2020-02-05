function getUserId(cookie) {
  return cookie && cookie.match(/userID=(.*)/)[1];
}
function generateDeleteEventHandler(imageSrc) {
  //there has to be a function within a function, because:
  //1. the second argument of add event listener has to be a function
  //but you don't want the function to run immediately (because we have to CALL the function with img.src)
  //when you add the image
  return function deleteImage(event) {
    // We are going make a fetch to the server here instructing
    // it to delete the image that corresponds to imageSrc
    fetch("/delete_image", {
      method: "POST",
      headers: {
        "Content-Type": "text"
      },
      body: imageSrc
    }).then(response => {
      if (response.status === 204) {
        window.location.reload();
      } else {
        window.history.pushState({}, "", "http://localhost:3000/login");
        window.location.reload();
      }
    });
  };
}

function addFile(event) {
  //event.target is the file input (that thing you click in the input field)
  const file = event.target.files[0]; // Files object, we are gonna assume length 1

  const img = document.createElement("img");
  img.setAttribute("height", "20%");
  img.setAttribute("width", "20%");
  img.classList.add("image");

  const fileReader = new FileReader(); //new FileReader returns a fileReader object
  //note: the event (onload event) below is the reading of the file
  fileReader.onload = e => {
    //e.target is fileReader
    img.src = e.target.result;
    img.setAttribute("id", "newImage");
    document.querySelector("#postImagesPage").prepend(img);
  };
  //this reads the file, and triggers onload event (above)
  //this HAS to be outside onload function
  fileReader.readAsDataURL(file);
}
function addImageComment() {
  //send a POST request to the server, in order to store the image data (e.target.result)
  fetch("/add_image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      image: document.querySelector("#newImage").src,
      comment: document.querySelector("#comment").value
    })
  }).then(response => {
    if (response.status === 401) {
      window.history.pushState({}, "", "http://localhost:3000/login");
    } else {
      window.history.pushState({}, "", "http://localhost:3000");
    }
    window.location.reload();
  });
}

function signUp() {
  //make a POST request to store the email address in the server (there will be a file)
  fetch("/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id: document.querySelector("#emailAddressInput").value,
      password: document.querySelector("#passwordInput").value
    })
  }).then(response => {
    if (response.status === 200) {
      //if the userID was unique and was able to sign up successfully, then redirect to the login pg
      window.history.pushState({}, "", "http://localhost:3000/login");
      window.location.reload();
    } else {
      //if the userID already exists, then show error message
      const errorMsg = document.createElement("p");
      errorMsg.textContent =
        "User ID already taken. Try to sign up with another User ID or email";
      document.querySelector("#signUpPage").appendChild(errorMsg);
    }
  });
}

function login() {
  //check to see if this name/email address is in the file (users.json)
  fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: document.querySelector("#loginIDInput").value,
      password: document.querySelector("#loginPasswordInput").value
    })
  }).then(response => {
    if (response.status === 200) {
      //store the userID in cookie
      document.cookie = `userID=${
        document.querySelector("#loginIDInput").value
      }`;
      //if the user exists (in users-images.json), then redirect to main images page
      window.history.pushState({}, "", "http://localhost:3000");
      window.location.reload();
    } else {
      //if the user doesn't exist, then show error message
      const errorMsg = document.createElement("p");
      errorMsg.textContent = "Incorrect user ID/email address or password";
      document.querySelector("#loginPage").appendChild(errorMsg);
    }
  });
}

function followThisUser(event) {
  const button = event.target;
  const userId = button.parentElement.querySelector("span").textContent;
  fetch("/follow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: userId
  }).then(() => {
    //reload page
    window.location.reload();
  });
}

function unfollowThisUser(event) {
  const button = event.target;
  const userId = button.parentElement.querySelector("span").textContent;
  fetch("/unfollow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: userId
  }).then(() => {
    //reload page
    window.location.reload();
  });
}

function loadScript() {
  const signUpPage = document.querySelector("#signUpPage");
  const imagesPage = document.querySelector("#imagesPage");
  const loginPage = document.querySelector("#loginPage");
  const postImagesPage = document.querySelector("#postImagesPage");
  const otherUsersListPage = document.querySelector("#otherUsersList");
  const whoAmI = document.querySelector("#whoAmI");
  //check if the user is logged in
  const userID = getUserId(document.cookie);
  if (userID) {
    whoAmI.textContent = `You're logged in as ${userID}`;
  }

  if (window.location.pathname === "/signup") {
    imagesPage.hidden = true;
    signUpPage.hidden = false;
    loginPage.hidden = true;
    postImagesPage.hidden = true;
    otherUsersListPage.hidden = true;
    const signUpButton = document.querySelector("#signUpButton");
    signUpButton.addEventListener("click", signUp);
  } else if (window.location.pathname === "/login") {
    imagesPage.hidden = true;
    signUpPage.hidden = true;
    loginPage.hidden = false;
    postImagesPage.hidden = true;
    otherUsersListPage.hidden = true;
    //clear previous cookies
    document.cookie =
      document.cookie + ";expires=Thu, 01 Jan 1970 00:00:01 GMT;'";
    const loginButton = document.querySelector("#loginButton");
    loginButton.addEventListener("click", login);
  } else if (window.location.pathname === "/new") {
    imagesPage.hidden = true;
    signUpPage.hidden = true;
    loginPage.hidden = true;
    postImagesPage.hidden = false;
    otherUsersListPage.hidden = true;
    const fileInput = document.querySelector("#fileInput");
    const postButton = document.querySelector("#postButton");
    fileInput.addEventListener("change", addFile);
    postButton.addEventListener("click", addImageComment);
  } else if (window.location.pathname === "/following") {
    imagesPage.hidden = true;
    signUpPage.hidden = true;
    loginPage.hidden = true;
    postImagesPage.hidden = true;
    otherUsersListPage.hidden = false;
    //fetch the user IDs of users who aren't currently logged in
    fetch("/otherusers").then(response => {
      return response.json().then(otherUserObjs => {
        //right now, it's an array of objects (includes the key userID (value - ID) & following (value - t/f)).
        const ul = document.createElement("ul");
        otherUserObjs.forEach(userObj => {
          const li = document.createElement("li");
          const followButton = document.createElement("button");
          followButton.classList.add("followButton");
          const span = document.createElement("span");
          span.textContent = userObj.userID;
          followButton.textContent = userObj.following ? "unfollow" : "follow";

          ul.appendChild(li);
          li.appendChild(span);
          li.appendChild(followButton);
          followButton.addEventListener(
            "click",
            userObj.following ? unfollowThisUser : followThisUser
          );
        });
        otherUsersListPage.appendChild(ul);
      });
    });
  } else {
    imagesPage.hidden = false;
    signUpPage.hidden = true;
    loginPage.hidden = true;
    postImagesPage.hidden = true;
    otherUsersListPage.hidden = true;
    //what happens when you click on "add a photo" button
    const addButton = document.querySelector("#addSomethingButton");
    addButton.addEventListener("click", () => {
      window.history.pushState({}, "", "http://localhost:3000/new");
      window.location.reload();
    });

    fetch("/images") //it'll use the current address, so no need to add "http://localhost:3000/images"
      .then(response => {
        if (response.status === 200) {
          return response.json().then(imageObjs => {
            //for each image, create img element and attach source
            //imageObjs = an array of objects (which includes time and image source and comment)
            imageObjs
              .sort((a, b) => (b.time > a.time ? 1 : b.time < a.time ? -1 : 0))
              .forEach(imageObj => {
                //delete button
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.classList.add("deleteButton");
                //image
                const img = document.createElement("img");
                img.classList.add("image");
                img.setAttribute("height", "20%");
                img.setAttribute("width", "20%");
                img.src = imageObj.image;
                //comment
                const comment = document.createElement("p");
                comment.textContent = imageObj.comment;
                document.querySelector("#imagesPage").appendChild(img);
                document.querySelector("#imagesPage").appendChild(comment);
                document.querySelector("#imagesPage").appendChild(deleteButton);
                deleteButton.addEventListener(
                  "click",
                  generateDeleteEventHandler(img.src)
                );
              });
          });
        } else {
          window.history.pushState({}, "", "http://localhost:3000/login");
          window.location.reload();
        }
      });
  }
  //replace the local storage "get items" with getting images from the server
  //(in igClone-server.js, we'll write another "else if" condition)
}
document.addEventListener("DOMContentLoaded", loadScript);

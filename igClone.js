function deleteImage(imageSrc) {
  return function deleteClickEventHandler(event) {
    // We are going make a fetch to the server here instructing
    // it to delete the image that corresponds to imageSrc
    fetch("/delete_image", {
      method: "POST",
      headers: {
        "Content-Type": "text"
      },
      body: imageSrc
    }).then(response => {
      window.history.pushState({}, "", "http://localhost:3000");
      window.location.reload();
    });
  };
}

function addFile(event) {
  const file = event.target.files[0]; // Files object, we are gonna assume length 1

  const img = document.createElement("img");
  img.setAttribute("height", "20%");
  img.setAttribute("width", "20%");
  img.classList.add("image");

  //delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("deleteButton");

  const fileReader = new FileReader();
  //note: the event below is the reading of the file
  fileReader.onload = e => {
    img.src = e.target.result;
    document.querySelector("#imagesPage").appendChild(img);
    document.querySelector("#imagesPage").appendChild(deleteButton);
    deleteButton.addEventListener("click", deleteImage(img.src));

    //send a POST request to the server, in order to store the image data (e.target.result)
    fetch("/add_image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: e.target.result
    }).then(response => {
      if (response.status === 401) {
        window.history.pushState({}, "", "http://localhost:3000/login");
        window.location.reload();
      }
    });
  };
  //this reads the file, and triggers onload event (line 10)
  fileReader.readAsDataURL(file);
}

function signUp() {
  //make a POST request to store the email address in the server (there will be a file)
  fetch("/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: document.querySelector("#emailAddressInput").value
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
    headers: { "Content-Tyle": "application/json" },
    body: document.querySelector("#loginIDInput").value
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
      errorMsg.textContent = "User ID/email address does not exist";
      document.querySelector("#loginPage").appendChild(errorMsg);
    }
  });
}

function loadScript() {
  const signUpPage = document.querySelector("#signUpPage");
  const imagesPage = document.querySelector("#imagesPage");
  const loginPage = document.querySelector("#loginPage");
  if (window.location.pathname === "/signup") {
    imagesPage.hidden = true;
    signUpPage.hidden = false;
    loginPage.hidden = true;
    const signUpButton = document.querySelector("#signUpButton");
    signUpButton.addEventListener("click", signUp);
  } else if (window.location.pathname === "/login") {
    imagesPage.hidden = true;
    signUpPage.hidden = true;
    loginPage.hidden = false;
    //clear previous cookies
    document.cookie =
      document.cookie + ";expires=Thu, 01 Jan 1970 00:00:01 GMT;'";
    const loginButton = document.querySelector("#loginButton");
    loginButton.addEventListener("click", login);
  } else {
    imagesPage.hidden = false;
    signUpPage.hidden = true;
    loginPage.hidden = true;
    const fileInput = document.querySelector("#fileInput");
    fetch("/images") //it'll use the current address, so no need to add "http://localhost:3000/images"
      .then(response => {
        if (response.status === 200) {
          return response.json().then(imageURLs => {
            //for each image, create img element and attach source
            imageURLs.forEach(imageURL => {
              //delete button
              const deleteButton = document.createElement("button");
              deleteButton.textContent = "Delete";
              deleteButton.classList.add("deleteButton");

              const img = document.createElement("img");
              img.classList.add("image");
              img.setAttribute("height", "20%");
              img.setAttribute("width", "20%");
              img.src = imageURL;
              document.querySelector("#imagesPage").appendChild(img);
              document.querySelector("#imagesPage").appendChild(deleteButton);
              deleteButton.addEventListener("click", deleteImage(img.src));
            });
          });
        } else {
          window.history.pushState({}, "", "http://localhost:3000/login");
          window.location.reload();
        }
      });
    fileInput.addEventListener("change", addFile);
  }
  //replace the local storage "get items" with getting images from the server
  //(in igClone-server.js, we'll write another "else if" condition)
}
document.addEventListener("DOMContentLoaded", loadScript);

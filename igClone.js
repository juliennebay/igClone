function addFile(event) {
  const file = event.target.files[0]; // Files object, we are gonna assume length 1

  const img = document.createElement("img");
  img.setAttribute("height", "20%");
  img.setAttribute("width", "20%");

  const fileReader = new FileReader();
  //note: the event below is the reading of the file
  fileReader.onload = e => {
    img.src = e.target.result;
    document.querySelector("body").appendChild(img);

    //send a POST request to the server, in order to store the image data (e.target.result)
    fetch("/add_image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: e.target.result
    });
  };
  //this reads the file, and triggers onload event (line 12)
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
      //redirect to main images page
      //response.text().then(text => console.log("Response text is: ", text));
      window.history.pushState({}, "", "http://localhost:3000");
      window.location.reload();
    } else {
      //show error message
      const errorMsg = document.createElement("p");
      errorMsg.textContent = "User ID/email address does not exist";
      document.querySelector("body").appendChild(errorMsg);
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
    const loginButton = document.querySelector("#loginButton");
    loginButton.addEventListener("click", login);
  } else {
    imagesPage.hidden = false;
    signUpPage.hidden = true;
    loginPage.hidden = true;
    const fileInput = document.querySelector("#fileInput");
    fetch("/images") //it'll use the current address, so no need to add "http://localhost:3000/images"
      .then(response => response.json())
      .then(imageURLs => {
        //for each image, create img element and attach source
        imageURLs.forEach(imageURL => {
          const img = document.createElement("img");
          img.setAttribute("height", "20%");
          img.setAttribute("width", "20%");
          img.src = imageURL;
          document.querySelector("body").appendChild(img);
        });
      });
    fileInput.addEventListener("change", addFile);
  }
  //replace the local storage "get items" with getting images from the server
  //(in igClone-server.js, we'll write another "else if" condition)
}
document.addEventListener("DOMContentLoaded", loadScript);

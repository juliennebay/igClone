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
    }).then();
  };
  //this reads the file, and triggers onload event (line 12)
  fileReader.readAsDataURL(file);
}

function loadScript() {
  if (window.location.pathname === "/signup") {
    const input = document.querySelector("#input");
    input.hidden = true;
    const p = document.createElement("p");
    p.textContent = "Welcome puppies";
    document.querySelector("body").appendChild(p);
  } else {
    const input = document.querySelector("#input");
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
    input.addEventListener("change", addFile);
  }
  //replace the local storage "get items" with getting images from the server
  //(in igClone-server.js, we'll write another "else if" condition)
}
document.addEventListener("DOMContentLoaded", loadScript);

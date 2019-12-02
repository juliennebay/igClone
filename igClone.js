function loadScript() {
  const input = document.querySelector("#input");

  //retrieve items in local storage and display them when the page reloads
  //localStorage.getItem("imgs");
  if (localStorage.getItem("images")) {
    JSON.parse(localStorage.getItem("images")).forEach(imgSrc => {
      const img = document.createElement("img");
      img.setAttribute("height", "20%");
      img.setAttribute("width", "20%");
      img.src = imgSrc;
      document.querySelector("body").appendChild(img);
    });
  }

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
      //store in local storage
      const imagesArr = JSON.parse(localStorage.getItem("images")) || [];
      imagesArr.push(e.target.result);
      localStorage.setItem("images", JSON.stringify(imagesArr));

      //send a POST request to the server, in order to store the image data (e.target.result)
      fetch("http://localhost:3000/add_image", {
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

  input.addEventListener("change", addFile);
}
document.addEventListener("DOMContentLoaded", loadScript);

function loadScript() {
  const input = document.querySelector("#input");

  function addFile(event) {
    const files = event.target.files; // Files object, we are gonna assume length 1
    const imageFile = files[0];

    const img = document.createElement("img");
    img.setAttribute("height", 200);
    img.setAttribute("width", 300);

    const fileReader = new FileReader();
    fileReader.onload = e => {
      img.src = e.target.result;
      document.querySelector("body").appendChild(img);
    };

    fileReader.readAsDataURL(imageFile);
  }

  input.addEventListener("change", addFile);
}
document.addEventListener("DOMContentLoaded", loadScript);

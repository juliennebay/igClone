# Instagram Clone
*The app is currently under construction*

This application lets the users upload images with comments, which will be sorted by time of upload (the recent picture is shown first) and displayed on the main page.

Each user can sign up, login and post images. Unregistered users will be redirected to the sign up page.

# How it works

## Login and signup
*As it is right now, it's not secure. I will change this eventually. Current user is stored in an unencrypted cookie 
Users are stored in a JSON file, which stores the user's ID as an object's key. The key's values are stored in an array of objects, which are: the time of posting, image source and comment.
login and signup either looks for a user or adds a user to this file.

## Add image and comment (with screenshot)

* Images, comments and image timestamp are stored in the same JSON file as users

## Display images (with screenshot)

# How to run locally
Start the server with `igClone-server.js`. The server will start at port 3000. Navigate to http://localhost:3000 in the browser.

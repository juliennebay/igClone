# Instagram Clone
*The app is currently under construction*

This application lets the users upload images with comments, which will be sorted by time of upload (the recent picture is shown first) and displayed on the main page.

Each user can sign up, login and post images. Unregistered users will be redirected to the sign up page.

# How it works

## Login and signup

* Users are stored in a file, login and signup either looks for a user or adds a user to this file. Not secure, I know, but will change this eventually
* Current user is stored in an unencrypted cookie

## Add image and comment (with screenshot)

* Images, comments and image timestamp are stored in the same JSON file as users

## Display images (with screenshot)

# How to run locally
Start the server with `igClone-server.js`. The server will start at port 3000. Navigate to http://localhost:3000 in the browser.

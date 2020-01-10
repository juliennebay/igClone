# Instagram Clone
*The app is currently under construction*

This application lets users upload images with comments, which will be sorted by time of upload (the recent picture is shown first) and displayed on the main page.

Each user can sign up, login and post images. Unregistered users will be redirected to the sign up page.

# How it works

## Login and signup
*As of right now, it's not secure. I will change this eventually. Current user is stored in an unencrypted cookie*

Users are stored in a JSON file, which stores the user's ID as an object's key. The key's values are stored in an array of objects, which are: the time of posting, image source and comment.

Login and signup either looks for a user (in the JSON file) or adds a user to this file.

## Add image and comment (will update with screenshot)

The user adds a image file with a comment, then a POST request is made to the server containing the image file/comment. Then the server creates an object with these three keys (images, comments and timestamp) and adds it to the JSON file at the key corresponding the currently logged in user. 

## Display images (will update with screenshot)

A GET request is made to `/images`. At this point, the server retrieves all images for the currently logged in user. 

# Work to be done

1. Move from storing users & images in JSON file to database. 
2. Make login and sign up more secure. (add password field)

# How to run locally
Start the server with `node igClone-server.js`. The server will start at port 3000. Navigate to http://localhost:3000 in the browser.

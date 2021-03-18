var admin = require("firebase-admin");

var serviceAccount = require("./service/prco303sl-3f1b2-firebase-adminsdk-22rup-379c5b2a7e.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://prco303sl-3f1b2.firebaseio.com",
});
const express = require("express");
const app = express();
app.use(express.static("."), express.json());
const APP_DOMAIN = "http://localhost:8100";
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", APP_DOMAIN);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
/**
 * Get all Government Portal Users (First 1000 Users from Firebase)
 */
app.get("/get-all-users", async (req, res) => {
  const listAllUsers = (nextPageToken) => {
    admin
      .auth()
      .listUsers(1000, nextPageToken)
      .then((listUsersResult) => {
        res.send(listUsersResult.users);
        if (listUsersResult.pageToken) {
          listAllUsers(listUsersResult.pageToken);
        }
      })
      .catch((error) => {
        // console.log("Error listing users:", error);
        res.send(error);
      });
  };
  listAllUsers();
});
/**
 * Get selected Government Portal User (Find by email Firebase)
 */
app.get("/get-user", async (req, res) => {
  var email = req.query.email || "";
  admin
    .auth()
    .getUserByEmail(email)
    .then((userRecord) => {
      res.send(userRecord.toJSON());
      // console.log(`Successfully fetched user data:  ${userRecord.toJSON()}`);
    })
    .catch((error) => {
      // console.log("Error fetching user data:", error);
    });
});
/**
 * Get selected Government Portal User (Find by email Firebase)
 */
app.get("/create-user", async (req, res) => {
  var email = req.query.email || "";
  var phone = req.query.mobile || "";
  var photoURL = req.query.downloadURL || "";
  var displayName = req.query.Full_Name || "";
  var password = req.query.password || "";
  admin
    .auth()
    .createUser({
      email: email,
      phoneNumber: phone,
      password: password,
      displayName: displayName,
      photoURL: photoURL,
      disabled: false,
    })
    .then((userRecord) => {
      res.send(JSON.stringify("Created User Successfully"));
    })
    .catch((error) => {
      console.log('Error creating new user:', error);
    });
});

/**
 * Delete selected Government Portal User (Find by uid Firebase)
 */
app.get("/delete-user", async (req, res) => {
  var uid = req.query.uid || "";
  admin
    .auth()
    .deleteUser(uid)
    .then(() => {
      res.send(JSON.stringify("Deleted Successfully"));
      // console.log("Successfully deleted user");
    })
    .catch((error) => {
      res.send(error);
      // console.log("Error deleting user:", error);
    });
});
/**
 * Disable selected Government Portal User (Find by uid Firebase)
 */
app.get("/disable-user", async (req, res) => {
  var uid = req.query.uid || "";
  admin
    .auth()
    .updateUser(uid, {
      disabled: true,
    })
    .then((userRecord) => {
      res.send(JSON.stringify("Disabled Successfully"));
      // console.log("Successfully updated user", userRecord.toJSON());
    })
    .catch((error) => {
      res.send(error);
      // console.log("Error updating user:", error);
    });
});
/**
 * Activate selected Government Portal User (Find by uid Firebase)
 */
app.get("/activate-user", async (req, res) => {
  var uid = req.query.uid || "";
  admin
    .auth()
    .updateUser(uid, {
      disabled: false,
    })
    .then((userRecord) => {
      res.send(JSON.stringify("Activated Successfully"));
      // console.log("Successfully updated user", userRecord.toJSON());
    })
    .catch((error) => {
      res.send(error);
      // console.log("Error updating user:", error);
    });
});
app.listen(4242, () => console.log("Running on port 4242"));

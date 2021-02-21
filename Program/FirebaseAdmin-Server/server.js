var admin = require("firebase-admin");

var serviceAccount = require("./prco303sl-3f1b2-firebase-adminsdk-22rup-c730f7de0d.json");

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

app.get("/get-all-users", async (req, res) => {
  const listAllUsers = (nextPageToken) => {
    admin
      .auth()
      .listUsers(100, nextPageToken)
      .then((listUsersResult) => {
        res.send(listUsersResult.users);
        if (listUsersResult.pageToken) {
          listAllUsers(listUsersResult.pageToken);
        }
      })
      .catch((error) => {
        console.log("Error listing users:", error);
        res.send(error);
      });
  };
  listAllUsers();
});

app.get("/delete-user", async (req, res) => {
  var uid = req.query.uid || "";
  admin
    .auth()
    .deleteUser(uid)
    .then(() => {
      res.send(JSON.stringify("Deleted Successfully"));
      console.log("Successfully deleted user");
    })
    .catch((error) => {
      res.send(error);
      console.log("Error deleting user:", error);
    });
});

app.get("/disable-user", async (req, res) => {
  var uid = req.query.uid || "";
  admin
    .auth()
    .updateUser(uid, {
      disabled: true,
    })
    .then((userRecord) => {
      res.send(JSON.stringify("Disabled Successfully"));
      console.log("Successfully updated user", userRecord.toJSON());
    })
    .catch((error) => {
      res.send(error);
      console.log("Error updating user:", error);
    });
});

app.get("/activate-user", async (req, res) => {
  var uid = req.query.uid || "";
  admin
    .auth()
    .updateUser(uid, {
      disabled: false,
    })
    .then((userRecord) => {
      res.send(JSON.stringify("Activated Successfully"));
      console.log("Successfully updated user", userRecord.toJSON());
    })
    .catch((error) => {
      res.send(error);
      console.log("Error updating user:", error);
    });
});
app.listen(4242, () => console.log("Running on port 4242"));

var admin = require("firebase-admin");

var serviceAccount = require("./service/prco303sl-3f1b2-firebase-adminsdk-22rup-379c5b2a7e.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://prco303sl-3f1b2.firebaseio.com",
});
const express = require("express");
const app = express();
// app.use(express.static("."), express.json());
var cors = require('cors')

app.use(cors())
// const APP_DOMAIN = "http://localhost:8100";
// const APP_DOMAIN = "http://localhost:4200";

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", APP_DOMAIN);
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });
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


// SYSTEM MAINTENANCE STATUS

app.get("/system_maintenance_status", async (req, res) => {
  var config = admin.remoteConfig();
  config.getTemplate()
      .then(function (template) {
        console.log('ETag from server: ' + template.etag);
        var templateStr = JSON.stringify(template.parameters['system_maintenance'].defaultValue['value']);
        console.log(templateStr)
        res.send(templateStr);
      })
      .catch(function (err) {
          res.send(JSON.stringify('Unable to get Status'));
        console.error(err);
      });

});
app.get("/web_system_maintenance_status", async (req, res) => {
  var config = admin.remoteConfig();
  config.getTemplate()
      .then(function (template) {
        console.log('ETag from server: ' + template.etag);
        var templateStr = JSON.stringify(template.parameters['web_system_maintenance'].defaultValue['value']);
        console.log(templateStr)
        res.send(templateStr);
      })
      .catch(function (err) {
          res.send(JSON.stringify('Unable to get Status'));
        console.error(err);
      });

});
app.get("/kiosk_system_maintenance_status", async (req, res) => {
  var config = admin.remoteConfig();
  config.getTemplate()
      .then(function (template) {
        console.log('ETag from server: ' + template.etag);
        var templateStr = JSON.stringify(template.parameters['kiosk_system_maintenance'].defaultValue['value']);
        console.log(templateStr)
        res.send(templateStr);
      })
      .catch(function (err) {
          res.send(JSON.stringify('Unable to get Status'));
        console.error(err);
      });

});
app.get("/office_system_maintenance_status", async (req, res) => {
  var config = admin.remoteConfig();
  config.getTemplate()
      .then(function (template) {
        console.log('ETag from server: ' + template.etag);
        var templateStr = JSON.stringify(template.parameters['office_system_maintenance'].defaultValue['value']);
        console.log(templateStr)
        res.send(templateStr);
      })
      .catch(function (err) {
          res.send(JSON.stringify('Unable to get Status'));
        console.error(err);
      });

});
app.get("/secretary_system_maintenance_status", async (req, res) => {
  var config = admin.remoteConfig();
  config.getTemplate()
      .then(function (template) {
        console.log('ETag from server: ' + template.etag);
        var templateStr = JSON.stringify(template.parameters['secretary_system_maintenance'].defaultValue['value']);
        console.log(templateStr)
        res.send(templateStr);
      })
      .catch(function (err) {
          res.send(JSON.stringify('Unable to get Status'));
        console.error(err);
      });

});

// SYSTEM MAINTENANCE MANAGER
/** Full System Maintenance */
app.get("/system_maintenance", async (req, res) => {
  var value = req.query.value || "";
  var config = admin.remoteConfig();
  config.getTemplate()
      .then(function (template) {
          console.log('ETag from server: ' + template.etag);
          var templateStr = JSON.stringify(template);
          template.parameters['system_maintenance'] = {
              defaultValue: {
                  value: value
              },
              description: 'For Locking System Access During System Maintenance - Full Scale Lock Down',
          };
          config.publishTemplate(template)
              .then(function (updatedTemplate) {
                  res.send(JSON.stringify('Updated Settings'));
                  console.log('ETag from server: ' + updatedTemplate.etag);
              })
              .catch(function (err) {
                  console.error('Unable to publish template.');
                  res.send(JSON.stringify('Unable to publish template.'));

                  console.error(err);
              });
      })
      .catch(function (err) {
          res.send(JSON.stringify('Unable to Update'));

          console.error(err);
      });
});
/** Web Maintenance */
app.get("/web_system_maintenance", async (req, res) => {
  var value = req.query.value || "";
  var config = admin.remoteConfig();
  config.getTemplate()
      .then(function (template) {
          console.log('ETag from server: ' + template.etag);
          var templateStr = JSON.stringify(template);
          template.parameters['web_system_maintenance'] = {
              defaultValue: {
                  value: value
              },
              description: 'For Locking Web System Access During System Maintenance - Web System Lock Down',
          };
          config.publishTemplate(template)
              .then(function (updatedTemplate) {
                  res.send(JSON.stringify('Updated Settings'));
                  console.log('ETag from server: ' + updatedTemplate.etag);
              })
              .catch(function (err) {
                  console.error('Unable to publish template.');
                  res.send(JSON.stringify('Unable to publish template.'));

                  console.error(err);
              });
      })
      .catch(function (err) {
          res.send(JSON.stringify('Unable to Update'));

          console.error(err);
      });
});
/** Kiosk Maintenance */
app.get("/kiosk_system_maintenance", async (req, res) => {
  var value = req.query.value || "";
  var config = admin.remoteConfig();
  config.getTemplate()
      .then(function (template) {
          console.log('ETag from server: ' + template.etag);
          var templateStr = JSON.stringify(template);
          template.parameters['kiosk_system_maintenance'] = {
              defaultValue: {
                  value: value
              },
              description: 'For Locking Kiosk System Access During System Maintenance - Kiosk System Lock Down',
          };
          config.publishTemplate(template)
              .then(function (updatedTemplate) {
                  res.send(JSON.stringify('Updated Settings'));
                  console.log('ETag from server: ' + updatedTemplate.etag);
              })
              .catch(function (err) {
                  console.error('Unable to publish template.');
                  res.send(JSON.stringify('Unable to publish template.'));

                  console.error(err);
              });
      })
      .catch(function (err) {
          res.send(JSON.stringify('Unable to Update'));

          console.error(err);
      });
});
/** Office Maintenance */
app.get("/office_system_maintenance", async (req, res) => {
  var value = req.query.value || "";
  var config = admin.remoteConfig();
  config.getTemplate()
      .then(function (template) {
          console.log('ETag from server: ' + template.etag);
          var templateStr = JSON.stringify(template);
          template.parameters['office_system_maintenance'] = {
              defaultValue: {
                  value: value
              },
              description: 'For Locking Office System Access During System Maintenance - Office System Lock Down',
          };
          config.publishTemplate(template)
              .then(function (updatedTemplate) {
                  res.send(JSON.stringify('Updated Settings'));
                  console.log('ETag from server: ' + updatedTemplate.etag);
              })
              .catch(function (err) {
                  console.error('Unable to publish template.');
                  res.send(JSON.stringify('Unable to publish template.'));

                  console.error(err);
              });
      })
      .catch(function (err) {
          res.send(JSON.stringify('Unable to Update'));

          console.error(err);
      });
});
/** Secretary Maintenance */
app.get("/secretary_system_maintenance", async (req, res) => {
  var value = req.query.value || "";
  var config = admin.remoteConfig();
  config.getTemplate()
      .then(function (template) {
          console.log('ETag from server: ' + template.etag);
          var templateStr = JSON.stringify(template);
          template.parameters['secretary_system_maintenance'] = {
              defaultValue: {
                  value: value
              },
              description: 'For Locking Secretary System Access During System Maintenance - Secretary System Lock Down',
          };
          config.publishTemplate(template)
              .then(function (updatedTemplate) {
                  res.send(JSON.stringify('Updated Settings'));
                  console.log('ETag from server: ' + updatedTemplate.etag);
              })
              .catch(function (err) {
                  console.error('Unable to publish template.');
                  res.send(JSON.stringify('Unable to publish template.'));

                  console.error(err);
              });
      })
      .catch(function (err) {
          res.send(JSON.stringify('Unable to Update'));

          console.error(err);
      });
});
app.listen(5000, () => console.log("Running on port 5000"));

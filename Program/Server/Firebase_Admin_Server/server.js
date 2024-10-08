/** DEPRECATED VERSION v1*/
// var admin = require("firebase-admin");

// var serviceAccount = require("./service/prco303sl-3f1b2-firebase-adminsdk-22rup-379c5b2a7e.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://prco303sl-3f1b2.firebaseio.com",
// });
// const express = require("express");
// const app = express();
// // app.use(express.static("."), express.json());
// var cors = require("cors");

// app.use(cors(), express.json());
// // const APP_DOMAIN = "http://localhost:8100";
// // const APP_DOMAIN = "http://localhost:4200";

// // app.use(function (req, res, next) {
// //   res.header("Access-Control-Allow-Origin", APP_DOMAIN);
// //   res.header(
// //     "Access-Control-Allow-Headers",
// //     "Origin, X-Requested-With, Content-Type, Accept"
// //   );
// //   next();
// // });
// /**
//  * Get all Government Portal Users (First 1000 Users from Firebase)
//  */
// app.get("/get-all-users", async (req, res) => {
//   const listAllUsers = (nextPageToken) => {
//     admin
//       .auth()
//       .listUsers(1000, nextPageToken)
//       .then((listUsersResult) => {
//         res.send(listUsersResult.users);
//         if (listUsersResult.pageToken) {
//           listAllUsers(listUsersResult.pageToken);
//         }
//       })
//       .catch((error) => {
//         // console.log("Error listing users:", error);
//         res.send(error);
//       });
//   };
//   listAllUsers();
// });
// /**
//  * Get selected Government Portal User (Find by email Firebase)
//  */
// app.get("/get-user", async (req, res) => {
//   var email = req.query.email || "";
//   admin
//     .auth()
//     .getUserByEmail(email)
//     .then((userRecord) => {
//       res.send(userRecord.toJSON());
//       // console.log(`Successfully fetched user data:  ${userRecord.toJSON()}`);
//     })
//     .catch((error) => {
//       // console.log("Error fetching user data:", error);
//     });
// });
// /**
//  * Create Officer or Secretary
//  */
// app.post("/create-user", async (req, res) => {
//   var email = req.body.email || "";
//   var photoURL = req.body.downloadURL || "";
//   var displayName = req.body.Full_Name || "";
//   var password = req.body.password || "";
//   admin
//     .auth()
//     .createUser({
//       email: email,
//       password: password,
//       displayName: displayName,
//       photoURL: photoURL,
//       disabled: false,
//     })
//     .then((userRecord) => {
//       res.send(JSON.stringify("Created User Successfully"));
//     })
//     .catch((error) => {
      
//     });
// });
// /**
//  * Create Kiosk
//  */
// app.post("/create-kiosk", async (req, res) => {
//   var email = req.body.email || "";
//   var password = req.body.password || "";
//   admin
//     .auth()
//     .createUser({
//       email: email,
//       password: password,
//       disabled: false,
//     })
//     .then((userRecord) => {
//       res.send(JSON.stringify("Created Kiosk Successfully"));
//     })
//     .catch((error) => {
      
//     });
// });

// /**
//  * Delete selected Government Portal User (Find by uid Firebase)
//  */
// app.get("/delete-user", async (req, res) => {
//   var uid = req.query.uid || "";
//   admin
//     .auth()
//     .deleteUser(uid)
//     .then(() => {
//       res.send(JSON.stringify("Deleted Successfully"));
//       // console.log("Successfully deleted user");
//     })
//     .catch((error) => {
//       res.send(error);
//       // console.log("Error deleting user:", error);
//     });
// });
// /**
//  * Disable selected Government Portal User (Find by uid Firebase)
//  */
// app.get("/disable-user", async (req, res) => {
//   var uid = req.query.uid || "";
//   admin
//     .auth()
//     .updateUser(uid, {
//       disabled: true,
//     })
//     .then((userRecord) => {
//       res.send(JSON.stringify("Disabled Successfully"));
//       // console.log("Successfully updated user", userRecord.toJSON());
//     })
//     .catch((error) => {
//       res.send(error);
//       // console.log("Error updating user:", error);
//     });
// });
// /**
//  * Activate selected Government Portal User (Find by uid Firebase)
//  */
// app.get("/activate-user", async (req, res) => {
//   var uid = req.query.uid || "";
//   admin
//     .auth()
//     .updateUser(uid, {
//       disabled: false,
//     })
//     .then((userRecord) => {
//       res.send(JSON.stringify("Activated Successfully"));
//       // console.log("Successfully updated user", userRecord.toJSON());
//     })
//     .catch((error) => {
//       res.send(error);
//       // console.log("Error updating user:", error);
//     });
// });

// // SYSTEM MAINTENANCE STATUS
// /**
//  * Getting Full System Maintenance Status
//  */
// app.get("/system_maintenance_status", async (req, res) => {
//   var config = admin.remoteConfig();
//   config
//     .getTemplate()
//     .then(function (template) {
      
//       var templateStr = JSON.stringify(
//         template.parameters["system_maintenance"].defaultValue["value"]
//       );
      
//       res.send(templateStr);
//     })
//     .catch(function (err) {
//       res.send(JSON.stringify("Unable to get Status"));
      
//     });
// });
// /**
//  * Getting Web System Maintenance Status
//  */
// app.get("/web_system_maintenance_status", async (req, res) => {
//   var config = admin.remoteConfig();
//   config
//     .getTemplate()
//     .then(function (template) {
      
//       var templateStr = JSON.stringify(
//         template.parameters["web_system_maintenance"].defaultValue["value"]
//       );
      
//       res.send(templateStr);
//     })
//     .catch(function (err) {
//       res.send(JSON.stringify("Unable to get Status"));
      
//     });
// });
// /**
//  * Getting Kiosk System Maintenance Status
//  */
// app.get("/kiosk_system_maintenance_status", async (req, res) => {
//   var config = admin.remoteConfig();
//   config
//     .getTemplate()
//     .then(function (template) {
      
//       var templateStr = JSON.stringify(
//         template.parameters["kiosk_system_maintenance"].defaultValue["value"]
//       );
      
//       res.send(templateStr);
//     })
//     .catch(function (err) {
//       res.send(JSON.stringify("Unable to get Status"));
      
//     });
// });
// /**
//  * Getting Office System Maintenance Status
//  */
// app.get("/office_system_maintenance_status", async (req, res) => {
//   var config = admin.remoteConfig();
//   config
//     .getTemplate()
//     .then(function (template) {
      
//       var templateStr = JSON.stringify(
//         template.parameters["office_system_maintenance"].defaultValue["value"]
//       );
      
//       res.send(templateStr);
//     })
//     .catch(function (err) {
//       res.send(JSON.stringify("Unable to get Status"));
      
//     });
// });
// /**
//  * Getting Secretary System Maintenance Status
//  */
// app.get("/secretary_system_maintenance_status", async (req, res) => {
//   var config = admin.remoteConfig();
//   config
//     .getTemplate()
//     .then(function (template) {
      
//       var templateStr = JSON.stringify(
//         template.parameters["secretary_system_maintenance"].defaultValue[
//           "value"
//         ]
//       );
      
//       res.send(templateStr);
//     })
//     .catch(function (err) {
//       res.send(JSON.stringify("Unable to get Status"));
      
//     });
// });

// // SYSTEM MAINTENANCE MANAGER
// /** Full System Maintenance Update*/
// app.get("/system_maintenance", async (req, res) => {
//   var value = req.query.value || "";
//   var config = admin.remoteConfig();
//   config
//     .getTemplate()
//     .then(function (template) {
      
//       var templateStr = JSON.stringify(template);
//       template.parameters["system_maintenance"] = {
//         defaultValue: {
//           value: value,
//         },
//         description:
//           "For Locking System Access During System Maintenance - Full Scale Lock Down",
//       };
//       config
//         .publishTemplate(template)
//         .then(function (updatedTemplate) {
//           res.send(JSON.stringify("Updated Settings"));
          
//         })
//         .catch(function (err) {
          
//           res.send(JSON.stringify("Unable to publish template."));

          
//         });
//     })
//     .catch(function (err) {
//       res.send(JSON.stringify("Unable to Update"));

      
//     });
// });
// /** Web Maintenance Update*/
// app.get("/web_system_maintenance", async (req, res) => {
//   var value = req.query.value || "";
//   var config = admin.remoteConfig();
//   config
//     .getTemplate()
//     .then(function (template) {
      
//       var templateStr = JSON.stringify(template);
//       template.parameters["web_system_maintenance"] = {
//         defaultValue: {
//           value: value,
//         },
//         description:
//           "For Locking Web System Access During System Maintenance - Web System Lock Down",
//       };
//       config
//         .publishTemplate(template)
//         .then(function (updatedTemplate) {
//           res.send(JSON.stringify("Updated Settings"));
          
//         })
//         .catch(function (err) {
          
//           res.send(JSON.stringify("Unable to publish template."));

          
//         });
//     })
//     .catch(function (err) {
//       res.send(JSON.stringify("Unable to Update"));

      
//     });
// });
// /** Kiosk Maintenance Update*/
// app.get("/kiosk_system_maintenance", async (req, res) => {
//   var value = req.query.value || "";
//   var config = admin.remoteConfig();
//   config
//     .getTemplate()
//     .then(function (template) {
      
//       var templateStr = JSON.stringify(template);
//       template.parameters["kiosk_system_maintenance"] = {
//         defaultValue: {
//           value: value,
//         },
//         description:
//           "For Locking Kiosk System Access During System Maintenance - Kiosk System Lock Down",
//       };
//       config
//         .publishTemplate(template)
//         .then(function (updatedTemplate) {
//           res.send(JSON.stringify("Updated Settings"));
          
//         })
//         .catch(function (err) {
          
//           res.send(JSON.stringify("Unable to publish template."));

          
//         });
//     })
//     .catch(function (err) {
//       res.send(JSON.stringify("Unable to Update"));

      
//     });
// });
// /** Office Maintenance Update*/
// app.get("/office_system_maintenance", async (req, res) => {
//   var value = req.query.value || "";
//   var config = admin.remoteConfig();
//   config
//     .getTemplate()
//     .then(function (template) {
      
//       var templateStr = JSON.stringify(template);
//       template.parameters["office_system_maintenance"] = {
//         defaultValue: {
//           value: value,
//         },
//         description:
//           "For Locking Office System Access During System Maintenance - Office System Lock Down",
//       };
//       config
//         .publishTemplate(template)
//         .then(function (updatedTemplate) {
//           res.send(JSON.stringify("Updated Settings"));
          
//         })
//         .catch(function (err) {
          
//           res.send(JSON.stringify("Unable to publish template."));

          
//         });
//     })
//     .catch(function (err) {
//       res.send(JSON.stringify("Unable to Update"));

      
//     });
// });
// /** Secretary Maintenance Update*/
// app.get("/secretary_system_maintenance", async (req, res) => {
//   var value = req.query.value || "";
//   var config = admin.remoteConfig();
//   config
//     .getTemplate()
//     .then(function (template) {
      
//       var templateStr = JSON.stringify(template);
//       template.parameters["secretary_system_maintenance"] = {
//         defaultValue: {
//           value: value,
//         },
//         description:
//           "For Locking Secretary System Access During System Maintenance - Secretary System Lock Down",
//       };
//       config
//         .publishTemplate(template)
//         .then(function (updatedTemplate) {
//           res.send(JSON.stringify("Updated Settings"));
          
//         })
//         .catch(function (err) {
          
//           res.send(JSON.stringify("Unable to publish template."));

          
//         });
//     })
//     .catch(function (err) {
//       res.send(JSON.stringify("Unable to Update"));

      
//     });
// });
// // app.listen(5000, () => console.log("Running on port 5000"));
// app.listen(5000);

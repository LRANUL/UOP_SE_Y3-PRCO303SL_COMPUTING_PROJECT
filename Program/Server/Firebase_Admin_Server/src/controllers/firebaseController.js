let serviceAccount = require("../../service/prco303sl-3f1b2-firebase-adminsdk-22rup-379c5b2a7e.json");
let admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://prco303sl-3f1b2.firebaseio.com",
});

/**
 * Get all Government Portal Users (First 1000 Users from Firebase)
 */
export const getUsers = async (req, res) => {
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
};

/**
 * Get selected Government Portal User (Find by email Firebase)
 */
export const findUserByEmail = async (req, res) => {
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
};

/**
 * Create Officer or Secretary
 */
export const createOfficerSecretary = async (req, res) => {
  var email = req.body.email || "";
  var photoURL = req.body.downloadURL || "";
  var displayName = req.body.Full_Name || "";
  var password = req.body.password || "";
  admin
    .auth()
    .createUser({
      email: email,
      password: password,
      displayName: displayName,
      photoURL: photoURL,
      disabled: false,
    })
    .then((userRecord) => {
      res.send(JSON.stringify("Created User Successfully"));
    })
    .catch((error) => {});
};

/**
 * Create Kiosk
 */
export const createKiosk = async (req, res) => {
  var email = req.body.email || "";
  var password = req.body.password || "";
  admin
    .auth()
    .createUser({
      email: email,
      password: password,
      disabled: false,
    })
    .then((userRecord) => {
      res.send(JSON.stringify("Created Kiosk Successfully"));
    })
    .catch((error) => {});
};

/**
 * Delete selected Government Portal User (Find by uid Firebase)
 */
export const deleteUser = async (req, res) => {
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
};

/**
 * Disable selected Government Portal User (Find by uid Firebase)
 */
export const disableUser = async (req, res) => {
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
};

/**
 * Activate selected Government Portal User (Find by uid Firebase)
 */
export const activateuser = async (req, res) => {
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
};

// SYSTEM MAINTENANCE STATUS
/**
 * Getting Full System Maintenance Status
 */
export const getFullSystemMaintenance = async (req, res) => {
  var config = admin.remoteConfig();
  config
    .getTemplate()
    .then(function (template) {
      var templateStr = JSON.stringify(
        template.parameters["system_maintenance"].defaultValue["value"]
      );

      res.send(templateStr);
    })
    .catch(function (err) {
      res.send(JSON.stringify("Unable to get Status"));
    });
};

/**
 * Getting Web System Maintenance Status
 */
export const getWebSystemMaintenance = async (req, res) => {
  var config = admin.remoteConfig();
  config
    .getTemplate()
    .then(function (template) {
      var templateStr = JSON.stringify(
        template.parameters["web_system_maintenance"].defaultValue["value"]
      );

      res.send(templateStr);
    })
    .catch(function (err) {
      res.send(JSON.stringify("Unable to get Status"));
    });
};

/**
 * Getting Kiosk System Maintenance Status
 */
export const getKioskSystemMaintenance = async (req, res) => {
  var config = admin.remoteConfig();
  config
    .getTemplate()
    .then(function (template) {
      var templateStr = JSON.stringify(
        template.parameters["kiosk_system_maintenance"].defaultValue["value"]
      );

      res.send(templateStr);
    })
    .catch(function (err) {
      res.send(JSON.stringify("Unable to get Status"));
    });
};

/**
 * Getting Office System Maintenance Status
 */
export const getOfficeSystemMaintenance = async (req, res) => {
  var config = admin.remoteConfig();
  config
    .getTemplate()
    .then(function (template) {
      var templateStr = JSON.stringify(
        template.parameters["office_system_maintenance"].defaultValue["value"]
      );

      res.send(templateStr);
    })
    .catch(function (err) {
      res.send(JSON.stringify("Unable to get Status"));
    });
};

/**
 * Getting Secretary System Maintenance Status
 */
export const getSecretarySystemMaintenance = async (req, res) => {
  var config = admin.remoteConfig();
  config
    .getTemplate()
    .then(function (template) {
      var templateStr = JSON.stringify(
        template.parameters["secretary_system_maintenance"].defaultValue[
          "value"
        ]
      );

      res.send(templateStr);
    })
    .catch(function (err) {
      res.send(JSON.stringify("Unable to get Status"));
    });
};

// SYSTEM MAINTENANCE MANAGER
/** Full System Maintenance Update*/
export const setFullSystemMaintenance = async (req, res) => {
  var value = req.query.value || "";
  var config = admin.remoteConfig();
  config
    .getTemplate()
    .then(function (template) {
      var templateStr = JSON.stringify(template);
      template.parameters["system_maintenance"] = {
        defaultValue: {
          value: value,
        },
        description:
          "For Locking System Access During System Maintenance - Full Scale Lock Down",
      };
      config
        .publishTemplate(template)
        .then(function (updatedTemplate) {
          res.send(JSON.stringify("Updated Settings"));
        })
        .catch(function (err) {
          res.send(JSON.stringify("Unable to publish template."));
        });
    })
    .catch(function (err) {
      res.send(JSON.stringify("Unable to Update"));
    });
};
/** Web Maintenance Update*/
export const setWebSystemMaintenance = async (req, res) => {
  var value = req.query.value || "";
  var config = admin.remoteConfig();
  config
    .getTemplate()
    .then(function (template) {
      var templateStr = JSON.stringify(template);
      template.parameters["web_system_maintenance"] = {
        defaultValue: {
          value: value,
        },
        description:
          "For Locking Web System Access During System Maintenance - Web System Lock Down",
      };
      config
        .publishTemplate(template)
        .then(function (updatedTemplate) {
          res.send(JSON.stringify("Updated Settings"));
        })
        .catch(function (err) {
          res.send(JSON.stringify("Unable to publish template."));
        });
    })
    .catch(function (err) {
      res.send(JSON.stringify("Unable to Update"));
    });
};

/** Kiosk Maintenance Update*/
export const setKioskSystemMaintenance = async (req, res) => {
  var value = req.query.value || "";
  var config = admin.remoteConfig();
  config
    .getTemplate()
    .then(function (template) {
      var templateStr = JSON.stringify(template);
      template.parameters["kiosk_system_maintenance"] = {
        defaultValue: {
          value: value,
        },
        description:
          "For Locking Kiosk System Access During System Maintenance - Kiosk System Lock Down",
      };
      config
        .publishTemplate(template)
        .then(function (updatedTemplate) {
          res.send(JSON.stringify("Updated Settings"));
        })
        .catch(function (err) {
          res.send(JSON.stringify("Unable to publish template."));
        });
    })
    .catch(function (err) {
      res.send(JSON.stringify("Unable to Update"));
    });
};
/** Office Maintenance Update*/
export const setOfficeSystemMaintenance = async (req, res) => {
  var value = req.query.value || "";
  var config = admin.remoteConfig();
  config
    .getTemplate()
    .then(function (template) {
      var templateStr = JSON.stringify(template);
      template.parameters["office_system_maintenance"] = {
        defaultValue: {
          value: value,
        },
        description:
          "For Locking Office System Access During System Maintenance - Office System Lock Down",
      };
      config
        .publishTemplate(template)
        .then(function (updatedTemplate) {
          res.send(JSON.stringify("Updated Settings"));
        })
        .catch(function (err) {
          res.send(JSON.stringify("Unable to publish template."));
        });
    })
    .catch(function (err) {
      res.send(JSON.stringify("Unable to Update"));
    });
};
/** Secretary Maintenance Update*/
export const setSecretarySystemMaintenance = async (req, res) => {
  var value = req.query.value || "";
  var config = admin.remoteConfig();
  config
    .getTemplate()
    .then(function (template) {
      var templateStr = JSON.stringify(template);
      template.parameters["secretary_system_maintenance"] = {
        defaultValue: {
          value: value,
        },
        description:
          "For Locking Secretary System Access During System Maintenance - Secretary System Lock Down",
      };
      config
        .publishTemplate(template)
        .then(function (updatedTemplate) {
          res.send(JSON.stringify("Updated Settings"));
        })
        .catch(function (err) {
          res.send(JSON.stringify("Unable to publish template."));
        });
    })
    .catch(function (err) {
      res.send(JSON.stringify("Unable to Update"));
    });
};

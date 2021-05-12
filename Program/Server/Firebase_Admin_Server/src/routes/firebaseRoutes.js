import {
  activateuser,
  createKiosk,
  createOfficerSecretary,
  deleteUser,
  disableUser,
  findUserByEmail,
  getUsers,
  getFullSystemMaintenance,
  getKioskSystemMaintenance,
  getOfficeSystemMaintenance,
  getSecretarySystemMaintenance,
  getWebSystemMaintenance,
  setFullSystemMaintenance,
  setKioskSystemMaintenance,
  setOfficeSystemMaintenance,
  setSecretarySystemMaintenance,
  setWebSystemMaintenance,
} from "../controllers/firebaseController";

const routes = (app) => {
  /** User Manage Routes */

  /**
   * Activate selected Government Portal User (Find by uid Firebase)
   */
  app.route("/activate-user").get(activateuser);
  /**
   * Create Kiosk account
   */
  app.route("/create-kiosk").get(createKiosk);
  /**
   * Create Officer or Secretary account
   */
  app.route("/create-user").get(createOfficerSecretary);
  /**
   * Disable selected Government Portal User (Find by uid Firebase)
   */
  app.route("/disable-user").get(disableUser);
  /**
   * Delete selected Government Portal User (Find by uid Firebase)
   */
  app.route("/delete-use").get(deleteUser);
  /**
   * Get selected Government Portal User (Find by email Firebase)
   */
  app.route("/get-user").get(findUserByEmail);
  /**
   * Get all Government Portal Users (First 1000 Users from Firebase)
   */
  app.route("/get-all-users").get(getUsers);
 
  // Check Maintenance Status
 
  /**
   * Getting Full System Maintenance Status
   */
  app.route("/system_maintenance_status").get(getFullSystemMaintenance);
  /**
   * Getting Office System Maintenance Status
   */
  app.route("/kiosk_system_maintenance_status").get(getKioskSystemMaintenance);
  /**
   * Getting Office System Maintenance Status
   */
  app
    .route("/office_system_maintenance_status")
    .get(getOfficeSystemMaintenance);
  /**
   * Getting Secretary System Maintenance Status
   */
  app
    .route("/secretary_system_maintenance_status")
    .get(getSecretarySystemMaintenance);
  /**
   * Getting Web System Maintenance Status
   */
  app.route("/web_system_maintenance_status").get(getWebSystemMaintenance);
  
  // Update Maintenance Status

  /** Full System Maintenance Update*/
  app.route("/system_maintenance").get(setFullSystemMaintenance);
  /** Kiosk Maintenance Update*/
  app.route("/kiosk_system_maintenance").get(setKioskSystemMaintenance);
  /** Office Maintenance Update*/
  app.route("/office_system_maintenance").get(setOfficeSystemMaintenance);
  /** Secretary Maintenance Update*/
  app.route("/secretary_system_maintenance").get(setSecretarySystemMaintenance);
  /** Web Maintenance Update*/
  app.route("/web_system_maintenance").get(setWebSystemMaintenance);
};

export default routes;

const db = require("../Models");
const Roles = db.roles;
const Permissions = db.permissions;
const RolesPermissions = db.roles_permissions;

exports.editRole = (req, res) => {
  // Validate request
  if (!req.body.role_id || !req.body.permission_id) {
      res.status(400).send({
          message: "Please provide role_id, and permission_id"
      });
      return;
  }

  // Before assigning, let's ensure that the provided IDs actually exist in their respective tables.
  Promise.all([
      Roles.findByPk(req.body.role_id),
      Permissions.findByPk(req.body.permission_id)
  ])
  .then(([role, permission]) => {
    
      if (!role) {
          res.status(400).send({
              message: "Role not found!"
          });
          return;
      }

      if (!permission) {
          res.status(400).send({
              message: "Permission not found!"
          });
          return;
      }

      // All entities exist, let's link them
      let linkData = {
         
          role_id: role.id,
          permission_id: permission.id,
      };

      RolesPermissions.create(linkData)
          .then(() => {
              res.send({ message: "Permissions assigned successfully!" });
          })
          .catch(err => {
              res.status(500).send({
                  message: err.message || "Some error occurred while linking the entities."
              });
          });
  })
  .catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while checking the entities."
      });
  });
};
'use strict';
module.exports = (sequelize, DataTypes) => {
  const RolePermission = sequelize.define('RolePermission', {
    RoleId: DataTypes.INTEGER,
    PermissionId: DataTypes.INTEGER,
  }, {});
  return RolePermission;
};

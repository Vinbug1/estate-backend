'use strict';

const rolesAndPermissions = {
  roles: [
    {
      name: "admin",
      permissions: [
        "create_user",
        "read_user",
        "update_user",
        "delete_user",
        "count_user",
        "verify_user_pin",
        "forget_user_password",
        "reset_user_password"
      ]
    },
    {
      name: "manager",
      permissions: [
        "create_user",
        "read_user",
        "update_user",
        "count_user",
        "forget_user_password",
        "reset_user_password"
      ]
    },
    {
      name: "employee",
      permissions: [
        "create_user",
        "read_user",
        "verify_user_pin",
        "forget_user_password",
        "reset_user_password"
      ]
    }
  ]
};

module.exports = {
  async up(queryInterface, Sequelize) {
    const Role = queryInterface.sequelize.define('Role', {
      name: Sequelize.STRING
    }, { timestamps: false });

    const Permission = queryInterface.sequelize.define('Permission', {
      name: Sequelize.STRING
    }, { timestamps: false });

    const RolePermissions = queryInterface.sequelize.define('RolePermissions', {}, { timestamps: false });

    const User = queryInterface.sequelize.define('User', {
      fullName: Sequelize.STRING,
      email: Sequelize.STRING,
      password: Sequelize.STRING,
      roleId: Sequelize.INTEGER
    }, { timestamps: false });

    await queryInterface.sequelize.transaction(async (transaction) => {
      const roleInstances = {};

      for (const role of rolesAndPermissions.roles) {
        const [roleInstance, created] = await Role.findOrCreate({
          where: { name: role.name },
          defaults: { name: role.name },
          transaction,
        });

        roleInstances[role.name] = roleInstance;

        for (const permissionName of role.permissions) {
          const [permissionInstance, permCreated] = await Permission.findOrCreate({
            where: { name: permissionName },
            defaults: { name: permissionName },
            transaction,
          });

          await RolePermissions.findOrCreate({
            where: { roleId: roleInstance.id, permissionId: permissionInstance.id },
            defaults: { roleId: roleInstance.id, permissionId: permissionInstance.id },
            transaction,
          });
        }
      }

      // Example user creation with roles, you can add more users here.
      await User.create({
        fullName: 'Admin User',
        email: 'admin@example.com',
        password: 'hashedpassword',
        roleId: roleInstances['admin'].id,
      }, { transaction });

      await User.create({
        fullName: 'Manager User',
        email: 'manager@example.com',
        password: 'hashedpassword',
        roleId: roleInstances['manager'].id,
      }, { transaction });

      await User.create({
        fullName: 'Employee User',
        email: 'employee@example.com',
        password: 'hashedpassword',
        roleId: roleInstances['employee'].id,
      }, { transaction });
    });
  },

  async down(queryInterface, Sequelize) {
    const Role = queryInterface.sequelize.define('Role', {
      name: Sequelize.STRING
    }, { timestamps: false });

    const Permission = queryInterface.sequelize.define('Permission', {
      name: Sequelize.STRING
    }, { timestamps: false });

    const RolePermissions = queryInterface.sequelize.define('RolePermissions', {}, { timestamps: false });

    await queryInterface.sequelize.transaction(async (transaction) => {
      for (const role of rolesAndPermissions.roles) {
        const roleInstance = await Role.findOne({
          where: { name: role.name },
          transaction,
        });

        if (roleInstance) {
          for (const permissionName of role.permissions) {
            const permissionInstance = await Permission.findOne({
              where: { name: permissionName },
              transaction,
            });

            if (permissionInstance) {
              await RolePermissions.destroy({
                where: { roleId: roleInstance.id, permissionId: permissionInstance.id },
                transaction,
              });
            }
          }
        }

        await Role.destroy({ where: { name: role.name }, transaction });
      }

      for (const role of rolesAndPermissions.roles) {
        for (const permissionName of role.permissions) {
          await Permission.destroy({
            where: { name: permissionName },
            transaction,
          });
        }
      }
    });
  }
};

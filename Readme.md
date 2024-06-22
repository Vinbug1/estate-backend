# Starter template

This will help a developer start from 100 instead of 0

## Features

- [ ] Users
- [ ] Authentication 
- [ ] Verification Code
- [ ] Authorization
- [ ] Database
  - [] Postgres
  - [ ] MongoDB
- [ ] Docker
- [ ] Redis
- [ ] ORM
  - [ ] Prisma
  - [ ] Sequelize
- [ ] Email
- [ ] SMS
- [ ] JWT
- [ ] Logging
  - [ ] Morgan
- [ ] Tests

## Installation

Use the package manager [pip](https://pip.pypa.io/en/stable/) to install foobar.

```bash
npm install
```

## Usage

```js

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)

# To generate a migration file using Sequelize CLI based on your models, you can follow these steps:

1: Install Sequelize CLI
First, make sure you have Sequelize CLI installed. If you dont have it installed, you can install it globally using this command: npm install -g sequelize-cli

 2: Initialize Sequelize: If you have not already initialized Sequelize in your project, run this command first: npx sequelize-cli init

 3: Generate Migration File
You can generate a migration file for the User model using the following Sequelize CLI command: npx sequelize-cli migration:generate --name create-model-name.

4: Create a Seed Script
Create a seed script to insert roles and associate users with roles:  npx sequelize-cli seed:generate --name name-of-the-file

5. Run the Migration and Seed use the command below: 
 a. migration command: npx sequelize-cli db:migrate
 b. seeding command: npx sequelize-cli db:seed:all





const { expressjwt: jwt } = require("express-jwt");
const dotenv = require('dotenv');
dotenv.config();

function authJwt() {
  const { SECRET, API_URL } = process.env;

  if (!SECRET || !API_URL) {
    throw new Error('SECRET or API_URL is missing in the environment variables.');
  }

  const jwtMiddleware = jwt({
    secret: SECRET,
    algorithms: ['HS256'],
    isRevoked: isRevoked
  });

  const unlessPaths = [
     { url: /\/api\/v1\/users(.*)/, methods: ['GET', 'OPTIONS', 'POST'] }
    `${API_URL}/users/login`,
    `${API_URL}/users/register`
  ];
 
  return jwtMiddleware.unless({ path: unlessPaths });
}

async function isRevoked(req, payload, done) {
  if (!payload.isAdmin) {
    done(null, true);
  } else {
    done();
  }
}

module.exports = authJwt;

























// const { expressjwt: jwt } = require("express-jwt");
// const dotenv = require('dotenv');
// dotenv.config();

// function authJwt() {
//   const { SECRET, API_URL } = process.env;

//   if (!SECRET || !API_URL) {
//     throw new Error('SECRET or API_URL is missing in the environment variables.');
//   }

//   const jwtMiddleware = jwt({
//     secret: SECRET,
//     algorithms: ['HS256'],
//     isRevoked: isRevoked
//   });

//   const unlessPaths = [
//     // { url: /\/api\/v1\/cases(.*)/, methods: ['GET', 'OPTIONS'] },
//      { url: /\/api\/v1\/users(.*)/, methods: ['GET', 'OPTIONS', 'POST'] },
//     `${API_URL}/users/signin`,
//     `${API_URL}/users/signup`,
//     `${API_URL}/users/verify-pin`,
//     `${API_URL}/users/forgot-password`,
//   ];

//   return jwtMiddleware.unless({ path: unlessPaths });
// }

// async function isRevoked(req, payload, done) {
//   if (!payload.isAdmin) {
//     done(null, true);
//   } else {
//     done();
//   }
// }

// module.exports = authJwt;

// config.js

const config = {
    app: {
      port: 2300,
      environment: "development",
    },
    database: {
      host: "localhost",
      user: "root",
      password: "example",
      name: "blogAppDB",
    },
    jwt_secret_code: "ayokunnu",
  };
  
  module.exports = config; // Export the config object
  
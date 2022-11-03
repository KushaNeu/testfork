const env = process.env;
const config = {
  database: {
    host: env.DB_HOST || 'localhost',
    user: env.DB_USER || 'root',
    password: env.DB_PASSWORD || 'Elroy@17665',
    database: env.DB_NAME || 'freshDB',
    port: 3306
  }
};
  
module.exports = config;

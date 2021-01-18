module.exports = {
  development: {
      client: 'mysql',
      connection: {
      host: 'localhost',
      user: 'root', // replace with your mysql username
      password: 'redab_123', // replace with your mysql password
      database: 'vatrintask_db',
      port:3306
    },
    debug: true
  }
};
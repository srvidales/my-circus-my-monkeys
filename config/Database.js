const mysql = require('mysql2');
require('dotenv').config();

class Database {

    static connection = null;

    static async createConnection() {
        Database.connection = mysql.createConnection(
            {
                host: 'localhost',
                // MySQL username,
                user: process.env.DB_USER,
                // TODO: Add MySQL password here
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
            },
            console.log(`Connected to the movies_db database.`)
        );
    }

    static closeConnection() {
        Database.connection.end((error) => {
            if (error) {
                console.error('Error closing MySQL connection:', error);
                return;
            }
            console.log('MySQL connection closed.');
        });
    }

}

module.exports = Database;

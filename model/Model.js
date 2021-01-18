var mysql = require('mysql');
require('dotenv').config()

class Model {
    constructor() {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });
    }

    query(sql, values) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection(function (err, connection) {
                if (err) {
                    reject(err)
                } else {
                    connection.query(sql, values, (err, rows) => {

                        if (err) {
                            connection.release()
                            reject(err)
                        } else {
                            connection.release()
                            resolve(rows)
                        }
                        
                    })
                }
            })
        })
    }


}

module.exports = Model
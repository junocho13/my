const mysql = require('mysql');
const info = require('../lib/private_info');
const connectionPool = mysql.createPool(info.mysql);

module.exports = function getConnection(callback){
    // connectionPool.on('enqueue', function () {
    //     console.log('Waiting for available connection slot');
    //   });
    // connectionPool.on('acquire', function (connection) {
    //     console.log('Connection %d acquired', connection.threadId);
    //   });
    // connectionPool.on('release', function (connection) {
    //     console.log('Connection %d released', connection.threadId);
    //   });
    connectionPool.getConnection(function(err,conn){
        if(!err){
            callback(conn);  
        }
    });
};


/*
const dbConnection = require('../lib/auth_mysql');


dbConnection((db) => {
        db.query(`SELECT * FROM AUTH WHERE id='${request.params.id}'`, function (error, results, fields) {
            if (error) console.log(error);
            if(results.length == 0){
                ok = true;
            }
            else{
                ok = false;
            }
            response.send(ok);
        });
        db.release();
    })


*/
const express = require('express');
const router = express.Router();
const dbConnection = require('../../lib/auth_mysql');



router.get('/:id', function(request,response){

    //console.log(request.params.id);
    let ok = false;
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
    
    
});

module.exports = router;
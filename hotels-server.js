var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "trip_hotels"
});


con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    /*con.query("CREATE DATABASE trip_hotels", function (err, result) {
        if (err) throw err;
        console.log("Database created");
    });*/

    var sql = "CREATE TABLE urls (url VARCHAR(512))";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table created");
    });
});


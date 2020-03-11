const express= require ("express");
const path= require ("path");
const sqlite3 = require ("sqlite3");
const bodyParser = require('body-parser');
app= express();
db= new sqlite3.Database("./libri.db",function(){
    app.listen(80);
});
app.set('views',path.join(__dirname,"views"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/',(req,res)=>{
    sql='select * from Autori';
    db.all(sql,(err,rows)=>{
        autori=rows;
        sql='select * from Libri';
        db.all(sql,(err,rows)=>{
            libri=rows
            res.render('index',{autori,libri})
        });
    });
});
app.use((req,res)=>{
    res.status(404);
    res.sendFile(path.join(__dirname,'public','index.html'));
});

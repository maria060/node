const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');

app = express();
const port = 8080;

app.set('views',path.join(__dirname,"views"));
app.set('view engine', 'ejs');
app.use('/css', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const db = new sqlite3.Database('./libri.db',()=>{
    app.listen(port);
    console.log(`Server running on http://localhost:${port}`);
    console.log('database open')
});

app.get('/',(req,res)=>{
    let sql = "SELECT libri.id, libri.titolo, group_concat(autori.cognome) as autori FROM libri INNER JOIN autori_libri ON libri.id=autori_libri.id_libro INNER JOIN autori ON autori_libri.id_autore=autori.id GROUP BY libri.id ORDER BY libri.titolo"
    db.all(sql,(err,rows)=>{
        if (err) res.send('è esploso');
        else res.render('index',{rows});
    });
});

app.use((req,res)=>{
    res.status(404);
    res.sendFile(path.join(__dirname,'public','404.html'));
});
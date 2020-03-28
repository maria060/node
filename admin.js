const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');    
const sqlite3 = require('sqlite3');

app = express();

app.set('views',path.join(__dirname,"views"));
app.set('view engine', 'ejs');
app.use('/css', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const db = new sqlite3.Database('./libri.db',()=>{
    app.listen(8081);
    console.log('Server running on http://localhost:8081');
    console.log('database open')
});
app.get('/',(req,res)=>{
    let sql = "SELECT * FROM Autori";
    db.all(sql,(err,rows)=>{
        autori=rows;
        if (err) res.send('errore 1');
        else {
            sql = "SELECT * FROM Libri";
            db.all(sql,(err,rows)=>{
                libri=rows;
                if (err) res.send('errore 2');
                else {
                    sql = "SELECT * FROM autori_libri";
                    db.all(sql,(err,rows)=>{
                        relazioni=rows
                        if (err) res.send('errore 3');
                        else res.render('modifica',{autori,libri,relazioni});
                    });
                }
            });
        }
    });
});
app.get('/modifica/autori/:id',(req,res)=>{
    sqlA=`select * from Autori where id_autore = ${req.params.id}`;
    db.each(sqlA,(err,aRow)=>{
        res.render('file',{autore:aRow});
    });
});
app.post('/modautore',(req,res)=>{
    const id=parseInt(req.body.id_autore);
    sql=`UPDATE Autori SET nome='${req.body.nome}',cognome='${req.body.cognome}' WHERE Autori.ID_autore = ${id}`;
    db.run(sql)
    res.redirect("/");
});

app.post('/addautore',(req,res)=>{
    const id=parseInt(req.body.id_autore);
    let sql = `INSERT INTO Autori(id_autore,nome,cognome) VALUES(${id},'${req.body.nome}','${req.body.cognome}')`;
    db.run(sql);
    res.redirect('/');
});

app.post('/delautore',(req,res)=>{
    const id=parseInt(req.body.id_autore);
    let sql = `DELETE FROM Autori WHERE Autori.ID_autore=${id}`;
    db.run(sql)
    res.redirect('/');
});
app.get('/modifica/libri/:id',(req,res)=>{
    sql=`select * from Libri where ID_libro = ${req.params.id}`;
    db.each(sql,(err,row)=>{
        sqlA='select * from Autori';
        db.all(sqlA,(err,aRows)=>{
            res.render('file2',{libro:row,aRows});
        });
    });
});

app.post('/modlibro',(req,res)=>{
    const id=parseInt(req.body.id_libro);
    const id_autore=parseInt(req.body.autore);
    sql=`UPDATE Libri SET titolo='${req.body.titolo}', autore=${id_autore} WHERE Libri.ID_libro = ${id}`;
    db.run(sql)
    res.redirect("/");
});

app.post('/addlibro',(req,res)=>{
    const id_autore=parseInt(req.body.autore);
    const id=parseInt(req.body.id_libro);
    let sql = `INSERT INTO Libri(id_libro,titolo,autore) VALUES(${id},'${req.body.titolo}','${id_autore}')`;
    db.run(sql);
    res.redirect('/');
});

app.post('/dellibro',(req,res)=>{
    const id=parseInt(req.body.id_libro);
    let sql = `DELETE FROM Libri WHERE Libri.ID_libro=${id}`;
    db.run(sql)
    res.redirect('/');
});
app.get('/modifica/relazione/:id',(req,res)=>{
    sql=`select * from autori_libri where id = ${req.params.id}`;
    db.each(sql,(err,row)=>{
        res.render('modRelazione',{relazione:row});
    });
});

app.post('/modrelazione',(req,res)=>{
    const id=parseInt(req.body.id);
    sql=`UPDATE autori_libri SET id_autore='${req.body.id_autore}',id_libro='${req.body.id_libro}' WHERE autori_libri.id = ${id}`;
    db.run(sql);
    res.redirect("/");
});

app.post('/delrelazione',(req,res)=>{
    const id=parseInt(req.body.id);
    let sql = `DELETE FROM autori_libri WHERE autori_libri.id=${id}`;
    db.run(sql);;
    res.redirect('/');
});
app.post("/addrelazione", function(req, res) {
    sql="insert into autori_libri (id_autore, id_libro) values('"+req.body.id_autore+"','"+req.body.id_libro+"')";
    db.run(sql);
    res.redirect('/');
});
app.use((req,res)=>{
    res.status(404);
    res.sendFile(path.join(__dirname,'public','index.html'));
});
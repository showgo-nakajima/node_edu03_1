const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();
const port = 3000;
const mysql = require('mysql2');
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// expressdb MySQL接続情報
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootroot',
  database: 'expressdb'
});

// cssファイルの取得
app.use(express.static('assets'));

// // mysqlからデータを持ってくる
// app.get('/', (req, res) => {
//   const sql = "SELECT * FROM clients";

//   con.query(sql, function (err, result, fields) {
//     if (err) throw err;
//     res.render('index', {
//       users: result
//     });
//   });
// });

// // mysqlからデータを持ってくる
// app.get('/', (req, res) => {
//   const sql = "SELECT * FROM client_detail";

//   con.query(sql, function (err, result, fields) {
//     if (err) throw err;
//     res.render('index', {
//       users: result
//     });
//   });
// });

// ユーザー一覧を表示するエンドポイント
app.get('/', (req, res) => {
  const sql = "SELECT * FROM clients";

  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render('index', {
      users: result
    });
  });
});

// 個別のユーザー情報を表示するエンドポイント
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  const sql = `SELECT * FROM client_detail WHERE id = ${userId}`;

  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render('user', {
      user: result[0]
    });
  });
});



app.post('/', (req, res) => {
  const sql = "INSERT INTO clients SET ?"
  con.query(sql, req.body, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.redirect('/');
  });
});

app.get('/create', (req, res) => {
  res.sendFile(path.join(__dirname, 'html/form.html'))
});

app.get('/edit/:id', (req, res) => {
  const sql = "SELECT * FROM clients WHERE id = ?";
  con.query(sql, [req.params.id], function (err, result, fields) {
    if (err) throw err;
    res.render('edit', {
      user: result
    });
  });
});

app.post('/update/:id', (req, res) => {
  console.log(req.params.id);
  const sql = "UPDATE clients SET ? WHERE id = " + req.params.id;
  con.query(sql, req.body, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.redirect('/');
  });
});

app.get('/delete/:id', (req, res) => {
  const sql = "DELETE FROM clients WHERE id = ?";
  con.query(
    sql, [req.params.id],
    function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.redirect('/');
    });
});

//ユーザー毎のページに移動するためのapp.js
app.get('/', (req, res) => {
  res.render('index', { users: users });
});

//利用者情報画面
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  const user = users.find(user => user.id === Number(userId));
  res.render('user', { user: user });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

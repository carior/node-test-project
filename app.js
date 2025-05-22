
// 这是Express的文件夹

// const express = require('express'); //webpack使用 vite不能使用
import express from 'express' // 导入 Mock.js
import mysql from 'mysql2' // 导入 mysql
const app = express();

var connection = mysql.createPool({
    host: 'localhost', // 数据库主机地址，如果是本地数据库则使用localhost
    user: 'root', // 数据库用户名
    password: '', // 数据库密码
    database: 'lry' // 要连接的数据库名
});

//设置跨域访问
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.get('/', (req, res) => {
  res.send('Hello World!8888');
});

// 创建路由
app.get('/api/user/list', (req, res) => {
    // 查询数据库并返回数据
    connection.query('SELECT * FROM user', (err, results) => {
      console.log(err,'err');
      console.log(results,'results');
      if (err) {
        console.error('Error querying database:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.json({
        code:'200',
        data:results,
      });
      // res.json(results);
    });
  });


app.listen(8888, () => {
  console.log('Example app listening on port 8888!');
});
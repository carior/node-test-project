// 这是Express的文件夹

// const express = require('express'); //webpack使用 vite不能使用
import express from 'express' // 导入 Mock.js
import mysql from 'mysql2' // 导入 mysql
const app = express();

// 添加 body-parser 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var connection = mysql.createPool({
    host: 'localhost', // 数据库主机地址，如果是本地数据库则使用localhost
    user: 'root', // 数据库用户名
    password: '', // 数据库密码
    database: 'lry' // 要连接的数据库名
});

//设置跨域访问
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    
    // 处理 OPTIONS 请求
    if (req.method === "OPTIONS") {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.get('/', (req, res) => {
  res.send('Hello World!8888');
});

// 获取用户列表
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

// 添加用户列表
app.post('/api/user/add', (req, res) => {
  // 获取当前最大的id
  connection.query('SELECT MAX(id) as maxId FROM user', (err, results) => {
    if (err) {
      console.error('Error getting max id:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    
    // 如果没有id，则使用最大id+1作为新id
    const nextId = (results[0].maxId || 0) + 1;
    const { name, age, email } = req.body;
    
    // 修改插入语句，包含 id 字段
    connection.query('INSERT INTO user (id, name, age, email) VALUES (?, ?, ?, ?)', 
      [nextId, name, age, email], 
      (err, results) => {
        if (err) {
          console.error('Error adding user:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
        res.json({
          code: '200',
          message: 'User added successfully',
          data: results
        });
    });
  });
});

// 修改用户列表
app.put('/api/user/update/:id', (req, res) => {
  const { id } = req.params;
  const { name, age, email } = req.body;
  connection.query('UPDATE user SET name = ?, age = ?, email = ? WHERE id = ?', [name, age, email, id], (err, results) => {
    if (err) {
      console.error('Error updating user:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({
      code: '200',
      message: 'User updated successfully',
      data: results
    });
  });
});

// 删除用户列表
app.delete('/api/user/delete/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM user WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error deleting user:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({
      code: '200',
      message: 'User deleted successfully',
      data: results
    });
  });
});


app.listen(8888, () => {
  console.log('Example app listening on port 8888!！');
});
//postgreSQL Linuxユーザー名:postgres データベース名:himitu_board

'use strict';
const http = require('http');
const auth = require('http-auth');
const router = require('./lib/router');

const basic = auth.basic({
  realm: 'Enter username and password.',
  file: './users.htpasswd'
});

const server = http.createServer(basic,(req, res) => {
  router.route(req,res);
  //アクセスがあったらlib/router.jsに丸投げ
}).on('error', (e) => {
  console.error('Server Error', e);
}).on('clientError', (e) => {
  console.error('Client Error', e);
});
//アクセスした際のレスポンスを設定＆サーバーを作成


const port = 8000;
server.listen(port, () => {
  console.info(`Listening on  ${port}`);
});
//サーバーを起動する＆起動し終わったらログを表示
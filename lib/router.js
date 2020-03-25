// リクエストを、処理を行うハンドラに振り分ける
//req,resを受け取ったらここに来る
//リクエスト=>router.js=>処理分岐,/postsならposts-handler.jsへ
//  /posts以外のアクセスなら=>handler-util.jsへ


'use strict';
const postsHandler = require('./posts-handler');
const util = require('./handler-util');

function route(req,res) {
  switch(req.url) {
    case '/posts':
      postsHandler.handle(req,res);
      break;
    case '/logout':
      //TODO ログアウト処理
      //handler-utilのhandleLogout(req,res);
      util.handleLogout(req,res);
      break;
    default:
      util.handleNotFound(req,res);
      break;  
  }
}

module.exports = {
  route
};
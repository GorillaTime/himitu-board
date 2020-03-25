//  /posts以外のアクセス
'use strict';

function handleLogout(req,res) {
  res.writeHead(401, {
    //chrome等主流なブラウザなら、401を返せばログアウトしてくれるけど、ブラウザによって対応してないかもしれません
    'Content-Type': 'text/plain; charset=utf-8'
  });
  res.end('(´・ω・｀)やぁ、ようこそログアウトページへ');
}

function handleNotFound(req,res) {
  res.writeHead(404, {
    'Content-Type': 'text/plain; charset=utf-8 '
  });
  res.end('ページが見つかりません');
}

function handleBadRequest(req,res) {
  res.writeHead(400, {
    'Content-Type': 'text/plain; charset=utf-8'
  });
  res.end('(´・ω・｀)やぁ、ようこそ未対応のメソッドへ');
}

module.exports = {
  handleLogout,
  handleNotFound,
  handleBadRequest
};
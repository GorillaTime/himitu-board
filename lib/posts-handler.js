//  /postsのリクエストを処理する
// /postsでGETアクセスなら　投稿一覧　表示
// /postsでPOSTアクセスなら　投稿後、投稿一覧へリダイレクト
'use strict';

const pug = require('pug');
const Cookies = require('cookies');
const util = require('./handler-util');
const Post = require('./post');
//const contents = []; //投稿内容の一覧が入っています

const trackingIdKey = 'tracking_id';

function handle(req,res) {
  const cookies = new Cookies(req,res); //cookies変数にクッキーオブジェクトを生成
  //key:trackingIdKey ,value:trackingId(生成した16桁の整数)
  addTrackingCookie(cookies); //addTrackingCookie関数にオブジェクトを渡す

  switch(req.method) {
    case 'GET':
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
      });
      //
      Post.findAll({order:[['id', 'DESC']]}).then((posts) => {
        res.end(pug.renderFile('./views/posts.pug', {
          posts: posts
        }));
        //
        console.info(
          `閲覧されました: user:${req.user} ,` +
          `trackingId: ${cookies.get(trackingIdKey) },` +
          `remoteAddress: ${req.connection.remoteAddress},` +
          `userAgent: ${req.headers['user-agent']}`
        );
        //
      });
      break;
    case 'POST':
      let body = [];
      req.on('data', (chunk) => {
        body += chunk;
      }).on('end', () => {
        const decoded =decodeURIComponent(body);
        const content = decoded.split('content=')[1];
        console.info(`投稿されました ${content}`);

        Post.create({ //DB上にデータを作成
          content: content,
          trackingCookie: cookies.get(trackingIdKey),
          postedBy: req.user
        }).then( () => {
          handleRedirectPosts(req,res);
        });
      });
      break;
    default:
      //対応されていないメソッドのリクが来た際に400を返す
      util.handleBadRequest(req,res)
      break;    
  }
}

function addTrackingCookie(cookies) {
  //cookiesオブジェクトを受け取り、key:trackingIdkey変数でゲットした値が無ければ、処理を実行
  if( !cookies.get(trackingIdKey) ) {
    const trackingId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    //ランダム整数値を作成してtrackingId変数に代入 
    //Math.random()で0から1未満のランダム少数を作成,Number.MAX_SAFE_INTEGERで整数の最大値「9,007,199,254,740,991」を掛ける,Math.floor()で小数点以下を切り捨て
    const tomorrow = new Date( Date.now() + (1000*60*60*24) );
    //new Date()でインスタンス生成する際に　Date.now()で生成したミリ秒を渡し、そのミリ秒が示す時刻のDateオブジェクトを生成
    //更に、1 日分のミリ秒 1000 * 60 * 60 * 24を足し、24時間後を示すDateオブジェクトを生成。これがクッキーの有効期限になる
    cookies.set( trackingIdKey, trackingId, { expires: tomorrow} );
    //定数trackingIdKey = 'tracking_id'; 定数trackingId:生成した16桁の整数。expires(クッキーの有効期限を設定するプロパティ)に定数tomorrowを渡す
  }
}

function handleRedirectPosts(req,res) {
  res.writeHead(303, {
    'Location': '/posts'
  });
  res.end();
}

module.exports = {
  handle
};

//PostgresSQL をsequelizeモジュールで使う

'use strict';
const Sequelize = require('sequelize');　//PostgreSQLにアクセス出来るモジュール、Sequelizeを読み込む
const sequelize = new Sequelize(
  'postgres://postgres:postgres@localhost/himitu_board',
  {
    logging: false,　//Sequelizeが出すログの設定をオフ
    operatorsAliases: false //エイリアス修飾子の設定をオフ
  });
  //DBの設定を渡して、掲示板を表すオブジェクトを生成。

const Post = sequelize.define('Post', {
  //定義したデータモデルをSequelizeの形式で記述。投稿をPostの名前のオブジェクトとして定義
  id: {
    type: Sequelize.INTEGER,　
    autoIncrement: true,
    primaryKey: true　//idを整数型、オートインクリメント、主キー設定に
  },
  content: {
    type: Sequelize.TEXT　//contentは投稿内容　TEXT型に
  },
  postedBy: {
    type: Sequelize.STRING　//投稿者名　STRING型はデフォ255文字まで
  },
  trackingCookie: {
    type: Sequelize.STRING
  }
}, {
  freezeTableName: true,　//テーブルの名前を"Post"に固定
  timestamps: true //createdAt,updateAt　作成日時・更新日時を自動的に追加してくれる設定をオン
});

Post.sync();　//PostオブジェクトをDBに適用して同期
module.exports = Post; //Postオブジェクトをモジュールとして公開
# 取扱説明書
タイトル:相手の感情が"見える"チャットアプリ  

フロントエンド、バックエンドにはそれぞれのソースコードが入っている。  
apkファイルはスマートフォンにダウンロードして起動すると、アプリのダウンロードが行われ。実際にアプリとして使うことができる。

## アプリ概要
- 概要紹介
    - チャットでの雑談を支援することを目的とした、アプリケーション
    - チャットを行う相手の感情が自動で判定され、メッセージと共に表示される。
    - ユーザー個別の判定を行うことによって、多様な日本語の使い方に対応。
    - UIコンポーネントにOnsenUIを利用しており、軽量で美麗なUIを利用可能。

- 使い方
  - 通常のチャットアプリと同じように使用することができる。
  - 感情については自動で判定されるため、特別な動作は必要ない。
  - 自分の気持ちをより正確に相手に伝えるための機能が複数ついている
    - 手動単語登録・補正機能:ユーザーに単語の表層形・ヨミ・極性値・品詞を手動で定義させ、辞書に登録することで、以降の判定に反映させることができる。  
    - 自動単語登録・補正機能:上記の機能は逐一単語を登録しなければいけないため、少々手間であるといえる。この機能はその問題を改善するために判定結果を利用して、辞書を自動で補正する機能だ。    
  - チャットに必要な機能を各種実装
    - ピン留め機能:ユーザーが会話の中で流れて欲しくない情報を画面上部に留めておくことが出来る。  
    - 送信前確認機能:アンケートの結果多かった、誤送信を防止する機能だ。メッセージの送信前にダイアログを表示し、極性値とともに送信確認を行う機能になっている。  
    - ログイン機能:会員登録ができ、パスワードを設定することが出来る機能。  
    - ルーム分割機能:チャットを行うルームはユーザーが自由に作成することができる。招待を作成することで、ほかのユーザーを招待可能。  

## 動作・開発環境
- 開発環境
  - フロントエンド_monaca
  - バックエンドサーバー_AWS cloud9
  - データサーバー_ニフクラ mobile backend

- 動作環境
  - Android ※iosではチャット機能のみ利用可能

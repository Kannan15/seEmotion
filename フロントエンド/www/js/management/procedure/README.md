# 会員管理とルーム管理の手続き部分のクラス    2019/10/05
## 全体として
    基本的に、このフォルダ内のファイルで定義した関数はPromiseや自分自身をかえすので、
    関数呼び出しの後ろにほかの処理をつなげて記述ができる。

## 会員管理機能について
  * 概要

    1. ログイン機能
    ニフクラにもともとある会員管理機能だと複数デバイスの重複ログインが行えないので
    それを解消するためにニフクラのログイン関数の使用方法を参考に作成
    処理としては、データストアのaccountに保存している会員情報から、ログインダイアログへの入力内容と合致するものを探し、
    見つけたらローカルストレージに保存する。ログイン状態の判定はこのローカルストレージへの情報の有無で判断している。
    現状、セッショントークンの機能を実装していないのでこのような処理になっているが、セッショントークンを実装し、トークンのうむと
    ストレージ内の情報で判断することによってセキュリティ面をカバーする予定

    2. 会員登録機能
    ニフクラの会員登録機能とほぼ変わりなし
    ただし保存先は会員管理ではなくデータストアのaccountになっている。
    
    3. その他の機能
    ルームへの参加・退会を記録する機能
    この機能は、ルーム管理機能でも実装されているものの、ユーザの情報としてまとめておくほうがほかの部分を楽に記述でき、処理も早くなるため
    ユーザ側への記録の処理をこちらに実装した。

  * 関数の説明
    前提として、このファイル(account.js)で定義している関数は一つのみで、
    会員管理機能を実装したクラスを返す関数が存在している。
    そのため、この関数をnew演算子の後ろで呼び出すことで、クラスを生成して使用する。
    また、このファイルのプログラムのうち、外部で呼び出せるのもこの関数のみである。

    * クラスのメンバ関数について
    まず会員管理用のクラスには以下のようなメンバが存在している
    get, set, checkStatus, getCurrentUser, signUpByAccount, joinRoom, exitRoom, login, logout, [setCurrentUser], [CurrentUser], [newAccount], [detectChange], [getUserStatus]
    ※[]で囲われているものはプライベートなメンバで、外部からアクセスできない。
    先に変数について説明する。
    この中で変数は[CurrentUser], [newAccount]の二つで、どちらも会員登録時に使用される。
    [newAccount]はフラグで、会員登録機能を利用する場合にほかの機能を使えなくするために存在している。[CurrentUser]は、登録する会員の情報を格納する変数で、後述のset関数で利用している。

    関数について...
      * constructor
        クラスの生成時に呼び出される関数。
        [newAccount]をfalseにする、[CurrentUser]を情報を格納しやすいようにオブジェクトにする等
        色々な初期設定を行う。
    
      1. 公開メンバ
        * get関数
          データベース上に存在する会員情報を取得して、ローカルストレージに複製する関数。
          この関数で保存した情報には、ユーザID、ユーザ名、参加しているルームの情報等がまとめられていて、
          この情報を使用して、ルームリストの表示や、ログイン状態の判断を行っている。
        
        * set関数
          会員を登録するための情報を設定する関数
          この関数を使用すると[newAccount]フラグが立ち、会員登録以外の機能が制限される。
          この関数自体に会員登録機能はなく、会員登録機能を実行するための情報を読み込ませるための関数となっている。

        * E関数
          特に存在意義はない。
          本来は例外を飛ばす関数を使いたかったが、調べても出てこなかったので、
          使いたかった場所をわかりやすくするためにとりあえず置いてある関数。
        
        * checkStatus関数
          同じアカウントに複数デバイスでログインした場合、片方のデバイスでの変更がもう片方へ反映されないため、
          それを解消するための関数。
          具体的には、自分が開いていないルームでの発言に対して、発言者のIDを確認し、もし自分のIDと一致していて、
          なおかつそのルームのIDを持っていない場合は自動で追加するという処理を行っている。
          まだ実装していないが、招待機能でも同様の対応をする予定でである
        
        * getCurrentUser関数
          ローカルストレージにあるユーザ情報を取得する関数。
          もし保存されていなければnullをかえし、保存されていれば、取得した情報と情報のゲッタ関数をくっつけたオブジェクトを返す。

        * signUpByAccount関数
          set関数で設定した情報をもとに会員登録を行う。
          一応、登録終了後はその会員でログインするようにしてあるが、
          この部分をどうするかは要検討。
        
        * joinRoom関数
          新しいルームに参加したときに、参加したルームの情報を
          データベース上とローカルストレージのユーザ情報に追加する関数。
          
        * exitRoom関数
          新しいルームから退出したときに、退出したルームの情報を
          データベース上とローカルストレージのユーザ情報から削除する関数。

        * login関数
          ユーザ名とパスワードを入力させユーザ名とパスワードが一致したアカウントを探し、
          もしあったらそのアカウントの情報をローカルストレージに保存し、なければエラーを返す関数。

        * logout関数
          ログイン状態の判断基準がローカルストレージなので、
          ローカルストレージからデータを削除するだけで、ログアウトを実装している。

      2. 非公開メンバ <- 引数の形式や例外処理を挟まない、または勝手に使われては困る関数群
        * [setCurrentUser]関数
          ユーザ情報のオブジェクトを引数に取る。引数のオブジェクトから情報を取得し、
          ローカルストレージに保存する関数。

        * [getUserStatus]関数
          データベースから、ローカルストレージに保存されたユーザ情報を参考に
          最新の情報を取得してくる関数。

        * [detectChange]
          これそのものは関数ではなく、キーに対応したユーザー情報の比較関数を呼び出すためのオブジェクト。
          現在は、ルームの情報の比較関数のみ。招待関連でも使う予定。

## ルーム管理機能のついて
  * 概要
    1. ルーム参加機能
    ルームIDを入力させ、そのIDでルームを検索
    見つからなければ警告を発し、見つかればルームの参加者の欄にユーザを追加し、
    ルームの情報をユーザに返す。
    2. ルーム追加機能
    ルームの名前を入力させ、それでルームを作成する。
    作成するルームは参加者の欄に初めから、作成者の情報を持つ。
  
  * 関数の説明
    
    1. searchRoom関数
    ルームIDを引数にとる。引数に取ったIDでルームを検索し、
    その検索結果を返す関数。

    2. joinRoom関数
    searchRoomでルームの検索結果を取得し、検索されたルームに対して概要の通りに処理を行う。

    3. createRoom関数
    searchRoomでルームの検索結果を取得し、検索されたルームに対して概要の通りに処理を行う。
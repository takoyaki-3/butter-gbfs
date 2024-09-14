## シェアサイクルステーションマップ

### 概要

このプロジェクトは、LeafletとMarkerClusterを使用して、世界のシェアサイクルステーションの位置を地図上に表示するWebアプリケーションです。
MobilityDataが提供するGBFS（General Bikeshare Feed Specification）のオープンデータを利用し、各社のシェアサイクルステーションの情報を取得・表示します。

### 特徴

- 世界中の様々なシェアサイクル会社のステーション情報を表示
- 会社ごとにステーションの表示/非表示を切り替え可能
- ステーション名、利用可能な自転車数、空きドック数をポップアップで表示
- ステーションIDをクリップボードにコピーする機能
- URLパラメータで会社とステーションを指定し、特定のステーションを表示可能


### ファイルツリー

```
└── public
    ├── app.js
    ├── bike_stop_icon.png
    ├── bus_stop_icon.png
    └── index.html
└── sample
    ├── gbfs.json
    ├── readme.md
    ├── station_information.json
    ├── station_status.json
    ├── system_information.json
    └── vehicle_types.json

```

### 各ファイル・ディレクトリの説明

- **public/**: Webページとして公開するファイル群
    - **app.js**: 地図の表示、データ取得、マーカー表示などの処理を行うJavaScriptファイル
    - **bike_stop_icon.png**: 自転車ステーションのマーカーに使用するアイコン画像
    - **bus_stop_icon.png**: バス停のマーカーに使用するアイコン画像（未使用）
    - **index.html**: 地図を表示するHTMLファイル
- **sample/**: サンプルデータ
    - **gbfs.json**: GBFSのルートファイル。他のデータファイルへのリンクを含む
    - **readme.md**: サンプルデータの説明
    - **station_information.json**: ステーションの基本情報（名前、住所、位置など）
    - **station_status.json**: ステーションのリアルタイム情報（利用可能な自転車数、空きドック数など）
    - **system_information.json**: シェアサイクルシステムの情報（会社名、サービス開始日など）
    - **vehicle_types.json**: 車両の種類に関する情報


### インストール方法

このプロジェクトはWebアプリケーションであり、サーバーへのインストールは不要です。
以下の手順でローカル環境で動作させることができます。

1. このリポジトリをクローンします。
2. `public/index.html` をブラウザで開きます。


### 使い方

1. `public/index.html` をブラウザで開くと、地図上にシェアサイクルステーションが表示されます。
2. 左上のドロップダウンメニューから会社を選択すると、その会社のステーションのみが表示されます。
3. マーカーをクリックすると、ステーション名、利用可能な自転車数、空きドック数が表示されます。
4. マーカーをさらにクリックすると、ステーションIDがクリップボードにコピーされ、アラートが表示されます。

### APIエンドポイント

このアプリケーションは、MobilityDataが提供するGBFSのオープンデータを利用しています。
GBFSのルートファイル（`gbfs.json`）には、他のデータファイルへのリンクが含まれています。
各データファイルのエンドポイントは、`gbfs.json` から取得されます。

例えば、HELLO CYCLINGのステーション情報は、以下のエンドポイントから取得されます。

```
https://api-public.odpt.org/api/v4/gbfs/hellocycling/station_information.json
```

### URLパラメータ

特定の会社の特定のステーションを表示するために、URLパラメータを使用することができます。

- `company`: 会社のシステムIDを指定します。
- `station`: ステーションの名前を指定します。

例えば、HELLO CYCLINGの「ガリシア御殿山」ステーションを表示するには、以下のURLにアクセスします。

```
https://<your-domain>/public/index.html?company=HELLO%20CYCLING&station=%E3%82%AC%E3%83%AA%E3%82%B7%E3%82%A2%E5%BE%A1%E6%AE%BF%E5%B1%B1
```

### 設定ファイル

このアプリケーションには、設定ファイルは特にありません。
データソースや表示設定は、`public/app.js` 内に記述されています。

### コマンド実行例

このアプリケーションはWebアプリケーションであり、コマンドラインから実行するコマンドはありません。


### ライセンス

このプロジェクトはMITライセンスで公開されています。


### 作者

takoyaki-3
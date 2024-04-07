// 地図の初期化
var mymap = L.map('mapid').setView([35.681236, 139.767125], 13); // 東京駅の座標を初期値とする

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(mymap);

// ステーションのマーカーを格納するクラスターグループを作成
var markers = L.markerClusterGroup();

// 自転車ステーションのピン画像URL
var bikePinUrl = './bike_stop_icon.png'; // ここにアップロードした自転車ピンのURLを入力してください

// ピンのアイコンを定義
var bikeIcon = L.icon({
    iconUrl: bikePinUrl,
    iconSize: [38, 38], // アイコンのサイズ
    iconAnchor: [22, 94], // アイコンの"釘"の部分
    popupAnchor: [-3, -76] // ポップアップが開く位置
});

// GBFSのJSONデータを取得し、処理する関数
function fetchAndProcessGBFSData() {
    fetch('https://api-public.odpt.org/api/v4/gbfs/hellocycling/station_information.json')
        .then(response => response.json())
        .then(data => {
            const stations = data.data.stations; // 仮定のパス: 実際のデータ構造に合わせて調整してください
            stations.forEach(station => {
                var marker = L.marker([station.lat, station.lon], { icon: bikeIcon })
                    .bindPopup(`<b>${station.name}</b><br>利用可能な自転車: ${station.num_bikes_available}`);
                markers.addLayer(marker);
            });
            mymap.addLayer(markers);
        })
        .catch(error => console.error('Error loading GBFS data:', error));
}

// 地図のズームレベルが変わったときのイベントハンドラを追加
mymap.on('zoomend', function() {
    var currentZoom = mymap.getZoom();
    
    // 地図のズームレベルに応じた制御が必要な場合はここにコードを追加
    // このサンプルでは、ズームレベルによる表示のオンオフ切り替えは行っていませんが、
    // 必要に応じて特定のズームレベルで特定のアクションを行うことができます。
});

// GBFSデータを取得して処理する関数を実行
fetchAndProcessGBFSData();

// 地図の初期化
var mymap = L.map('mapid').setView([35.681236, 139.767125], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(mymap);

// ステーションのマーカーを格納するクラスターグループを作成
var markers = L.markerClusterGroup();

// 自転車ステーションのピン画像URL
var bikePinUrl = './bike_stop_icon.png'; 

// ピンのアイコンを定義
var bikeIcon = L.icon({
    iconUrl: bikePinUrl,
    iconSize: [38, 38], 
    iconAnchor: [19, 38], 
    popupAnchor: [0, -38] 
});

// ステーションの情報を取得する
function fetchStationInformation() {
    return fetch('https://api-public.odpt.org/api/v4/gbfs/hellocycling/station_information.json')
        .then(response => response.json())
        .then(data => data.data.stations);
}

// ステーションのステータスを取得する
function fetchStationStatus() {
    return fetch('https://api-public.odpt.org/api/v4/gbfs/hellocycling/station_status.json')
        .then(response => response.json())
        .then(data => data.data.stations);
}

// ステーションの情報とステータスをマージする
function addStationsToMap(stationsInfo, stationsStatus) {
    const statusIndex = stationsStatus.reduce((acc, station) => {
        acc[station.station_id] = station;
        return acc;
    }, {});

    stationsInfo.forEach(stationInfo => {
        const stationStatus = statusIndex[stationInfo.station_id];
        var popupContent = `<b>${stationInfo.name}</b><br>` +
                           `利用可能な自転車: ${stationStatus.num_bikes_available}<br>` +
                           `返却可能数: ${stationStatus.num_docks_available}`;
        var marker = L.marker([stationInfo.lat, stationInfo.lon], { icon: bikeIcon })
            .bindPopup(popupContent);
        markers.addLayer(marker);
    });

    mymap.addLayer(markers);
}

// データを取得してマップに追加する
Promise.all([fetchStationInformation(), fetchStationStatus()])
    .then(([stationsInfo, stationsStatus]) => addStationsToMap(stationsInfo, stationsStatus))
    .catch(error => console.error('Error loading GBFS data:', error));

// 地図のズームレベルが変わったときのイベントハンドラを追加
mymap.on('zoomend', function() {
    // ズームレベルに基づくアクションをここに追加することができます
});

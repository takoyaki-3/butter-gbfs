// 地図の初期化
var mymap = L.map('mapid').setView([35.681236, 139.767125], 13);

// タイルレイヤーの設定
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(mymap);

// マーカーを格納するクラスターグループを作成
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

// グローバル変数としてエンドポイントのマッピングを持ちます
var endpoints = {
    default: {
        station_info: 'https://api-public.odpt.org/api/v4/gbfs/hellocycling/station_information.json',
        station_status: 'https://api-public.odpt.org/api/v4/gbfs/hellocycling/station_status.json'
    }
};

// ステーション情報を取得する関数
function fetchStationInformation(systemId) {
    systemId = systemId || 'default';
    // エンドポイントのマッピングからURLを取得
    const url = endpoints[systemId].station_info;
    return fetch(url)
        .then(response => response.json())
        .then(data => data.data.stations);
}

// ステーションステータスを取得する関数
function fetchStationStatus(systemId) {
    systemId = systemId || 'default';
    // エンドポイントのマッピングからURLを取得
    const url = endpoints[systemId].station_status;
    return fetch(url)
        .then(response => response.json())
        .then(data => data.data.stations);
}

// CSVデータを取得し、日本のシステムを抽出する関数
function fetchAndFilterBikeSystems(url) {
    return fetch(url)
        .then(response => response.text())
        .then(text => {
            const lines = text.split('\n');
            const systems = lines.slice(1).map(line => line.split(','));
            // 日本のシステムのみを抽出
            return systems.filter(system => system[0] === 'JP');
        });
}

// ステーション情報とステータスを統合する関数
function integrateStationData(stationsInfo, stationsStatus) {
    const statusById = stationsStatus.reduce((acc, status) => {
        acc[status.station_id] = status;
        return acc;
    }, {});

    return stationsInfo.map(info => {
        return {
            ...info,
            ...statusById[info.station_id]
        };
    });
}

// マップ上にステーションを追加する関数
function addStationsToMap(integratedStationsData) {
    // 既存のマーカーをクリアする
    markers.clearLayers();
    
    integratedStationsData.forEach(station => {
        var popupContent = `<b>${station.name}</b><br>` +
                           `利用可能な自転車: ${station.num_bikes_available}<br>` +
                           `空きドック数: ${station.num_docks_available}`;
        var marker = L.marker([station.lat, station.lon], { icon: bikeIcon })
            .bindPopup(popupContent);
        markers.addLayer(marker);
    });

    // 更新されたマーカーのグループをマップに追加する
    mymap.addLayer(markers);
}

// ドロップダウンメニューを更新する関数
function updateDropdown(systems) {
    const select = document.getElementById('companySelect');
    // ドロップダウンを初期化
    select.innerHTML = '<option value="">会社を選択...</option>';
    
    systems.forEach(system => {
        const gbfsUrl = system[5]; // GBFSのgbfs.jsonファイルのURLを取得
        fetch(gbfsUrl)
            .then(response => response.json())
            .then(gbfsData => {
                // GBFSのdataオブジェクトから必要なエンドポイント情報を取り出す
                const feeds = gbfsData.data.ja.feeds;
                const stationInfoUrl = feeds.find(feed => feed.name === "station_information").url;
                const stationStatusUrl = feeds.find(feed => feed.name === "station_status").url;

                // エンドポイントの情報をグローバル変数に格納
                endpoints[system[1]] = {
                    station_info: stationInfoUrl,
                    station_status: stationStatusUrl
                };

                // ドロップダウンにオプションを追加
                const option = document.createElement('option');
                option.value = system[1]; // システムIDをvalueとして持つ
                option.textContent = system[1]; // 会社名をテキストとして持つ
                select.appendChild(option);

                console.log('Added system:', system[1], endpoints[system[1]]);
            })
            .catch(error => console.error('Error fetching GBFS data:', error));
    });
}


// 選択された会社のステーションのみを表示する関数
function showSelectedCompanyStations(companyId, integratedStationsData) {
    // マーカーをクリア
    markers.clearLayers();

    // 選択された会社のステーションをフィルタリングして追加
    integratedStationsData.filter(station => station.system_id === companyId)
                          .forEach(station => {
                              var popupContent = `<b>${station.name}</b><br>` +
                                                 `利用可能な自転車: ${station.num_bikes_available}<br>` +
                                                 `空きドック数: ${station.num_docks_available}`;
                              var marker = L.marker([station.lat, station.lon], { icon: bikeIcon })
                                  .bindPopup(popupContent);
                              markers.addLayer(marker);
                          });

    // マップにマーカーを追加
    mymap.addLayer(markers);
}

// ドロップダウンの選択に基づいてマップを更新するイベントハンドラー
document.getElementById('companySelect').addEventListener('change', function(event) {
    const systemId = event.target.value;
    console.log('Selected system:', systemId);
    if (systemId) {
        Promise.all([fetchStationInformation(systemId), fetchStationStatus(systemId)])
            .then(([stationsInfo, stationsStatus]) => {
                allStationsData = integrateStationData(stationsInfo, stationsStatus);
                addStationsToMap(allStationsData); // 最初に全ステーションをマップに表示する
        
                // const integratedData = integrateStationData(stationsInfo, stationsStatus);
                // showSelectedCompanyStations(systemId, integratedData);
            })
            .catch(error => console.error('Error loading data for the selected system:', error));
    } else {
        // 何も選択されていない場合はすべて表示
        addStationsToMap(allStationsData);
    }
});

// すべてのデータを取得し、マップにステーションを表示する
let allStationsData = []; // すべてのステーションデータを保持する変数

Promise.all([fetchStationInformation(), fetchStationStatus()])
    .then(([stationsInfo, stationsStatus]) => {
        allStationsData = integrateStationData(stationsInfo, stationsStatus);
        addStationsToMap(allStationsData); // 最初に全ステーションをマップに表示する
        return fetchAndFilterBikeSystems('https://raw.githubusercontent.com/MobilityData/gbfs/master/systems.csv');
    })
    .then(systems => {
        console.log(systems);
        updateDropdown(systems); // ドロップダウンメニューにシステムを追加する
    })
    .catch(error => console.error('Error loading data:', error));

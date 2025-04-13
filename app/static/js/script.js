// APIのエンドポイント

const googleKey = "" // キーを入力
const configApiUrl = '/api/config'
const flowersApiUrl = '/flowers';
const parkApiUrl = '/flowers/<flower_name>/parks';
const termApiUrl = '/flowers/<flower_name>/term';
const stationApiUrl = '/parks/<park_name>/near_stations';

function reset(onlyPark=false) {
    if (!onlyPark) {
        document.getElementById("flowerName").innerText = "花名";
        document.getElementById("term").innerText = "見ごろ: ";
    }
    document.getElementById("parkName").innerText = "公園名";
    document.getElementById("station").innerText = "最寄り駅: ";
    document.getElementById("distance").innerText = "駅まで0m";
    document.querySelector('iframe').style.visibility = "hidden";
}

// 花のリストを取得する非同期関数
async function fetchFlowers() {
    try {
        const response = await fetch(flowersApiUrl);
        const data = await response.json();
        const flowers = data.flowers;

        // select要素を取得
        const selectElement = document.getElementById('flowerSelect');

        // 最初のoption要素を作成し、初期値を設定
        const initialOption = document.createElement('option');
        initialOption.value = '';
        initialOption.textContent = '花を選択してください';
        initialOption.selected = true;
        selectElement.appendChild(initialOption);

        // 各花をoption要素として追加
        flowers.forEach(flower => {
            const option = document.createElement('option');
            option.value = flower;
            option.textContent = flower;
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error('エラーが発生しました:', error);
    }
}

// 公園のリストを取得する非同期関数
async function fetchParks(flowerName) {
    try {
        const url = parkApiUrl.replace('<flower_name>', flowerName);
        const response = await fetch(url);
        const data = await response.json();
        const parks = data.parks;


        // 既存のoption要素を削除
        parkSelect.innerHTML = '';

        // 最初のoption要素を作成し、初期値を設定
        const initialOption = document.createElement('option');
        initialOption.value = '';
        initialOption.textContent = '公園を選択してください。';
        initialOption.selected = true;
        parkSelect.appendChild(initialOption);

        // 各公園をoption要素として追加
        parks.forEach(park => {
            const option = document.createElement('option');
            option.value = park;
            option.textContent = park;
            parkSelect.appendChild(option);
        });
    } catch (error) {
        console.error('エラーが発生しました:', error);
    }
}

async function fetchTerm(flowerName) {
    try {
        const url = termApiUrl.replace('<flower_name>', flowerName);
        const response = await fetch(url);
        const data = await response.json();
        const term = data.term;
        const flowerTerm = document.getElementById("term");
        flowerTerm.innerText = "見ごろ: " + term;
    } catch (error) {
        console.error('エラーが発生しました:', error);
    }
}

async function findStation(parkName) {
    try {
        const url = stationApiUrl.replace('<park_name>', parkName);
        const response = await fetch(url);
        const data = await response.json();
        const station = data.station;
        const distance = data.distance;
        console.log(station, distance);
        const stationElem = document.getElementById("station");
        const distanceElem = document.getElementById("distance");
        stationElem.innerText = "最寄り駅: " + station;
        distanceElem.innerText = "駅まで" + distance;
    } catch (error) {
        console.error('エラーが発生しました:', error);
    }
}

const flowerSelect = document.getElementById('flowerSelect');
const parkSelect = document.getElementById('parkSelect');
const iframe = document.querySelector('iframe');
// Google Maps APIのベースURL
const mapApiBase = "https://www.google.com/maps/embed/v1/directions?key=" + googleKey + "&origin=東京タワー&destination=<公園名>&avoid=tolls|highways";

// 花が選択された時のイベントリスナー
flowerSelect.addEventListener('change', () => {
    const selectedFlower = flowerSelect.value;

    // 花名のh3を変更する
    const flower_name_elem = document.getElementById("flowerName");

    if (flowerSelect.value != "") {
        fetchParks(selectedFlower);
        reset(onlyPark=true);
        flower_name_elem.innerText = flowerSelect.value;
        fetchTerm(selectedFlower);
    } else {
        reset();
    }
});

// 公園が選択された時のイベントリスナー
parkSelect.addEventListener('change', () => {
    const selectedPark = parkSelect.value;
    const encodedPark = encodeURIComponent(selectedPark);
    const newSrc = mapApiBase.replace('<公園名>', encodedPark);
    const parkName = document.getElementById("parkName");

    // 公園名の更新, 駅情報の取得+更新,マップの更新
    if (selectedPark != "") {
        iframe.src = newSrc;                        // マップのルートを更新
        iframe.style.visibility = "visible";        // マップを表示(非表示の時用)
        parkName.innerText = selectedPark;          //公園名の更新
        findStation(selectedPark); // 駅情報の取得
    } else {
        reset(true);
    }
});

// ページ読み込み時に実行
window.onload = fetchFlowers;

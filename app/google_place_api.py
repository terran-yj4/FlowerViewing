"""
これは、指定した名前の施設、場所をGoogleが提供しているAPIを用いて取得して、座標を返すプログラムである。
"""

import requests
import config

class GooglePlaceAPI:
    _api_key = config.GOOGLE_PLACE_API_KEY   # クラス変数にAPIキーを設定
    _base_url = "https://maps.googleapis.com/maps/api/place/textsearch/json"

    @classmethod
    def get_park_coordinate(cls, place: str):
        """{place}の場所(緯度・経度)を取得し返す関数

        Args:
            place (str): 緯度・経度を取得したい場所の名前
        """

        # パラメータの設定
        params = {
            "query": place,
            "key": cls._api_key
        }

        # APIリクエストの送信
        try:
            response = requests.get(cls._base_url, params=params)
            response.raise_for_status()  # HTTPエラーをチェック
            data = response.json()# レスポンスデータをJSONで解析

            # 結果を処理
            if "results" in data and len(data["results"]) > 0:
                result = data["results"][0]
                location = result["geometry"]["location"]
                lng = location["lng"]
                lat = location["lat"]
                # print(f"経度: {lng}, 緯度: {lat}")
                return lng, lat
            else:
                print("該当する結果が見つかりませんでした。")
                return None, None

        except requests.exceptions.RequestException as e:
            print(f"APIリクエストエラー: {e}")
            return None, None

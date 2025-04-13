"""
これは、座標(経度, 緯度)から最寄りの駅を検索するプログラムである。
"""

import requests

class StationFinder:
    base_url = "https://express.heartrails.com/api/json?method=getStations"

    @classmethod
    def find_nearest_station(cls, x: float, y: float) -> dict:
        """_summary_

        Args:
            x (float): 最寄駅の情報を取得したい場所の経度
            y (float): 最寄駅の情報を取得したい場所の緯度

        Returns:
            str: 指定座標から最寄りの駅名の文字列
            str: 最寄りの駅と指定の座標との距離
        """

        params = {
            "x": x,
            "y": y
        }

        try:
            response = requests.get(cls.base_url, params=params)
            response.raise_for_status()  # HTTPエラーをチェック
            data = response.json()
            if len(stations := data['response']['station']) >= 1:
                distance = stations[0]['distance']
                station_name = stations[0]['name']
                # print(station_name, distance)
                return {"station": station_name, "distance": distance}
        except:
            pass

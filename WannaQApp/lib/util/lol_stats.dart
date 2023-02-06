// To parse this JSON data, do
//
//     final lolStats = lolStatsFromJson(jsonString);

import 'dart:convert';

LolStats lolStatsFromJson(String str) => LolStats.fromJson(json.decode(str));

String lolStatsToJson(LolStats data) => json.encode(data.toJson());

class LolStats {
  LolStats({
    required this.id,
    required this.summonername,
    required this.summonerId,
    required this.accountId,
    required this.puuid,
    required this.summonerLevel,
    required this.ranksoloq,
    required this.pointsoloq,
    required this.rankflex,
    required this.pointflex,
    required this.winssoloq,
    required this.winsflex,
    required this.lossesoloq,
    required this.lossflex,
    required this.timestamp,
  });

  String id;
  String summonername;
  String summonerId;
  String accountId;
  String puuid;
  int summonerLevel;
  String ranksoloq;
  int pointsoloq;
  dynamic rankflex;
  dynamic pointflex;
  int winssoloq;
  dynamic winsflex;
  int lossesoloq;
  dynamic lossflex;
  DateTime timestamp;

  factory LolStats.fromJson(Map<String, dynamic> json) => LolStats(
    id: json["id"],
    summonername: json["summonername"],
    summonerId: json["summonerId"],
    accountId: json["accountId"],
    puuid: json["puuid"],
    summonerLevel: json["summonerLevel"],
    ranksoloq: json["ranksoloq"],
    pointsoloq: json["pointsoloq"],
    rankflex: json["rankflex"],
    pointflex: json["pointflex"],
    winssoloq: json["winssoloq"],
    winsflex: json["winsflex"],
    lossesoloq: json["lossesoloq"],
    lossflex: json["lossflex"],
    timestamp: DateTime.parse(json["timestamp"]),
  );

  Map<String, dynamic> toJson() => {
    "id": id,
    "summonername": summonername,
    "summonerId": summonerId,
    "accountId": accountId,
    "puuid": puuid,
    "summonerLevel": summonerLevel,
    "ranksoloq": ranksoloq,
    "pointsoloq": pointsoloq,
    "rankflex": rankflex,
    "pointflex": pointflex,
    "winssoloq": winssoloq,
    "winsflex": winsflex,
    "lossesoloq": lossesoloq,
    "lossflex": lossflex,
    "timestamp": timestamp.toIso8601String(),
  };

  // List<LolStats> parseStats(String){
  //
  // }
}

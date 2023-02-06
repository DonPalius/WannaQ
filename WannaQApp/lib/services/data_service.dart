import 'dart:convert';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:http/http.dart' as http;

class DataService{
  FirebaseFirestore db = FirebaseFirestore.instance;


  removeFriend(String friendName, String friendId, dynamic friends, String myName) async {
    friends.removeWhere((key, value) => key == friendName && value == friendId);
    String userId = FirebaseAuth.instance.currentUser!.uid;
    String name = FirebaseAuth.instance.currentUser!.displayName ?? '';
    db.collection("users").doc(userId).update(
        {
          "friendsList": friends
        }
    );
    dynamic f = await db.collection("users").doc(friendId).get();
    final fFriends =f!['friendsList'];
    fFriends.removeWhere((key, value) => key == myName && value == userId);
    db.collection("users").doc(friendId).update(
        {
          "friendsList": fFriends
        }
    );
  }


  Future<List<String>> getFriendsUrls(List<String> ids) async{
    List<String> urls = [];
    for(var i in ids){
      String url = await DataService().getFriendPicUrl(i);
      urls.add(url);
    }
    return urls;
  }

  Future<String> getFriendPicUrl(String id) async {
    String url = "";
    await db.collection("users").doc(id).get().then((value) {
      url = value.data()!["photoURL"];
      return url;
    });
    return url;
  }


  getFriendSnapshot(String fId) async {
    return await db.collection("users").doc(fId).get();
  }


  getUserSnapshot() async {
    String userId = FirebaseAuth.instance.currentUser!.uid;
    return await db.collection("users").doc(userId).get();
  }


  addUser(String name, String email) async{
    final user = <String, dynamic>{
      "nickName": name,
      "email": email,
      "photoURL": FirebaseAuth.instance.currentUser!.photoURL,
      "apexNickname": "",
      "leagueNickname": "",
      "friendsList": {},
      "pending": {},
      "bio": ""

    };
    String userId = FirebaseAuth.instance.currentUser!.uid;
    db.collection("users").doc(userId).set(user);
  }


  Future<String> getBio() async {
    String bio = "";
    String userId = FirebaseAuth.instance.currentUser!.uid;
    await db.collection("users").doc(userId).get().then((value) {
      //print(value.data()!["bio"]);
      for (var b in value.data()!["bio"]) {
        bio = b;
      }
      return bio;
    });
    return bio;  }

  Future<String> getNameById(String id) async {

    final res = await db.collection("users").doc(id).get();
    String name = res.data()!["nickname"];
    return name;}

  getUsers() async {
    await db.collection("users").get().then((event) {
      for (var doc in event.docs) {
        //print("${doc.id} => ${doc.data()}");
      }
    });
  }


  Future<String> getLolName(String id) async{
    final res = await db.collection("users").doc(id).get();
      String lolName = res.data()!["leagueNickname"];
      return lolName;
  }


  Future<String> getApexName() async{
    String userId = FirebaseAuth.instance.currentUser!.uid;
    final res = await db.collection("users").doc(userId).get();
    String apexName = res.data()!["apexNickname"];
    return apexName;
  }


  setLeagueUser(leagueName) async {
    try{
      String token = await FirebaseAuth.instance.currentUser!.getIdToken();
      final response = await http.post(
        Uri.parse('http://192.168.1.2:8082/api/v1/league/registerNewUser/$leagueName'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer $token',
        },);
      if(response.statusCode != 200){
        print(response.body);
        print('HTTP ERROR set league user');
        return "";
      }

      else{
        print(response.statusCode);
        return response.body;
      }
    }
    catch(e){
      print(e);
    }
  }

  updateLeagueUser(String oldLeagueName, String newLeagueName) async {
    try{

      String token = await FirebaseAuth.instance.currentUser!.getIdToken();
      final response = await http.put(
        Uri.parse('http://192.168.1.2:8082/api/v1/league/updateSummonerName/'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer $token',

        },
        body: jsonEncode(<String, String>{
          'oldSummonerName': oldLeagueName,
          'newSummonerName': newLeagueName,

        }),

      );
      if(response.statusCode != 200){
        print(response.body);
        print('HTTP ERROR afasfafa');
        print(response.statusCode);
        return "";
      }
      else{
        print("Put OK");
      }
    }
    catch(e){
      print(e);
    }
  }


  setApexUser(apexName) async {
    try{
      String token = await FirebaseAuth.instance.currentUser!.getIdToken();
      final response = await http.post(
        Uri.parse('http://192.168.1.2:8082/api/v1/apex/registerNewUser/$apexName'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer $token',
        },);
      if(response.statusCode != 200){
        print(response.body);
        print('HTTP ERROR set apex');
        return "";
      }
      else{
        print(response.body);
        return response.body;
      }
    }
    catch(e){
      print(e);
    }
  }

  updateApexUser(String oldApexName, String newApexName) async {
    try{
      String token = await FirebaseAuth.instance.currentUser!.getIdToken();
      final response = await http.put(
        Uri.parse('http://192.168.1.2:8082/api/v1/apex/updateNickName/'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(<String, String>{
          'oldApexNickName': oldApexName,
          'newApexNickName': newApexName,
        }),
      );
      if(response.statusCode != 200){
        print(response.body);
        print('HTTP ERROR update apex');
        return "";
      }
      else{
        print("Put OK");
      }
    }
    catch(e){
      print(e);
    }
  }

  getLeagueStats(String leagueName) async {
    String token = await FirebaseAuth.instance.currentUser!.getIdToken();
    try{
      final response = await http.get(
        Uri.parse('http://192.168.1.2:8082/api/v1/league/$leagueName'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer $token',
        },);
      if(response.statusCode != 200){
        print(response.body);
        print('HTTP ERROR get league stats');
        return "";
      }
      else{
        print(response.body);
        return response.body;
      }
    }
    catch(e){
      // print(e);
      return '';
    }
  }


  getApexStats(String apexName) async {
    String token = await FirebaseAuth.instance.currentUser!.getIdToken();
    try{
      final response = await http.get(
        Uri.parse('http://192.168.1.2:8082/api/v1/apex/$apexName'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer $token',

        },);
      if(response.statusCode != 200){
        print(response.body);
        print('HTTP ERROR get apex stats');
        return "";
      }
      else{
        print(response.body);
        return response.body;
      }
    }
    catch(e){
      print(e);
    }
  }


  getLeagueMatch(String type) async {
    String token = await FirebaseAuth.instance.currentUser!.getIdToken();

      try{
        final response = await http.get(
          Uri.parse('http://192.168.1.2:8082/api/v1/league/find-mate/soloQ'),
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer $token',
          },);
        if(response.statusCode != 200){
          print(response.body);
          print('HTTP ERROR lol match');
          return "";
        }
        else{
          return jsonDecode(response.body);
        }
      }
      catch(e){
        print(e);
      }

    // if(type == "solo"){
    //   try{
    //     final response = await http.get(
    //       Uri.parse('http://192.168.1.2:8082/api/v1/league/find-mate/flexQ'),
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json',
    //         'Authorization': 'Bearer $token',
    //       },);
    //     print(response.statusCode);
    //     if(response.statusCode != 200){
    //       print(response.body);
    //       print('HTTP ERROR');
    //       return "";
    //     }
    //     else{
    //       print(response.body);
    //       return response.body;
    //     }
    //   }
    //   catch(e){
    //     print(e);
    //   }
    // }

  }


   leagueExists() async {

  }
}
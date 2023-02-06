import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';



class GamesPlayed extends StatefulWidget{
  final String? friendId;
   const GamesPlayed( {Key? key, required this.friendId}) : super(key: key);
   // final String? friendId;

  @override
  _GamesPlayedState createState() => _GamesPlayedState();

}

class _GamesPlayedState extends State<GamesPlayed> {


  FirebaseFirestore db = FirebaseFirestore.instance;

  String? get friendId => null;
  


  @override
  Widget build(BuildContext context) {
    print(widget.friendId);
    return FutureBuilder<DocumentSnapshot>(
        future: db.collection("users").doc(widget.friendId).get(),
        builder: (BuildContext context,
            AsyncSnapshot<DocumentSnapshot> snapshot) {
          if (snapshot.hasError) {
            return const Text(
              "Something went wrong (snapshot.hasError)", style: TextStyle(
              color: Colors.white,
            ),);
          }

          if (snapshot.hasData && !snapshot.data!.exists) {
            print(snapshot.data!.exists);
            return const Text("Document does not exist", style: TextStyle(
              color: Colors.white,
            ),);
          }

          if (snapshot.connectionState == ConnectionState.done) {
            final data = snapshot.data;
            List<String> gamesPlayed = ["This user has not added any games yet"];
            if (data!["apexNickname"] != null && data["apexNickname"] != "") {
              // print(data["apexNickname"]);
              // print("dentro if apex");
              if (gamesPlayed[0] == "This user has not added any games yet") {
                gamesPlayed.removeAt(0);
              }
              gamesPlayed.add("Apex Legends");
            }
            if (data["leagueNickname"] != null &&
                data["leagueNickname"] != "") {
              if (gamesPlayed[0] == "This user has not added any games yet") {
                gamesPlayed.removeAt(0);
              }
              gamesPlayed.add("League of Legends");
            }
            return Text(
              gamesPlayed.join(", "), style: TextStyle(color: Colors.white54, fontSize: 13,));
          }

          return const Center(
            child: CircularProgressIndicator(
              color: Colors.white,
            ),
          );
          // Text("tmp", style: TextStyle(color: Colors.white54),);
        });
  }
}





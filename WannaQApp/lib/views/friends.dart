// ignore_for_file: library_private_types_in_public_api

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:wannaqapp/views/friend_profile.dart';
import '../util/search_delegate.dart';
import '../services/data_service.dart';
import '../widgets/games_played.dart';
import '../widgets/nav_bar.dart';

class Friends extends StatefulWidget {
  const Friends({Key? key}) : super(key: key);

  @override
  _FriendsState createState() => _FriendsState();
}

class _FriendsState extends State<Friends> {
  FirebaseFirestore db = FirebaseFirestore.instance;
  String userId = FirebaseAuth.instance.currentUser!.uid;



  String selectedFriend = '';
  List<String> f =[];
  List<String> ff =[];
  List<String> urls =[];
  List<String> fIds =[];



  @override
  Widget build(BuildContext context) {


    return Scaffold(
      backgroundColor: Colors.black,
        drawer: const NavBar(),
        appBar: AppBar(
          backgroundColor: Colors.black,
          title: const Text('Friends',
            style: TextStyle(
              color: Colors.white,
            ),
          ),
          centerTitle: true,
          actions: <Widget>[
            IconButton(
              icon: const Icon(
                Icons.search,
              ),
              onPressed: () async {
                selectedFriend = (
                    await showSearch(
                        context: context, delegate: MySearchDelegate(
                        f, ff),
                    )
                )!;
              },
            ),
          ],
        ),
         body: FutureBuilder<DocumentSnapshot>(
           future: db.collection("users").doc(userId).get(),
           builder: (BuildContext context, AsyncSnapshot<DocumentSnapshot> snapshot)  {

             if (snapshot.hasError) {
               print(snapshot.error);
               return const Text("Something went wrong (snapshot.hasError)", style: TextStyle(
                 color: Colors.white,
               ),);
             }

             if (snapshot.hasData && !snapshot.data!.exists) {
               return const Text("Document does not exist", style: TextStyle(
                 color: Colors.white,
               ),);
             }

             if (snapshot.connectionState == ConnectionState.done) {

               final data = snapshot.data;
                final fMap = data!["friendsList"];
                final friendsNames =  data["friendsList"]?.keys.toList();
                final friendsIds =  data["friendsList"]?.values.toList();
                final myName = data["nickname"];




               return ListView.builder(
               itemCount: friendsNames.length,
               itemBuilder: (context, index) {
                 return ListTile(
                   // leading: CircleAvatar(
                   //
                   //   child: ClipOval(
                   //     child: Image.network(,
                   //       height: 125,
                   //       width: 125,
                   //       fit: BoxFit.cover,),
                   //   ),
                   // ),
                   title: Text(friendsNames[index],
                     style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 18),),
                   subtitle:  GamesPlayed(friendId: friendsIds[index].toString(),),
                   onTap: () async {
                     String fUrl = await DataService().getFriendPicUrl(friendsIds[index].toString() );

                     Navigator.push(
                       context,
                       MaterialPageRoute(builder: (context) =>  FriendProfile(
                         friendPicUrl: fUrl,
                         friendName: friendsNames[index].toString(),
                         friendId: friendsIds[index].toString(),)),
                     );
                   },
                   trailing: Row(
                     mainAxisSize: MainAxisSize.min,
                     children: [

                       IconButton(onPressed: () {}, icon: const Icon(
                         Icons.videogame_asset_outlined, color: Colors.white,),
                         tooltip: "Send Invite", ),
                       IconButton(onPressed: () {
                         showDialog(context: context, builder: (_) => AlertDialog(
                           title: Text("Are you sure you want to remove ${friendsNames[index]} from your Friends?",
                             style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                           ),
                           actions: <Widget>[
                             TextButton(
                               child: const Text('Cancel', style: TextStyle(color: Colors.black),),
                               onPressed: () {
                                 Navigator.of(context).pop();
                               },
                             ),
                             TextButton(
                               child: const Text('Confirm', style: TextStyle(color: Colors.black),),
                               onPressed: () async {
                                 DataService().removeFriend(friendsNames[index], friendsIds[index], fMap, myName);
                                 Navigator.of(context).pop();
                                 setState(() {
                                 });
                               },
                             ),
                           ],
                         ),
                         );
                       }, icon: const Icon(
                           Icons.highlight_remove, color: Colors.white),
                         tooltip: "Remove from Friends",),
                     ],
                   ),

                 );
               },
             );
             }
             return const Center(
               child: CircularProgressIndicator(
                 color: Colors.white,
               ),
             );
           }
         )




    );
  }
}




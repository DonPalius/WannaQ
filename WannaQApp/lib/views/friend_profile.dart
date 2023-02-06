// ignore_for_file: unused_import, library_private_types_in_public_api

import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import '../widgets/about.dart';
import '../widgets/about_friend.dart';
import '../widgets/bio.dart';
import '../widgets/friend_bio.dart';
import '../widgets/nav_bar.dart';
import '../services/auth_service.dart';
import '../widgets/profile_picture.dart';
import '../widgets/settings.dart';
import '../widgets/stats.dart';

class FriendProfile extends StatefulWidget {
  final String friendId;
  final String friendName;
  final String friendPicUrl;

   const FriendProfile({
    Key? key,
    required this.friendName,
    required this.friendId,
    required this.friendPicUrl,
  }) : super(key: key);


  @override
  _FriendProfileState createState() => _FriendProfileState();
}
class _FriendProfileState extends State<FriendProfile> {

  @override
  Widget build(BuildContext context) {
    return Scaffold(

        appBar: AppBar(
          actions: [IconButton(icon: Icon(Icons.arrow_back_rounded), onPressed: () {
            Navigator.of(context).pop();},),],
          backgroundColor: Colors.black,
          title: Text(widget.friendName,
            style: const TextStyle(
              color: Colors.white,
            ),
          ),
          centerTitle: true,
        ),
        body: Container(
          color: Colors.black,
          child: Center(
            child: Column(
              children: [
                const SizedBox(height: 25,),
                ProfilePicture(url: widget.friendPicUrl,),
                const SizedBox(height: 25,),
                AboutF(name: widget.friendName.toString()),
                SizedBox(
                  child: FriendBio(id: widget.friendId,),
                ),
                SizedBox(height: 15,),

                const SizedBox(height: 25,),
                Text("${widget.friendName} 's stats",
                  style: TextStyle(
                      color: Colors.white, fontSize: 22,
                      fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 25,),

                const SizedBox(height: 25,),
                Stats(id: widget.friendId)



              ],
            ),
          ),
        )
    );


  }
}




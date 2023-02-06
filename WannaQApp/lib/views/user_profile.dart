// ignore_for_file: unused_import, library_private_types_in_public_api

import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import '../widgets/about.dart';
import '../widgets/bio.dart';
import '../widgets/nav_bar.dart';
import '../services/auth_service.dart';
import '../widgets/profile_picture.dart';
import '../widgets/settings.dart';
import '../widgets/stats.dart';

class UserProfile extends StatefulWidget {
  const UserProfile({Key? key}) : super(key: key);


  @override
  _UserProfileState createState() => _UserProfileState();
}
class _UserProfileState extends State<UserProfile> {

  @override
  Widget build(BuildContext context) {
    final String userId = FirebaseAuth.instance.currentUser!.uid;
    return Scaffold(
      drawer: const NavBar(),
      appBar: AppBar(
      backgroundColor: Colors.black,
      title: Text(FirebaseAuth.instance.currentUser!.displayName!,
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
              ProfilePicture(url: FirebaseAuth.instance.currentUser!.photoURL.toString(),),
              const SizedBox(height: 25,),
              const About(),
              const SizedBox(
                child: Bio(),
              ),
              SizedBox(height: 15,),

              Settings(),
              const SizedBox(height: 25,),
              const Text("See your stats",
                style: TextStyle(
                    color: Colors.white, fontSize: 22,
                    fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 25,),

              const SizedBox(height: 25,),
              Stats(id: userId,)



            ],
          ),
        ),
      )
    );


  }
}




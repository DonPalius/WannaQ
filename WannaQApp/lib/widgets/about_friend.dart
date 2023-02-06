import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class AboutF extends StatefulWidget{
  const AboutF({Key? key, required this.name}) : super(key: key);
  final String name;



  @override
  _AboutFState createState() => _AboutFState();
}

class _AboutFState extends State<AboutF>{
  @override
  Widget build(BuildContext context) {

    FirebaseFirestore db = FirebaseFirestore.instance;
    final users = db.collection("users");
    // final String userId = FirebaseAuth.instance.currentUser!.uid;



    return Text("About ${widget.name}", style: const TextStyle(
        color: Colors.white, fontSize: 22,
        fontWeight: FontWeight.bold),);

  }


}
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class About extends StatefulWidget{
  const About({Key? key}) : super(key: key);

  @override
  _AboutState createState() => _AboutState();
}

class _AboutState extends State<About>{
  @override
  Widget build(BuildContext context) {

    FirebaseFirestore db = FirebaseFirestore.instance;
    final users = db.collection("users");
    final String userId = FirebaseAuth.instance.currentUser!.uid;

    return FutureBuilder<DocumentSnapshot>(
        future: users.doc(userId).get(),
        builder: (BuildContext context, AsyncSnapshot<DocumentSnapshot> snapshot){
          if (snapshot.hasError) {
            return const Text("Something went wrong (snapshot.hasError)",
              style: TextStyle(color: Colors.white,),
            );
          }

          if (snapshot.hasData && !snapshot.data!.exists) {
            return const Text("Document does not exist",
              style: TextStyle(color: Colors.white,),
            );
          }

          if (snapshot.connectionState == ConnectionState.done) {
            Map<String, dynamic> data = snapshot.data!.data() as Map<String, dynamic>;


            return Text("About ${data["nickName"]}", style: const TextStyle(
                color: Colors.white, fontSize: 22,
                fontWeight: FontWeight.bold),);

          }
          return const Center(child:  CircularProgressIndicator(
            color: Colors.black,
          ),);
        });
  }


}
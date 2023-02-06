import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class FriendBio extends StatefulWidget{
  const FriendBio({Key? key, required this.id}) : super(key: key);
  final String id;
  @override
  _FriendBioState createState() => _FriendBioState();
}

class _FriendBioState extends State<FriendBio>{



  @override
  Widget build(BuildContext context) {
    FirebaseFirestore db = FirebaseFirestore.instance;
    final users = db.collection("users");



    return FutureBuilder<DocumentSnapshot>(
        future: users.doc(widget.id).get(),
        builder: (BuildContext context, AsyncSnapshot<DocumentSnapshot> snapshot){
          if (snapshot.hasError) {
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
            Map<String, dynamic> data = snapshot.data!.data() as Map<String, dynamic>;

            if(data["bio"] != "" && data["bio"] != null){
              final textController = TextEditingController(text: data["bio"] ) ;
              return Center(
                child: Column(
                  children: [
                    const SizedBox(height: 20,),
                    Text("${data["bio"]}",
                      style: TextStyle(color: Colors.white, fontSize: 16),),
                    const SizedBox(height: 20,),

                  ],
                ),
              );
            }

            else {
              return Center(
                child: Column(
                  children: [
                    const SizedBox(height: 20,),

                  ],
                ),
              );

            }
          }
          return const CircularProgressIndicator(
            color: Colors.white,
          );

        });
  }
}
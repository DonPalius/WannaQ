import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class Bio extends StatefulWidget{
  const Bio({Key? key}) : super(key: key);

  @override
  _BioState createState() => _BioState();
}

class _BioState extends State<Bio>{

  // String bio = DataService().getBio();



  @override
    Widget build(BuildContext context) {
    FirebaseFirestore db = FirebaseFirestore.instance;
    final users = db.collection("users");
    final String userId = FirebaseAuth.instance.currentUser!.uid;



    return FutureBuilder<DocumentSnapshot>(
          future: users.doc(userId).get(),
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
                          ElevatedButton(
                            style: ElevatedButton.styleFrom(primary: Colors.white24,),
                              onPressed: () {
                                showDialog(context: context, builder: (_) =>  AlertDialog(
                                  backgroundColor: Colors.white,
                                  title: const Text("Edit your bio ",
                                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),),
                                  content: Column(
                                    children:  [
                                      TextFormField(
                                        cursorColor: Colors.black,
                                        controller: textController,
                                        decoration:  const InputDecoration(
                                          enabledBorder: UnderlineInputBorder(
                                            borderSide: BorderSide(color: Colors.black87),
                                          ),
                                          focusedBorder: UnderlineInputBorder(
                                            borderSide: BorderSide(color: Colors.black87),
                                          ),
                                          labelStyle: TextStyle(color: Colors.black),
                                        ),
                                      ),
                                      const SizedBox(height: 25,),
                                      MaterialButton(
                                        padding: const EdgeInsets.all(10),
                                        color: Colors.black,
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(5)),
                                        child: const Text(
                                          'Confirm',
                                          style: TextStyle(color: Colors.white, fontSize: 15),
                                        ),
                                        onPressed: () {
                                          users.doc(userId).update({"bio": textController.text});
                                          setState(() {});
                                          Navigator.pop(context);
                                        },
                                      ),
                                    ],
                                  ),
                                ),
                                );
                              } ,
                              child: const Text("Edit bio",
                                style: TextStyle(color: CupertinoColors.white,),))
                        ],
                      ),
                    );
                  }

                  else {
                    final textController = TextEditingController(text: "" );
                    return Center(
                      child: Column(
                        children: [

                          const SizedBox(height: 20,),
                          ElevatedButton(
                              style: ElevatedButton.styleFrom(primary: Colors.white24,),
                              onPressed: () {
                                showDialog(context: context, builder: (_) =>  AlertDialog(
                                  backgroundColor: Colors.white,
                                  title: const Text("It seems like you didn't add a bio yet ",
                                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),),
                                  content: Column(
                                    children:  [
                                      const Text("Please, insert your bio below to continue"),
                                      TextFormField(
                                        cursorColor: Colors.black,
                                        controller: textController,
                                        decoration:  const InputDecoration(
                                          enabledBorder: UnderlineInputBorder(
                                            borderSide: BorderSide(color: Colors.black87),
                                          ),
                                          focusedBorder: UnderlineInputBorder(
                                            borderSide: BorderSide(color: Colors.black87),
                                          ),
                                          labelText: 'Enter your bio',
                                          labelStyle: TextStyle(color: Colors.black),
                                        ),
                                      ),
                                      const SizedBox(height: 25,),
                                      MaterialButton(
                                        padding: const EdgeInsets.all(10),
                                        color: Colors.black,
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(5)),
                                        child: const Text(
                                          'Confirm',
                                          style: TextStyle(color: Colors.white, fontSize: 15),
                                        ),
                                        onPressed: () {
                                          users.doc(userId).update({"bio": textController.text});
                                          setState(() {});
                                          Navigator.pop(context);
                                        },
                                      ),
                                    ],
                                  ),
                                ),
                                );
                              } ,
                              child: const Text("Add bio",
                                style: TextStyle(color: CupertinoColors.white,),))
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
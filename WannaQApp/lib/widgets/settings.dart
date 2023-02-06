import 'dart:io';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:wannaqapp/services/data_service.dart';

class Settings extends StatefulWidget{
  const Settings({Key? key}) : super(key: key);

  @override
  _SettingsState createState() => _SettingsState();
}

class _SettingsState extends State<Settings>{






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
                final apexTextController = TextEditingController(
                    text: data["apexNickname"] ) ;
                final leagueTextController = TextEditingController(
                    text: data["leagueNickname"] ) ;
                final nickTextController = TextEditingController(
                    text: data["nickName"] ) ;

                return ElevatedButton(
                                    style: ElevatedButton.styleFrom(primary: Colors.white24,),
                                      onPressed: () async {
                                      String leagueOld = await DataService().getLolName(userId);
                                      String apexOld = await DataService().getApexName();
                                        showDialog(context: context, builder: (_) =>  AlertDialog(
                                          scrollable: true,
                                          backgroundColor: Colors.white,
                                          title: const Text("Manage your usernames ",
                                          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),),
                                          content: Column(
                                          children:  [
                                            const Text("Enter your WannaQ nickname"),
                                            TextFormField(
                                              cursorColor: Colors.black,
                                              controller: nickTextController,
                                              decoration:  const InputDecoration(
                                              enabledBorder: UnderlineInputBorder(
                                              borderSide: BorderSide(color: Colors.black87),),
                                              focusedBorder: UnderlineInputBorder(
                                              borderSide: BorderSide(color: Colors.black87),),
                                              labelText: 'WannaQ nickname',
                                              labelStyle: TextStyle(color: Colors.black),),),
                                            const SizedBox(height: 25,),
                                            const Text("Enter your Apex Legends nickname"),
                                            TextFormField(
                                              cursorColor: Colors.black,
                                              controller: apexTextController,
                                              decoration:  const InputDecoration(
                                              enabledBorder: UnderlineInputBorder(
                                              borderSide: BorderSide(color: Colors.black87),),
                                              focusedBorder: UnderlineInputBorder(
                                              borderSide: BorderSide(color: Colors.black87),),
                                              labelText: 'Apex nickname',
                                              labelStyle: TextStyle(color: Colors.black),),),
                                            const SizedBox(height: 25,),
                                            const Text("Enter your League of Legends nickname"),
                                            TextFormField(
                                              cursorColor: Colors.black,
                                              controller: leagueTextController,
                                              decoration:  const InputDecoration(
                                              enabledBorder: UnderlineInputBorder(
                                              borderSide: BorderSide(color: Colors.black87),),
                                              focusedBorder: UnderlineInputBorder(
                                              borderSide: BorderSide(color: Colors.black87),),
                                              labelText: 'League of Legends nickname',
                                              labelStyle: TextStyle(color: Colors.black),),),
                                            const SizedBox(height: 25,),
                                            MaterialButton(
                                              padding: const EdgeInsets.all(10),
                                              color: Colors.black,
                                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(5)),
                                              child: const Text('Confirm',
                                                      style: TextStyle(color: Colors.white,
                                                          fontSize: 15),),
                                              onPressed: () async {
                                                  users.doc(userId).update({"nickName": nickTextController.text});
                                                  users.doc(userId).update({"apexNickname": apexTextController.text});
                                                  // try{
                                                  //   await DataService().updateApexUser(apexOld, apexTextController.text);
                                                  // } on HttpException catch(e){
                                                  //   await DataService().setApexUser(apexTextController.text);
                                                  // }

                                                  users.doc(userId).update({"leagueNickname": leagueTextController.text});
                                                  try{
                                                    await DataService().updateLeagueUser(leagueOld, leagueTextController.text);
                                                  } on HttpException catch(e){
                                                    await DataService().setLeagueUser(leagueTextController.text);
                                                  }
                                                  setState(() {});
                                                  Navigator.pop(context);
                                                },
                                            ),
                                          ],
                                        ),
                                      ),
                                    );
                                  } ,
                                    child: const Text("Edit Profile",
                                    style: TextStyle(color: CupertinoColors.white,),));

            }
            return const Center(child:  CircularProgressIndicator(
              color: Colors.black,
            ),);
    });
  }
}






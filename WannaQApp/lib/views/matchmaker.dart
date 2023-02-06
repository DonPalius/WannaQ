// ignore_for_file: library_private_types_in_public_api


import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:dropdown_button2/dropdown_button2.dart';
import 'package:wannaqapp/services/data_service.dart';
import 'package:wannaqapp/views/lol_flex_match.dart';


import '../widgets/nav_bar.dart';
import 'lol_solo_match.dart';

class Matchmaker extends StatefulWidget {
  const Matchmaker({Key? key}) : super(key: key);

  @override
  _MatchmakerState createState() => _MatchmakerState();
}

class _MatchmakerState extends State<Matchmaker> {
  int initialIndex = 0;
  final textController = TextEditingController();
  final List<String> items = [
    'Apex Legends',
    'League of Legends',
  ];

  String? selectedValue;

  @override
  Widget build(BuildContext context) {
    FirebaseFirestore db = FirebaseFirestore.instance;
    final users = db.collection("users");
    final String userId = FirebaseAuth.instance.currentUser!.uid;


    return Scaffold(
      backgroundColor: Colors.black,
      drawer: const NavBar(),
      appBar: AppBar(
        title: const Text("Matchmaker"),
        backgroundColor: Colors.black,
        centerTitle: true,

      ),
      body: FutureBuilder<DocumentSnapshot>(
        future: users.doc(userId).get(),
        builder:
            (BuildContext context, AsyncSnapshot<DocumentSnapshot> snapshot) {

          if (snapshot.hasError) {
            return const Text("Something went wrong", style: TextStyle(
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



            return Center(
              child: Column(
                children: [
                  const SizedBox(height: 20,),
                  DropdownButtonHideUnderline(

                    child: DropdownButton2(
                      focusColor: Colors.black,
                      barrierColor: Colors.black87,
                      barrierLabel: "Select a game",
                      isExpanded: true,
                      hint: const Text(
                        'Select a Game',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      items: items
                          .map((item) =>
                          DropdownMenuItem<String>(

                            value: item,

                            child: Text(
                              item,
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                          ))
                          .toList(),
                      value: selectedValue,
                      dropdownDecoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(14),
                        color: Colors.white10,
                      ),

                      onChanged: (value) async {
                        setState(() {});
                          selectedValue = value as String;

                        /***
                         * Apex branch
                         * */
                          if(selectedValue == 'Apex Legends' ){
                            /***
                             * the apex username is not set yet, ask input
                             * */
                            if (data["apexNickname"] == null || data["apexNickname"] == ""){
                              showDialog(context: context, builder: (_) =>  AlertDialog(
                                backgroundColor: Colors.white,
                                title: const Text("It seems like you didn't add your Apex username yet ", style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),),
                                content: Column(
                                  children:  [
                                  const Text("Please, insert your apex username below to continue"),
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
                                      labelText: 'Enter your Apex Legends username',
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
                                      users.doc(userId).update({"apexNickname": textController.text});
                                      setState(() {selectedValue = value;});
                                      Navigator.pop(context);
                                    },
                                  ),
                                ],
                              ),
                            ),
                            );
                          }
                            /***
                             * the apex username is set, show matchmaking
                             * */
                            else {
                              showDialog(context: context, builder: (_) =>  const AlertDialog(
                                title: Text("PLACEHOLDER FOR ACTUAL MATCHMAKING ",
                                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),),
                              ),
                              );
                            }
                          }

                          /***
                           * LOL branch
                           * */
                          if (selectedValue == "League of Legends"){
                            /***
                             * the LOL username is not set yet,
                             * */
                            if (data["leagueNickname"] == null || data["leagueNickname"] == ""){
                              showDialog(context: context, builder: (_) =>  AlertDialog(
                                title: const Text("It seems like you didn't add your LoL username yet ", style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),),
                                content: Column(
                                  children:  [
                                    const Text("Please, insert your League of Legends username below to continue"),
                                    TextFormField(
                                      cursorColor: Colors.black,
                                      controller: textController,
                                      decoration: const InputDecoration(
                                        enabledBorder: UnderlineInputBorder(
                                          borderSide: BorderSide(color: Colors.black87),
                                        ),
                                        focusedBorder: UnderlineInputBorder(
                                          borderSide: BorderSide(color: Colors.black87),
                                        ),
                                        labelStyle: TextStyle(color: Colors.black),

                                        labelText: 'Enter your League of Legends username',
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
                                        users.doc(userId).update({"leagueNickname": textController.text});
                                        setState(() {selectedValue = value;});
                                        Navigator.pop(context);
                                      },
                                    ),
                                  ],
                                ),
                              ),
                              );
                            }

                            /***
                             * the LOL username is set, show matchmaking
                             * */
                            else{

                              showDialog(context: context, builder: (_) =>  AlertDialog(
                                backgroundColor: Colors.transparent,
                                insetPadding: EdgeInsets.all(10),
                                title: const Text("Select the Game Mode you want to play",
                                  style: TextStyle(color: Colors.white,fontSize: 24, fontWeight: FontWeight.bold),),
                                content: Row(
                                  children:  [
                                    const SizedBox(width: 15),
                                    MaterialButton(
                                      padding: const EdgeInsets.all(10),
                                      color: Colors.black,
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(5)),
                                      child: const Text(
                                        'SoloQ',
                                        style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                                      ),
                                      onPressed: () async {
                                        final matches = await DataService().getLeagueMatch("solo");
                                        int i = 0;
                                        List <String> urls = [];
                                        while(i < matches.length){
                                          String url = await DataService().getFriendPicUrl(matches[i]['id']);
                                          urls.add(url);
                                          i++;
                                        }
                                        Navigator.push(
                                          context,
                                          MaterialPageRoute(builder: (context) =>  LolSoloMatch(matches: matches, urls: urls,
                                          ),
                                          ),
                                        );
                                      },
                                    ),
                                    const SizedBox(width: 125),
                                    MaterialButton(
                                      padding: const EdgeInsets.all(10),
                                      color: Colors.black,
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(5)),
                                      child: const Text(
                                        'FlexQ',
                                        style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                                      ),
                                      onPressed: () async {
                                        final matches = await DataService().getLeagueMatch("flex");
                                        int i = 0;
                                        List <String> urls = [];
                                        while(i < matches.length){
                                          String url = await DataService().getFriendPicUrl(matches[i]['id']);
                                          urls.add(url);
                                          i++;
                                        }
                                        Navigator.push(
                                          context,
                                          MaterialPageRoute(builder: (context) =>  LolFlexMatch(matches: matches, urls: urls,
                                          ),
                                          ),
                                        );
                                      },
                                    ),
                                  ],
                                ),
                              ),
                              );


                 

                              // showDialog(context: context, builder: (_) =>   AlertDialog(
                              //   title: Text("LoL Matchmaker ",
                              //     style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),),
                              //   content: SizedBox(
                              //     height: 400.0, // Change as per your requirement
                              //     width: 400.0,
                              //     child:
                              //     ListView.separated(
                              //         itemCount: matches.length,
                              //         separatorBuilder: (context, index) {
                              //         return Divider(
                              //           thickness: 2,
                              //           );
                              //         },
                              //
                              //         itemBuilder: (context, index)  {
                              //
                              //           return Card(
                              //             child: ListTile(
                              //               shape: RoundedRectangleBorder(
                              //                 side: BorderSide(width: 2),
                              //                 borderRadius: BorderRadius.circular(20),
                              //               ),
                              //               leading:  Column(
                              //                 children: [
                              //                   InkWell(
                              //                     onTap: () async {
                              //                       String name = await DataService().getNameById(matches[index]['id']);
                              //                       Navigator.push(
                              //                         context,
                              //                         MaterialPageRoute(builder: (context) =>  FriendProfile(
                              //                             friendPicUrl: urls[index],
                              //                             friendName: name,
                              //                             friendId: matches[index]['id']),
                              //                         ),
                              //                       );
                              //                     },
                              //                     child: CircleAvatar(
                              //
                              //                       child: ClipOval(
                              //                         child: Image.network(urls[index],
                              //                           height: 125,
                              //                           width: 125,
                              //                           fit: BoxFit.cover,),
                              //                       ),
                              //                     ),
                              //                   )],
                              //               ),
                              //               trailing:  Column(
                              //                 children: [IconButton(onPressed: () {},
                              //                   iconSize: 40,
                              //                   icon: const Icon(
                              //                     Icons.videogame_asset_outlined, color: Colors.black ,),
                              //                   tooltip: "Send Invite", ),
                              //                   IconButton(onPressed: () {},
                              //                     iconSize: 40,
                              //                     icon: const Icon(
                              //                       Icons.person_add, color: Colors.black ,),
                              //                     tooltip: "Add Friend", ),],
                              //               ),
                              //               title: Text(
                              //                   matches[index]['summonername']
                              //                       + "\n Level "
                              //                       + matches[index]['summonerLevel'].toString()),
                              //               subtitle: Text("Rank Solo: " + matches[index]['ranksoloq']
                              //                   + " \n " + "Rank Flex: " + matches[index]['rankflex']),
                              //             ),
                              //           );
                              //         },
                              //       ),
                              //
                              //
                              //   ),
                              // ),
                              // );
                            }

                          }
                      },
                      buttonHeight: 60,
                      buttonWidth: 240,
                      itemHeight: 70,
                    ),
                  ),
                ],
              ),
            );


          }

          return const Center(child:  CircularProgressIndicator(
            color: Colors.black,
          ),);
        },
      ),
    );
  }
}





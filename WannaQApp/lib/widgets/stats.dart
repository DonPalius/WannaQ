import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:dropdown_button2/dropdown_button2.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:wannaqapp/services/data_service.dart';
import 'package:wannaqapp/util/lol_stats.dart';
import '../services/data_service.dart';


class Stats extends StatefulWidget{
  final String id;
  const Stats({Key? key,
  required this.id
  }) : super(key: key);

  @override
  _StatsState createState() => _StatsState();
}

class _StatsState extends State<Stats>{
  final textController = TextEditingController();
  final List<String> items = [
    'Apex Legends',
    'League of Legends',
  ];
  int initialIndex = 0;
  String? selectedValue;



  @override
  Widget build(BuildContext context) {
    FirebaseFirestore db = FirebaseFirestore.instance;
    final users = db.collection("users");
    final String userId = widget.id;

    return DropdownButtonHideUnderline(

      child: DropdownButton2(
        focusColor: Colors.black,
        barrierColor: Colors.black87,
        barrierLabel: "Select Game",
        isExpanded: true,
        hint:  const Text(
          'Select Game',
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
                style:  const TextStyle(
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
          if(selectedValue == 'Apex Legends' ) {
            showDialog(context: context, builder: (_) =>  const AlertDialog(
              title: Text("PLACEHOLDER FOR Apex Legends Stats ", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),),
            ),
            );          }
          /***
           * LOL branch
           * */
          if (selectedValue == "League of Legends"){
            final String lolName = await DataService().getLolName(userId);
            print(lolName);
            if (lolName != ""){
              final res = await DataService().getLeagueStats(lolName);
              print(res);
              if(res == "" && res == null) {
                print('res == "" && res == null');
                showDialog(context: context, builder: (_) =>  const AlertDialog(
                  title: Text("An error has occurred ", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),),
                ),
                );
              }
              else{
                final lolStats = lolStatsFromJson(res);

                showDialog(context: context, builder: (_) =>   AlertDialog(

                  title: Column(
                    children: [
                      Text("SoloQ Stats: ", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),),
                      Table(
                        border: TableBorder.all(),
                        defaultVerticalAlignment: TableCellVerticalAlignment.middle,
                        children:  [
                          const TableRow(
                              children: [
                                TableCell(child: Text(
                                  'Wins SoloQ',
                                  style: TextStyle(fontStyle: FontStyle.italic),
                                ),
                                ),
                                TableCell(child: Text(
                                  'League Points SoloQ',
                                  style: TextStyle(fontStyle: FontStyle.italic),
                                ),
                                ),
                                TableCell(child: Text(
                                  'Rank SoloQ',
                                  style: TextStyle(fontStyle: FontStyle.italic),
                                ),
                                ),
                              ]
                          ),
                          TableRow(
                              children: [
                                TableCell(child: Text(
                                  lolStats.winssoloq.toString(),
                                  style: TextStyle(fontStyle: FontStyle.italic),
                                ),
                                ),
                                TableCell(child: Text(
                                  lolStats.pointsoloq.toString(),
                                  style: TextStyle(fontStyle: FontStyle.italic),
                                ),
                                ),
                                TableCell(child: Text(
                                  lolStats.ranksoloq.toString(),
                                  style: TextStyle(fontStyle: FontStyle.italic),
                                ),
                                ),
                              ]
                          ),
                        ],

                      ),
                      const SizedBox(height: 15,),
                      Text("Flex Stats: ", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),),
                      Table(
                        border: TableBorder.all(),
                        defaultVerticalAlignment: TableCellVerticalAlignment.middle,
                        children:  [
                          const TableRow(
                              children: [
                                TableCell(child: Text(
                                  'Wins Flex',
                                  style: TextStyle(fontStyle: FontStyle.italic),
                                ),
                                ),
                                TableCell(child: Text(
                                  'League Points Flex',
                                  style: TextStyle(fontStyle: FontStyle.italic),
                                ),
                                ),
                                TableCell(child: Text(
                                  'Rank Flex',
                                  style: TextStyle(fontStyle: FontStyle.italic),
                                ),
                                ),
                              ]
                          ),
                          TableRow(
                              children: [
                                TableCell(child: Text(
                                  lolStats.winsflex.toString(),
                                  style: TextStyle(fontStyle: FontStyle.italic),
                                ),
                                ),
                                TableCell(child: Text(
                                  lolStats.pointflex.toString(),
                                  style: TextStyle(fontStyle: FontStyle.italic),
                                ),
                                ),
                                TableCell(child: Text(
                                  lolStats.rankflex.toString(),
                                  style: TextStyle(fontStyle: FontStyle.italic),
                                ),
                                ),
                              ]
                          ),
                        ],

                      ),
                    ],
                  ),
                ),
               );
                 }
              }

            else{
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
                      onPressed: () async {
                        users.doc(userId).update({"leagueNickname": textController.text});
                        await DataService().setLeagueUser(textController.text);
                        setState(() {selectedValue = value;});
                        Navigator.pop(context);
                      },
                    ),
                  ],
                ),
              ),
              );
            }
          }
        },
        buttonHeight: 60,
        buttonWidth: 240,
        itemHeight: 70,
      ),
    );
  }
}


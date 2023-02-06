// ignore_for_file: unused_import, library_private_types_in_public_api

import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import '../services/data_service.dart';
import '../widgets/about.dart';
import '../widgets/bio.dart';
import '../widgets/nav_bar.dart';
import '../services/auth_service.dart';
import '../widgets/profile_picture.dart';
import '../widgets/settings.dart';
import '../widgets/stats.dart';
import 'friend_profile.dart';

class LolFlexMatch extends StatefulWidget {
  dynamic matches;
  List <String> urls;
   LolFlexMatch({
     Key? key,
     required this.matches,
     required this.urls,
   }) : super(key: key);


  @override
  _LolFlexMatchState createState() => _LolFlexMatchState();
}
class _LolFlexMatchState extends State<LolFlexMatch> {
  String lolUrl = "https://cdn.givemesport.com/wp-content/uploads/2022/04/League-of-Legends-Logo-Type.jpg?width=960&aspect_ratio=960:620";
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Scaffold(

        backgroundColor: Colors.black,

        appBar: AppBar(

          backgroundColor: Colors.black,
          title: const Text('Flex Match',
            style: TextStyle(
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
                Center(
                  child: SizedBox(
                      height: 180,
                      width: 250,
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(8.0),
                        child: Image.network(
                          lolUrl,
                          height: 150.0,
                          width: 100.0,
                        ),
                      )
                    ),
                ),
                ListView.separated(
                  scrollDirection: Axis.vertical,
                  shrinkWrap: true,
                  itemCount: widget.matches.length,
                  separatorBuilder: (context, index) {
                    return const Divider(
                      color: Colors.white,
                      thickness: 0.5,
                    );
                  },

                  itemBuilder: (context, index)  {

                    return ListTile(
                        shape: RoundedRectangleBorder(
                          side: BorderSide(width: 2),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        leading:  Column(
                          children: [
                            InkWell(
                              onTap: () async {
                                String name = await DataService().getNameById(widget.matches[index]['id']);
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(builder: (context) =>  FriendProfile(
                                      friendPicUrl: widget.urls[index],
                                      friendName: name,
                                      friendId: widget.matches[index]['id']),
                                  ),
                                );
                              },
                              child: CircleAvatar(

                                child: ClipOval(
                                  child: Image.network(widget.urls[index],
                                    height: 125,
                                    width: 125,
                                    fit: BoxFit.cover,),
                                ),
                              ),
                            )],
                        ),
                        trailing:  Row(
                            mainAxisSize: MainAxisSize.min,
                          children: [IconButton(onPressed: () {},
                            iconSize: 30,
                            icon: const Icon(
                              Icons.videogame_asset_outlined, color: Colors.white ,),
                            tooltip: "Send Invite", ),
                            SizedBox(width: 20,),
                            IconButton(onPressed: () {},
                              iconSize: 30,
                              icon: const Icon(
                                Icons.person_add, color: Colors.white ,),
                              tooltip: "Add Friend", ),],
                        ),
                        title: Text(
                            widget.matches[index]['summonername']
                                + "\nLevel "
                                + widget.matches[index]['summonerLevel'].toString(),
                          style: const TextStyle(color: Colors.white),),
                        subtitle: Text("Rank: " + widget.matches[index]['rankflex'],
                          style: const TextStyle(color: Colors.white),),
                      );
                  },
                ),

              ]),
            ),
            ),
          );
  }


}
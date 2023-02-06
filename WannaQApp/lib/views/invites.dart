// ignore_for_file: library_private_types_in_public_api

import 'package:flutter/material.dart';

import '../widgets/nav_bar.dart';

class Invites extends StatefulWidget{
  const Invites({Key? key}) : super(key: key);

  @override
  _InvitesState createState() => _InvitesState();
}

class _InvitesState extends State <Invites> {

  @override
  Widget build(BuildContext context) {
    List <String> items;
    items = List<String>.generate(20, (i) => 'Invite $i');

    return Scaffold(
        drawer: const NavBar(),
        appBar: AppBar(
          backgroundColor: Colors.black,
          title: const Text('Invites',
            style: TextStyle(
              color: Colors.white,
            ),
          ),
          centerTitle: true,
        ),
        body: ListView.builder(
          itemCount: items.length,
          itemBuilder: (context, index) {
            return ListTile(
              title: Text(items[index]),
            );
          },
        )
    );
  }
}

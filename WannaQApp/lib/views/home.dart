// ignore_for_file: library_private_types_in_public_api

import 'package:flutter/material.dart';
import 'package:google_nav_bar/google_nav_bar.dart';
import 'package:wannaqapp/views/friends.dart';
import 'package:wannaqapp/views/invites.dart';
import 'package:wannaqapp/views/matchmaker.dart';
import 'package:wannaqapp/views/user_profile.dart';
import 'landing_page.dart';

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _selectedIndex = 0; //New
  static  final List<Widget> _pages = <Widget>[
    const LandingPage(),
    const Friends(),
    const Matchmaker(),
    const Invites(),
    const UserProfile(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(


        body: Container(
        color: Colors.white,
        //width: MediaQuery.of(context).size.width,
        child: _pages.elementAt(_selectedIndex),


      ),
      bottomNavigationBar: GNav(
        backgroundColor: Colors.black,
        gap: 8,
        padding: const EdgeInsets.all(17),
        tabs:const [
          GButton(icon: Icons.home,
            iconColor: Colors.white,
            text: 'Home',textColor: Colors.white,),
          GButton(icon: Icons.people_alt, iconColor: Colors.white,
          text: 'Friends', textColor: Colors.white,),
          GButton(icon: Icons.person_add_rounded,
            iconColor: Colors.white,
            text: 'Matchmaker',textColor: Colors.white,),
          GButton(icon: Icons.notifications_active_rounded,
            iconColor: Colors.white,
            text: 'Invites',textColor: Colors.white,),
          GButton(icon: Icons.person,
            iconColor: Colors.white,
            text: 'Profile',textColor: Colors.white,),
        ],
        selectedIndex: _selectedIndex,
        onTabChange: (index) {
          setState(() {
            _selectedIndex = index;
          });
        },
      )
    );

  }
}
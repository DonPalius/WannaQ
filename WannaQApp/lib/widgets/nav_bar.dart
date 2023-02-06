import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../services/auth_service.dart';

class NavBar extends StatelessWidget{
  const NavBar({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Drawer(
      backgroundColor: Colors.black45,
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          UserAccountsDrawerHeader(
              accountName:  Text(FirebaseAuth.instance.currentUser!.displayName!,
                style: TextStyle( color: Colors.white, fontSize: 16),),
              accountEmail: Text(FirebaseAuth.instance.currentUser!.email!,
                style: TextStyle( color: Colors.white, fontSize: 13),),
              currentAccountPicture: CircleAvatar(
                child: ClipOval(
                  child: Image.network(FirebaseAuth.instance.currentUser!.photoURL!,
                    width: 90,
                    height: 90,
                    fit: BoxFit.cover,
                  ),
                ),
              ),
            decoration: const BoxDecoration(
              color: Colors.black,
            ),
          ),
          // ListTile(
          //
          //   leading: const Icon(Icons.settings, color: Colors.white,),
          //   title: const Text('Settings', style: TextStyle( color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),),
          //   onTap: (){
          //    Settings();
          //
          //   },
          // ),
          ListTile(
            leading: const Icon(Icons.logout_rounded,  color: Colors.white,),
            title: const Text('Logout',style: TextStyle( color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),),
            onTap: (){
              AuthService().signOut();
            },
          ),
        ],
      ),
    );
  }
}
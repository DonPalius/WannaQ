// ignore_for_file: no_leading_underscores_for_local_identifiers, use_build_context_synchronously, avoid_print

import 'package:after_layout/after_layout.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:wannaqapp/views/home.dart';
import 'package:wannaqapp/widgets/nav_bar.dart';
class Splash extends StatefulWidget {
  const Splash({Key? key}) : super(key: key);

  @override
  SplashState createState() => SplashState();
}

class SplashState extends State<Splash> with AfterLayoutMixin<Splash> {
  Future checkFirstSeen() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    bool _seen = (prefs.getBool('seen') ?? false);

    if (_seen) {
      Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => const HomePage()));
      print('GOING HOME');
    } else {
      print('GOING splash');
      await prefs.setBool('seen', true);
      Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => const IntroScreen()));
    }
  }

  @override
  void afterFirstLayout(BuildContext context) => checkFirstSeen();

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text('Loading...'),
      ),
    );
  }
}


class IntroScreen extends StatelessWidget {
  const IntroScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return  Scaffold(
      drawer: const NavBar(),
      appBar: AppBar(
        backgroundColor: Colors.black,
        title: const Text('Account Setup',
          style: TextStyle(
            color: Colors.white,
          ),
        ),
        centerTitle: true,
      ),
      body:   Center(
        child: Column(
          children: [
            const SizedBox(height: 20,),

            const Text('Enter your WannaQ username',
              style: TextStyle(
                color: Colors.black,
              ),
            ),
            const SizedBox(height: 20,),
            TextFormField(
              decoration: const InputDecoration(
                border: UnderlineInputBorder(),
                labelText: 'Enter your WannaQ username',
              ),
            ),
            const SizedBox(height: 20,),

            const Text('Enter your Apex Legends username',
              style: TextStyle(
                color: Colors.black,
              ),
            ),
            const SizedBox(height: 20,),
            TextFormField(
              decoration: const InputDecoration(
                border: UnderlineInputBorder(),
                labelText: 'Enter your Apex Legends username',
              ),
            ),
            const SizedBox(height: 20,),
            const Text('Enter your League of Legends username',
              style: TextStyle(
                color: Colors.black,
              ),
            ),
            const SizedBox(height: 20,),
            TextFormField(
              decoration: const InputDecoration(
                border: UnderlineInputBorder(),
                labelText: 'Enter your League of Legends Legends username',
              ),
            ),
            const SizedBox(height: 20,),
             TextButton(
              style: ButtonStyle(backgroundColor: MaterialStateProperty.all(Colors.black),
              ),
              onPressed:() {Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const HomePage()),
              );},
              child: const Text('Continue', style: TextStyle(color: Colors.white, fontSize: 30),),
            ),
          ],
        ),
      ),
    );
  }
}
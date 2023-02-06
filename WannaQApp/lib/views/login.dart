// ignore_for_file: library_private_types_in_public_api

import 'package:flutter/material.dart';
import 'package:flutter_signin_button/flutter_signin_button.dart';

import '../services/auth_service.dart';


class Login extends StatefulWidget {
  const Login({Key? key}) : super(key: key);

  @override
  _LoginState createState() => _LoginState();
}

class _LoginState extends State<Login> {
  @override
  Widget build(BuildContext context) {
    final Size size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        centerTitle: true,
        title: const Text("WannaQ",style: TextStyle(fontSize: 25, fontWeight: FontWeight.bold),),
        backgroundColor: Colors.black,
      ),
      body: Container(
        color: Colors.black,

        child: Center(
          child: Column(
            children: [
              const SizedBox(
                height: 120,
                width: 33,
              ),
              const Text('Sign in with google', style: TextStyle(fontSize: 30, color: Colors.white), ),
              const SizedBox(
                height: 120,
                width: 33,
              ),
              SizedBox(
                child: SignInButton(
                  // shape: ,
                  Buttons.Google,
                  text: "Log or sign in",
                  onPressed: () {
                    AuthService().handleSignIn();
                  },
                ),
              )

            ],
          ),
        )
      ),
    );
  }
}


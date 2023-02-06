import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/cupertino.dart';
import 'package:google_sign_in/google_sign_in.dart';
import '../views/login.dart';
import '../views/home.dart';
import 'data_service.dart';

class AuthService{
  // final Future<SharedPreferences> _prefs = SharedPreferences.getInstance();

  handleAuthState() {
    return StreamBuilder(
        stream: FirebaseAuth.instance.authStateChanges(),
        builder: (BuildContext context, snapshot) {
          if (snapshot.hasData) {
            return const HomePage();
          } else {
            return const Login();
          }
        });
  }

   handleSignIn() async {
    try {
      await signInWithGoogle();
    } catch (error) {
      print(error);
    }
  }

   signInWithGoogle() async {
    // Trigger the authentication flow
    final GoogleSignInAccount? googleUser = await GoogleSignIn(
      scopes: <String>["email"]).signIn();

    // Obtain the auth details from the request
    final GoogleSignInAuthentication? googleAuth = await googleUser?.authentication;
    // Create a new credential
    final credential = GoogleAuthProvider.credential(
      accessToken: googleAuth?.accessToken,
      idToken: googleAuth?.idToken,
    );


    UserCredential authResult = await FirebaseAuth.instance.signInWithCredential(credential);

      if (authResult.additionalUserInfo!.isNewUser){
        DataService().addUser(
            FirebaseAuth.instance.currentUser!.displayName!,
            FirebaseAuth.instance.currentUser!.email!);
      }
     final String lolName = await DataService().getLolName(FirebaseAuth.instance.currentUser!.uid);
      if(lolName != ""){
        await DataService().setLeagueUser(lolName);
      }
      // else{
      //   await DataService().setLeagueUser("demo");
      // }
    // final String apexName = await DataService().getApexName();
    // if(apexName != "" && apexName != 'null'){
    //   await DataService().setApexUser(apexName);
    // }
    // else{
    //   await DataService().setApexUser('demo');
    //
    // }

    return authResult;
  }



  signOut() async{
    await FirebaseAuth.instance.signOut();
    await GoogleSignIn().disconnect();
  }



}


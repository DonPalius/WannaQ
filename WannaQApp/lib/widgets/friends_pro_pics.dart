// import 'package:firebase_auth/firebase_auth.dart';
// import 'package:flutter/cupertino.dart';
// import 'package:flutter/material.dart';
// import 'package:wannaqapp/services/data_service.dart';
//
// class FriendsProfilePicture extends StatefulWidget{
//   final List <String> ids;
//
//   const FriendsProfilePicture({
//     required this.ids,
//   });
//
//   @override
//   _FriendsProfilePictureState createState() => _FriendsProfilePictureState();
// }
//
// class _FriendsProfilePictureState extends State<FriendsProfilePicture>{
//   @override
//   Widget build(BuildContext context) {
//     return FutureBuilder<List<String>>(
//         future: DataService().getFriendsUrls(widget.ids),
//         builder: (BuildContext context, AsyncSnapshot<List<String>> snapshot){
//           if (snapshot.hasError) {
//             return const Text("Something went wrong (snapshot.hasError)", style: TextStyle(
//               color: Colors.white,
//             ),);
//           }
//
//           if (snapshot.hasData && snapshot.data!.isNotEmpty ) {
//             return const Text("Document does not exist", style: TextStyle(
//               color: Colors.white,
//             ),);
//           }
//
//           if (snapshot.connectionState == ConnectionState.done) {
//             return Column(
//               children: [
//                 SizedBox(
//                   height: 125,
//                   width: 125,
//                   child: CircleAvatar(
//                     child: ClipOval(
//                       child: Image.network(snapshot.data![0],
//                         height: 125,
//                         width: 125,
//                         fit: BoxFit.cover,),
//                     ),
//                   ),
//                 ),
//               ],
//             );
//           }
//           return const CircularProgressIndicator(
//             color: Colors.white,
//           );
//
//         });
//
//
//   }
// }
//
//
//
//
//
//
// /*
// * */
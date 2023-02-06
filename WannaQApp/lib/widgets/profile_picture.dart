import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class ProfilePicture extends StatefulWidget{
  final String url;

  ProfilePicture({
   required this.url,
  });

  @override
  _ProfilePictureState createState() => _ProfilePictureState();
}

class _ProfilePictureState extends State<ProfilePicture>{
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
      SizedBox(
      height: 125,
      width: 125,
      child: CircleAvatar(
        child: ClipOval(
          child: Image.network(widget.url,
          height: 125,
          width: 125,
          fit: BoxFit.cover,),
      ),
    ),
    ),
    ],
    );
  }
}






/*
* */
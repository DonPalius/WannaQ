// ignore_for_file: library_private_types_in_public_api, avoid_print

import 'package:flutter/material.dart';
import 'package:toggle_switch/toggle_switch.dart';

class GameSelection extends StatefulWidget{
  const GameSelection({Key? key}) : super(key: key);

  @override
  _GameSelectionState createState() => _GameSelectionState();
  
}

class _GameSelectionState extends State <GameSelection>{
  int initialIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ToggleSwitch(
        minWidth: 180.0,
        minHeight: 90.0,
        cornerRadius: 20.0,
        fontSize: 18.0,
        initialLabelIndex: initialIndex,
        customTextStyles: const [
          TextStyle(
              color: Colors.white,
              fontSize: 18.0,
              fontWeight: FontWeight.w900),
        ],
        activeBgColors: [[Colors.red[800]!], [Colors.indigo[900]!]],
        inactiveBgColor: Colors.grey[400],
        totalSwitches: 2,
        labels: const ['Apex Legends', 'League of Legends'],
        onToggle: (index) {
          print('switched to: $index');
          setState(() {
            initialIndex = index!;
          });
        },
      )
    );

  }
  
}
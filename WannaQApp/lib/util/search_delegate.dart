import 'package:flutter/material.dart';

class MySearchDelegate extends SearchDelegate<String>{

  final List<String> friends;
  final List<String> duplicateFriends;



  MySearchDelegate(this.friends, this.duplicateFriends);


  @override
  List<Widget>? buildActions(BuildContext context) {
    return[
      IconButton(
        // color: Colors.black,
        onPressed: (){
        query = '';
      },
          icon: const Icon(Icons.clear))
    ];
  }

  @override
  Widget? buildLeading(BuildContext context) {
    return IconButton(onPressed: () {
      close(context, query);
    }, icon: const Icon(Icons.arrow_back));
  }

  @override
  Widget buildResults(BuildContext context) {
    final List<String> allFriends = friends.where(
          (friend) => friend.toLowerCase().contains(
        query.toLowerCase(),
      ),
    ).toList();

    return ListView.builder(
      itemCount: allFriends.length,
      itemBuilder: (context, index) => ListTile(
        title: Text(allFriends[index]),
        onTap: (){

        },
      ),
    );
  }

  @override
  Widget buildSuggestions(BuildContext context) {
    final List<String> friendsSuggestions = duplicateFriends.where(
          (friendSuggestion) => friendSuggestion.toLowerCase().contains(
        query.toLowerCase(),
      ),
    ).toList();

    return ListView.builder(
      itemCount: friendsSuggestions.length,
      itemBuilder: (context, index) => ListTile(
        title: Text(friendsSuggestions[index]),
        onTap: (){
          close(context, query);
        },
      ),
    );
  }

}
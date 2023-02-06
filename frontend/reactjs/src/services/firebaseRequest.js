import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getMessaging } from "firebase/messaging";
import { db } from "./firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useId } from "react";

class firebaseRequest {
  setNotifyMsg(MsgRef, messagesRes, usrEmail, usrUid, chatId) {
    // setto come notificati tutti i messaggi presenti nella chat aperta
    // aggiorno il count della chat
    const mapUsr = new Map();
    messagesRes?.docs.map((message) =>
      db
        .collection("chats")
        .doc(chatId)
        .collection("messages")
        .get()
        .then((querySnap) => {
          querySnap.forEach((doc) => {
            if (
              message.data().user !== usrEmail &&
              doc.data().notified === false
            ) {
              mapUsr.set(message.data().user, 0);
              db.collection("chats")
                .doc(chatId)
                .collection("messages")
                .doc(message.id)
                .update({
                  notified: true,
                });
            }
          });
          db.collection("chats")
            .doc(chatId)
            .get()
            .then((doc) => {
              if (doc.data().users.indexOf(usrEmail) === 0) {
                doc.ref.update({
                  notify_0: 0,
                });
              }
              if (doc.data().users.indexOf(usrEmail) === 1) {
                doc.ref.update({
                  notify_1: 0,
                });
              }
            });
        })
    );

    return mapUsr;
  }
  async createChat(name) {
    await db
      .collection("users")
      .where("nickname", "==", name)
      .get()
      .then((querySnap) => {
        querySnap.forEach((doc) => {
          db.collection("chats").add({
            users: [localStorage.getItem("email"), doc.data().email],
            notify_0: 0,
            notify_1: 0,
          });
        });
      });
  }

  async addNewReview(nick, uid, review, rating) {
    let newreview = {};
    let newrating = {};

    await db
      .collection("users")
      .where("nickname", "==", nick)
      .get()
      .then((querySnap) => {
        querySnap.forEach((doc) => {
          newreview = doc.data().review;
          newreview[uid] = review;
          newrating = doc.data().rating;
          newrating[uid] = rating;

          doc.ref.update({
            review: newreview,
          });
          doc.ref.update({
            rating: newrating,
          });
        });
      });
    return newreview;
  }

  async getReview(name) {
    let rst = {};
    await db
      .collection("users")
      .where("nickname", "==", name)
      .get()
      .then((querySnap) => {
        querySnap.forEach((snap) => {
          rst = snap.data().review;
        });
      });
    return rst;
  }

  async getRating(nick) {
    let myRating = {};
    await db
      .collection("users")
      .where("nickname", "==", nick)
      .get()
      .then((querySnap) => {
        querySnap.forEach((doc) => {
          myRating = doc.data().rating;
        });
      });
    if (myRating === 0) {
      return 0;
    } else {
      return (

        Object.values(myRating).reduce((a, b) => a + b, 0) /
        Object.keys(myRating).length
      );
      return (
        Object.values(myRating).reduce((a, b) => a + b, 0) /
        Object.keys(myRating).length
      );
    }
  }

  async addRating(nick, usrRating, value) {
    let myRating = {};
    console.log(nick, " nick", usrRating, value);
    await db
      .collection("users")
      .where("nickname", "==", nick)
      .get()
      .then((querySnap) => {
        querySnap.forEach((doc) => {
          console.log(doc.data());
          if (typeof doc.data().rating !== "undefined") {
            myRating = doc.data().rating;
            myRating[usrRating] = value;
          } else {
            myRating.usrRating = value;
          }

          doc.ref.update({
            rating: myRating,
          });
        });
      });

    return Math.round(
      Object.values(myRating).reduce((a, b) => a + b, 0) /
        Object.keys(myRating).length
    );
  }

  async ChatIds() {
    const MsgRef1 = new Map();
    await db
      .collection("chats")
      .where("users", "array-contains", localStorage.getItem("email"))
      .get()
      .then((doc) => {
        doc.forEach((item) => MsgRef1.set(item.id, item.data().users));
      });

    return MsgRef1;
  }
  // async MyIds() {
  //   const MsgRef1 = new Map();
  //   await db
  //     .collection("chats")
  //     .where("users", "array-contains", localStorage.getItem("email"))
  //     .get()
  //     .then((doc) => {
  //       doc.forEach((item) => MsgRef1.set(item.id, item.data().users));
  //     });

  //   return MsgRef1;
  // }

  async getUserChatId(nick) {
    let rst = "";
    let email = [];
    await db
      .collection("chats")
      .where("users", "array-contains", nick[0])
      .get()
      .then((snap) => {
        snap.forEach((docs) => {
          email = docs
            .data()
            .users.filter((elem) => elem === localStorage.getItem("email"));
          if (email.length !== 0) {
            rst = docs.id;
          }
        });
      });
    return rst;
  }

  async getUser(nick) {
    let usr = {};
    await db
      .collection("users")
      .where("nickname", "==", nick)
      .get()
      .then((doc) => {
        doc.forEach((item) => {
          usr = item.data();
        });
      });
    return usr;
  }

  async updateNickname(nick, useId, game) {
    await db
      .collection("users")
      .doc(useId)
      .get()
      .then((doc) => {
        if (game === "league") {
          doc.ref
            .update({
              leagueNickname: nick,
            })
            .then(() => {
              console.log("Data saved successfully");
              return nick;
            })
            .catch((error) => {
              console.log("The write failed ", error);
              // The write failed...
            });
        } else {
          doc.ref.update({
            apexNickname: nick,
          });
        }
      });
  }
  async updateEmail(user_uid, newEmail) {
    await db
      .collection("users")
      .doc(user_uid)
      .get()
      .then((doc) => doc.ref.update({ email: newEmail }));
  }

  getMapNotification(user_email) {
    // creo un hashmap indirizzo email -> numero di notifiche
    let map = new Map();
    db.collection("chats")
      .where("users", "array-contains", user_email)
      .get()
      .then((doc) => {
        doc.forEach((item) => {
          if (item.data().users.indexOf(user_email) !== 0) {
            map.set(item.data().users[0], item.data().notify_0);
          } else {
            map.set(item.data().users[1], item.data().notify_1);
          }
        });
      });
    return map;
  }

  async getNotificationCount(user_email) {
    // ritorna il numero totale di notifiche nella nav bar
    let count = 0;
    await db
      .collection("chats")
      .get()
      .then((querySnap) => {
        querySnap.forEach((doc) => {
          if (doc.data().users.includes(user_email)) {
            if (doc.data().users.indexOf(user_email) === 0) {
              count += doc.data().notify_0;
            }
            if (doc.data().users.indexOf(user_email) === 1) {
              count += doc.data().notify_1;
            }
          }
        });
      });
    return count;
  }
  updateFirebaseNickname(userUid, firebaseNickname) {
    db.collection("users").doc(userUid).update({
      nickname: firebaseNickname,
    });
  }

  async pendingNotification(userEmail) {
    let futureFriends = [];
    await db
      .collection("users")
      .where("email", "==", userEmail)
      .get()
      .then((doc) => {
        doc.forEach((item) => {
          futureFriends = item.data().pending;
        });
      });
    return futureFriends;
  }

  createUsr(userEmail, userUid, photo, firebaseNickname, leagueName, apexName) {
    db.collection("users").doc(userUid).set({
      email: userEmail,
      photoURL: photo,
      bio: "",
      nickname: firebaseNickname,
      leagueNickname: leagueName,
      apexNickname: apexName,
      friendsList: {},
      pending: {},
      poke: {},
      review: {},
      rating: {},
    });
  }

  async addFriend(future_friend_uid, friendName, myNick, userUid) {
    let usr_friends = new Map();
    let my_friends = new Map();
    let friendUid = "";

    await db
      .collection("users")
      .doc(userUid)
      .get()
      .then((querySnap) => {
        db.collection("users")
          .doc(future_friend_uid)
          .get()
          .then((doc) => {
            usr_friends = doc.data().friendsList;
            usr_friends[myNick] = userUid;
            my_friends = querySnap.data().friendsList;
            my_friends[friendName] = future_friend_uid;

            doc.ref.update({
              friendsList: usr_friends,
            });
            querySnap.ref.update({
              friendsList: my_friends,
            });
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async findUserByName(name) {
    let nicknamUsers = [];
    name = name.toLowerCase();
    await db
      .collection("users")
      .get()
      .then((doc) => {
        doc.forEach((snap) => {
          nicknamUsers.push(snap.data().nickname);
        });

        nicknamUsers = nicknamUsers.filter((elem) =>
          elem.toLowerCase().startsWith(name)
        );
      });
    return nicknamUsers;
  }

  async removePendingPoke(userUid, friendName) {
    let pendingPokeList = [];
    await db
      .collection("users")
      .doc(userUid)
      .get()
      .then((querySnap) => {
        const test = querySnap.data().poke;

        delete test[friendName];

        querySnap.ref.update({
          poke: test,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    return pendingPokeList;
  }
  // poke
  addPoke(usrNick, myNick, game) {
    let pokeList = {};
    db.collection("users")
      .where("nickname", "==", usrNick)
      .get()
      .then((doc) => {
        doc.forEach((item) => {
          pokeList = item.data().pending;
          pokeList[myNick] = game;
          item.ref.update({
            poke: pokeList,
          });
        });
      });

    return pokeList;
  }

  async newFriendChat(emails, myEmail) {
    await db
      .collection("chats")
      .where("users", "array-contains", myEmail)
      .get()
      .then((doc) => {
        doc.forEach((item) => {
          let email = item.data().users.filter((elem) => elem !== myEmail);
          emails.delete(email[0]);
        });
      });

    return emails;
  }
  async getEmail(nick) {
    let email_nick = {};
    await db
      .collection("users")
      .where("nickname", "==", nick)
      .get()
      .then((doc) => {
        doc.forEach((item) => {
          email_nick[item.data().email] = item.data().nickname;
        });
      });
    return email_nick;
  }

  async pendingPoke(userEmail) {
    let futureFriends = {};
    await db
      .collection("users")
      .where("email", "==", userEmail)
      .get()
      .then((doc) => {
        doc.forEach((item) => {
          futureFriends = item.data().poke;
        });
      });
    return futureFriends;
  }

  async addPending(friendName, myNickname, userUid) {
    let pendingList = [];
    db.collection("users")
      .where("nickname", "==", friendName)
      .get()
      .then((doc) => {
        doc.forEach((item) => {
          if (!item.data().pending[myNickname]) {
            pendingList = item.data().pending;
            pendingList[myNickname] = userUid;
            item.ref.update({
              pending: pendingList,
            });
          }
        });
      });
    return pendingList;
  }

  async removePending(friendName, userUid) {
    let pendingList = [];

    await db
      .collection("users")
      .doc(userUid)
      .get()
      .then((querySnap) => {
        const test = querySnap.data().pending;

        delete test[friendName];

        querySnap.ref.update({
          pending: test,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    return pendingList;
  }

  // changeLeagueName(userUid,newNick,oldNick){
  //     console.log(newNick, " newNick")
  //     console.log(oldNick, " oldNick")
  //     db.collection("users").doc(userUid).get()
  //     .then((doc)=>{
  //         doc.ref.update({
  //             leagueNickname : newNick
  //         })
  //     })
  //     db.collection("users").where("friendList","==",oldNick).get()
  //     .then((doc)=>{
  //         doc.forEach((querySnap)=>{
  //             console.log(querySnap.data())
  //         })
  //     })

  // }

  async getInfoBio(name) {
    let myBio = "";
    await db
      .collection("users")
      .where("nickname", "==", name)
      .get()
      .then((doc) => {
        doc.forEach((item) => {
          myBio = item.data().bio;
        });
      });

    return myBio;
  }
  // getWannaQNick(leagueNick){

  // }
  async ModifyBio(name, newBio) {
    await db
      .collection("users")
      .where("nickname", "==", name)
      .get()
      .then((doc) => {
        doc.forEach((item) => {
          item.ref.update({ bio: newBio });
        });
      });

    return newBio;
  }

  async removeFriend(friendList, friendName, userUid, myNickname) {
    let friends = new Map();
    await db
      .collection("users")
      .doc(userUid)
      .get()
      .then((querySnap) => {
        db.collection("users")
          .doc(friendList[friendName])
          .get()
          .then((doc) => {
            const test = doc.data().friendsList;
            delete test[myNickname];
            doc.ref.update({
              friendsList: test,
            });
          });
        delete friendList[friendName];
        querySnap.ref.update({
          friendsList: friendList,
        });
      })
      .catch((error) => {
        console.log(error);
      });

    return friendList;
  }

  async getFriendsList(nick) {
    let friends = new Map();
    await db
      .collection("users")
      .where("nickname", "==", nick)
      .get()
      .then((querySnap) => {
        querySnap.forEach((snap) => {
          friends = snap.data().friendsList;
        });
      })
      .catch((error) => {
        console.log(error);
      });
    return friends;
  }

  updateCountNotification(MsgRef1, user_email) {
    let c = 0;
    for (const elem in MsgRef1) {
      db.collection("chats")
        .doc(MsgRef1[elem])
        .collection("messages")
        .where("user", "!=", user_email)
        .get()
        .then((querySnap) => {
          querySnap.forEach((doc) => {
            if (
              doc.data().notified === false &&
              doc.data().user !== user_email
            ) {
              c = c + 1;
            }
          });
          if (c) {
            db.collection("chats").doc(MsgRef1[elem]).update({ notify_1: c });
          }
        });
    }
  }

  createMapUserNotification(MsgRef, map1, userEmail) {
    for (const elem in MsgRef) {
      db.collection("chats")
        .doc(MsgRef[elem])
        .get()
        .then((doc) => {
          const user = doc.data().users.filter((u) => u !== userEmail);
          const count = doc.data().notify_1["count"];
          map1.set(user, count);
        });
    }
    return map1;
  }

  async getAllNicknameLeague() {
    let leaguePlayer = new Map();
    await db
      .collection("users")
      .where("nickname", "!=", null)
      .get()
      .then((querySnap) => {
        querySnap.forEach((doc) => {
          if (Object.getOwnPropertyNames(leaguePlayer).length <= 10) {
            leaguePlayer[doc.data().nickname] = doc.data().leagueNickname;
          }
        });
      });
    return leaguePlayer;
  }

  async getAllNicknameApex() {
    let apexPlayer = new Map();
    await db
      .collection("users")
      .where("apexNickname", "!=", null)
      .get()
      .then((querySnap) => {
        querySnap.forEach((doc) => {
          if (apexPlayer.size <= 10) {
            apexPlayer[doc.data().nickname] = doc.data().apexNickname;
          }
        });
      });
    return apexPlayer;
  }

  // ChatIds(user_email) {
  //   const MsgRef1 = [];
  //   db.collection("chats")
  //     .where("users", "array-contains", user_email)
  //     .get()
  //     .then((doc) => {
  //       doc.forEach((item) => MsgRef1.push(item.id));
  //     });
  //   return MsgRef1;
  // }

  changeNotification(MsgRef) {
    MsgRef?.docs.map((item, index) =>
      db
        .collection("chats")
        .doc(item.id)
        .get()
        .then((querySnap) => {
          return querySnap.data().notify_1["count"];
        })
    );
  }
}
export default new firebaseRequest();

import React, { useState } from "react";
import * as C from "./styles";
import { MdSend } from "react-icons/md";
import { auth, db } from "../../services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/compat/app";

const ChatFooter = ({ chatId }) => {
  const [user] = useAuthState(auth);
  const [message, setMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();

    db.collection("chats")
      .doc(chatId)
      .collection("messages")
      .add({
        message: message,
        user: localStorage.getItem("email"),
        photoURL: localStorage.getItem("photoUrl"),
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        notified: false,
      });
    // controllo e aggiungo la notifica al notification count dell utente
    db.collection("chats")
      .doc(chatId)
      .get()
      .then((doc) => {
        let idx = doc.data().users.indexOf(localStorage.getItem("email"));
        if (idx !== 1) {
          const count = doc.data().notify_1 + 1;
          console.log(count, " user 1");
          doc.ref.update({
            notify_1: count,
          });
        } else {
          const count = doc.data().notify_0 + 1;
          console.log(count, " users 0");
          doc.ref.update({
            notify_0: count,
          });
        }
      });
    setMessage("");
  };

  /**/
  return (
    <C.Container>
      <C.Form onSubmit={handleSendMessage}>
        <C.Input
          placeholder="Messaggio"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <MdSend onClick={handleSendMessage} />
      </C.Form>
    </C.Container>
  );
};

export default ChatFooter;

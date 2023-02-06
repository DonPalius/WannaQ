import React, { useEffect, useRef, useState } from "react";
import { auth, db } from "../../services/firebase";
import * as C from "./styles";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "../Message";
import { useAuthState } from "react-firebase-hooks/auth";
import sidebarChatsItem from "../SidebarChatsItem";
import firebase from "firebase/compat/app";
import SidebarChatsItem from "../SidebarChatsItem";
import firebaseRequest from "../../services/firebaseRequest";
import navbarLogged from "../navbarLogged";

const ChatBody = ({ chatId, setChatRef, setUserChat, count, setCount }) => {
  const [user] = useAuthState(auth);
  const [id, setId] = useState(chatId);

  const [messagesRes] = useCollection(
    db
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  const ref = db
    .collection("chats")
    .where("users", "array-contains", localStorage.getItem("email"));
  const [MsgRef] = useCollection(ref);

  const refBody = useRef("");

  useEffect(() => {
    setId(null);
  }, []);

  useEffect(() => {
    // set notified true all msg in the chat and set notication count = 0
    firebaseRequest.setNotifyMsg(
      MsgRef,
      messagesRes,
      localStorage.getItem("email"),
      localStorage.getItem("uid"),
      chatId
    );
    // setCount(firebaseRequest.getMapNotification(localStorage.getItem("email")));

    if (refBody.current.scrollHeight > refBody.current.offsetHeight) {
      refBody.current.scrollTop =
        refBody.current.scrollHeight - refBody.current.offsetHeight;
    }
  }, [messagesRes]);
  // messagesRes?.docs.map((message) => console.log(message.data()));
  return (
    <C.Container ref={refBody}>
      {messagesRes?.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            message: message.data().message,
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ))}
    </C.Container>
  );
};

export default ChatBody;

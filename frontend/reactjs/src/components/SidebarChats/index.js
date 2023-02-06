import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../services/firebase";
import * as C from "./styles";
import { useCollection } from "react-firebase-hooks/firestore";
import SidebarChatsItem from "../SidebarChatsItem";

const SidebarChats = ({
  setUserChat,
  userChat,
  count,
  setCount,
  chatRef,
  friendList,
  setFriendList,
  chatIds,
}) => {
  const [user] = useAuthState(auth);

  const refChat = db
    .collection("chats")
    .where("users", "array-contains", localStorage.getItem("email"));

  const [chatsSnapshot] = useCollection(refChat);
  return (
    <C.Container>
      {chatIds !== null &&
        Array.from(chatIds.keys()).map((index) => (
          <C.Content key={index}>
            <SidebarChatsItem
              id={index}
              users={chatIds.get(index)}
              user={user}
              setUserChat={setUserChat}
              active={userChat?.chatId === index ? "active" : ""}
              count={count}
              setCount={setCount}
              chatRef={chatRef}
              friendList={friendList}
              setFriendList={setFriendList}
            />
            <C.Divider />
          </C.Content>
        ))}
      {chatIds === null &&
        chatsSnapshot?.docs.map((item, index) => (
          <C.Content key={index}>
            <SidebarChatsItem
              id={item.id}
              users={item.data().users}
              user={user}
              setUserChat={setUserChat}
              active={userChat?.chatId === item.id ? "active" : ""}
              count={count}
              setCount={setCount}
              chatRef={chatRef}
            />
            <C.Divider />
          </C.Content>
        ))}
    </C.Container>
  );
};

export default SidebarChats;

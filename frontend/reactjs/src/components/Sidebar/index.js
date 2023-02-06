import React, { useEffect, useState } from "react";
import * as C from "./styles";
import SidebarHeader from "../SidebarHeader";
import SidebarChats from "../SidebarChats";
import { auth, db } from "../../services/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const Sidebar = ({
  setUserChat,
  userChat,
  count,
  setCount,
  chatRef,
  usr,
  friendList,
  setFriendList,
  chatIds,
  setChatRef,
}) => {
  return (
    <C.Container>
      <SidebarHeader
        setUserChat={setUserChat}
        friendList={friendList}
        setFriendList={setFriendList}
        chatRef={chatRef}
        setChatRef={setChatRef}
      />

      <SidebarChats
        setUserChat={setUserChat}
        userChat={userChat}
        count={count}
        setCount={setCount}
        chatRef={chatRef}
        friendList={friendList}
        setFriendList={setFriendList}
        chatIds={chatIds}
      />
    </C.Container>
  );
};

export default Sidebar;

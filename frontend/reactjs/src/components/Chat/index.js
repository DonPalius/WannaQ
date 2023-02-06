import React, { useEffect, useState } from "react";
import ChatHeader from "../ChatHeader";
import * as C from "./styles";
import Default from "../Default";
import ChatBody from "../ChatBody";
import ChatFooter from "../ChatFooter";
import NavbarLogged from "../navbarLogged";
import Footer from "../Footer/Footer";
import { db } from "../../services/firebase";
import { useCollection } from "react-firebase-hooks/firestore";

const Chat = ({
  userChat,
  setUserChat,
  count,
  setCount,
  chatRef,
  setChatRef,
  usr,
}) => {
  if (!userChat) return <Default />;
  const idRefChat = chatRef;

  return (
    <>
      <C.Container>
        <ChatHeader photoURL={userChat?.photoURL} name={userChat?.nickname} />
        {chatRef === null && (
          <ChatBody
            chatId={userChat?.chatId}
            setUserChat={setUserChat}
            count={count}
            setCount={setCount}
          />
        )}
        {chatRef !== null && (
          <ChatBody
            chatId={idRefChat}
            setChatRef={setChatRef}
            setUserChat={setUserChat}
            count={count}
            setCount={setCount}
          />
        )}
        <ChatFooter chatId={userChat?.chatId} />
      </C.Container>
    </>
  );
};

export default Chat;

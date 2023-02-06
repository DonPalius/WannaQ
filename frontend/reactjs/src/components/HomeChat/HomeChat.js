import React, { useEffect, useRef, useState } from "react";
import Chat from "../Chat";
import Sidebar from "../Sidebar";
import * as C from "../styles/app";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, messaging } from "../../services/firebase";
import firebaseRequest from "../../services/firebaseRequest";
import { useLocation, useNavigate } from "react-router-dom";
import { getMessaging, getToken } from "firebase/messaging";
import { doc, updateDoc, arrayRemove, onSnapshot } from "firebase/firestore";

import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { map } from "react-bootstrap/ElementChildren";
import { GiConsoleController } from "react-icons/gi";

const HomeChat = ({ usr, setUsr, friendList, setFriendList }) => {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const [ready, setReady] = useState(null);
  const [count, setCount] = useState(new Map());
  const [token, setToken] = useState(false);
  const [load, setLoad] = useState(false);
  const [userChat, setUserChat] = useState(null);
  const [chatIds, setChatIds] = useState(null);
  const [chatRef, setChatRef] = useState(null);
  const [chatSnapShot, setChatSnapShot] = useState(null);
  useEffect(() => {
    console.log(usr, " USR");
    if (usr !== null) {
      setUserChat(usr);
      setUsr(null);
    }
    if (!localStorage.getItem("uid")) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    firebaseRequest.ChatIds().then((res) => {
      setChatIds(res);
      setLoad(true);
    });

    if (!localStorage.getItem("uid")) {
      navigate("/");
    }
    if (load) {
      const map1 = new Map();
      // listener in caso venga inviato un messagio
      // duplicato con ChatIDs
      const q = db
        .collection("chats")
        .where("users", "array-contains", localStorage.getItem("email"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "modified" || change.type === "added") {
            const usr = change.doc
              .data()
              .users.filter((u) => u !== localStorage.getItem("email"));
            if (
              change.doc.data().users.indexOf(localStorage.getItem("email")) ===
              0
            ) {
              map1.set(usr[0], change.doc.data().notify_0);

              setCount(map1);
            }
            if (
              change.doc.data().users.indexOf(localStorage.getItem("email")) ===
              1
            ) {
              map1.set(usr[0], change.doc.data().notify_1);
              setCount(map1);
            }
          }
          if (chatRef) {
            setChatRef(null);
          } else {
            setChatRef(change.doc.id);
          }

          firebaseRequest.ChatIds().then((res) => {
            if (chatIds) {
              setChatRef(null);
              setChatIds(res);
            } else {
              setChatIds(res);
            }
          });
          if (change.type === "REMOVED") {
            console.log(change.doc.id);
            setChatRef(null);
          }
        });
      });

      if (!user) {
        unsubscribe();
      }
    }
  }, [load]);

  return (
    <>
      <div style={{ "background-color": "#ddd" }}>
        <div
          style={{
            textAlign: "center",
            paddingLeft: "20%",
          }}
        >
          {count && (
            <C.Container>
              <Sidebar
                setUserChat={setUserChat}
                userChat={userChat}
                count={count}
                setCount={setCount}
                chatRef={chatRef}
                friendList={friendList}
                setFriendList={setFriendList}
                chatIds={chatIds}
                setChatRef={setChatRef}
              />
              <Chat
                userChat={userChat}
                setUserChat={setUserChat}
                count={count}
                setCount={setCount}
                chatRef={chatRef}
                setChatRef={setChatRef}
                usr={usr}
              />
            </C.Container>
          )}
        </div>
      </div>
    </>
  );
};

export default HomeChat;

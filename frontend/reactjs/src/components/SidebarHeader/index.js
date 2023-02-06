import React, { useEffect, useState, useRef } from "react";
import * as C from "./styles";
import { MdChat } from "react-icons/md";
import { auth, db } from "../../services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { H6 } from "./styles";
import { Col, Row } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { Modal_Title, Modal_Body, Div } from "./styles";
import firebaseRequest from "../../services/firebaseRequest";
import { collection } from "firebase/firestore";
import ListGroup from "react-bootstrap/ListGroup";

const SidebarHeader = ({
  setUserChat,
  friendList,
  setFriendList,
  chatRef,
  setChatRef,
}) => {
  const [user] = useAuthState(auth);
  const [namePhoto, setNamePhoto] = useState(new Map());
  const [show, setShow] = useState(false);
  const [newChat, setNewChat] = useState(false);
  const handleClose = () => setShow(false);
  async function handleShow() {
    const myUsr = db.collection("users").doc(localStorage.getItem("uid"));
    const myFriendList = (await myUsr.get()).data().friendsList;
    // await firebaseRequest
    //   .getFriendsList(localStorage.getItem("uid"))
    //   .then((res) => {
    // console.log(res, "res");
    createNamePhoto(Object.keys(myFriendList)).then((r) => {
      setNamePhoto(r);
      console.log(r);
    });
    getEmail(Object.keys(myFriendList)).then((r1) => {
      firebaseRequest
        .newFriendChat(r1, localStorage.getItem("email"))
        .then((r2) => {
          setShow(true);
          setNewChat(r2);
        });
    });
    // });
  }

  async function getEmail(fList) {
    const emails = new Map();

    for (const name in fList) {
      await firebaseRequest.getEmail(fList[name]).then((res) => {
        emails.set(Object.keys(res)[0], Object.values(res)[0]);
      });
    }
    return emails;
  }

  async function showFriend() {
    await firebaseRequest
      .getFriendsList(localStorage.getItem("uid"))
      .then((res) => {
        setFriendList(res);
        createNamePhoto(res).then((r) => {
          setNamePhoto(r);
        });
      });
  }

  const refChat = db
    .collection("chats")
    .where("users", "array-contains", localStorage.getItem("email"));
  const [chatsSnapshot] = useCollection(refChat);

  async function createNamePhoto(fList) {
    const newElem = new Map();
    fList.forEach(function (friendListName) {
      db.collection("users")
        .where("nickname", "==", friendListName)
        .get()
        .then((querySnap) => {
          querySnap.forEach((doc) => {
            newElem.set(friendListName, doc.data().photoURL);
          });
        });
    });
    return newElem;
  }

  // create new chat
  const handleCreateChat = async (input, email) => {
    let tmp = newChat;
    tmp.delete(email);
    setNewChat(tmp);
    firebaseRequest.createChat(input).then(() => {
      firebaseRequest.getUser(input).then((res) => {
        handleNewChat(input, "t", res["photoURL"]).then(() => {
          setChatRef(chatRef);
        });
      });
    });
  };

  function handleNewChat(id, nick, photo) {
    const userChat = {
      chatId: id,
      name: nick.split("@")[0],
      nickname: nick,
      photoURL: photo,
      notified: false,
    };

    setUserChat(userChat);
  }

  const chatExists = (name) => {
    let emailChat = "";
    firebaseRequest.getEmail(name).then((res) => {
      emailChat = res;
      return !!chatsSnapshot?.docs.find(
        (chat) =>
          chat.data().users.find((user) => user === emailChat)?.length > 0
      );
    });
  };

  return (
    <C.Container>
      <H6>Friends list</H6>
      {localStorage.getItem("photoUrl") && <C.Avatar src={user?.photoURL} />}

      <MdChat style={{ width: "10%", color: "gray" }} onClick={handleShow} />
      {show && (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal_Title>
              <Div>
                <h2>Friends list</h2>
              </Div>
            </Modal_Title>
          </Modal.Header>
          <Modal_Body>
            {Array.from(newChat.keys()).map((key, value) => (
              <ListGroup horizontal>
                <ListGroup.Item>
                  {" "}
                  <img
                    src={namePhoto.get(newChat.get(key))}
                    referrerPolicy="no-referrer"
                    style={{
                      "border-radius": " 50%",
                      width: "80%",
                    }}
                    alt="fireSpot"
                    width="50"
                  />
                </ListGroup.Item>
                <ListGroup.Item>
                  {" "}
                  <Div>
                    <p>{newChat.get(key)}</p>
                  </Div>
                </ListGroup.Item>
                <ListGroup.Item>
                  {" "}
                  <C.Button_styled
                    onClick={() => handleCreateChat(newChat.get(key), key)}
                  >
                    create chat
                  </C.Button_styled>
                </ListGroup.Item>
              </ListGroup>
            ))}
          </Modal_Body>
          <Modal.Footer>
            <C.Button_styled variant="secondary" onClick={handleClose}>
              Close
            </C.Button_styled>
          </Modal.Footer>
        </Modal>
      )}
    </C.Container>
  );
};

export default SidebarHeader;

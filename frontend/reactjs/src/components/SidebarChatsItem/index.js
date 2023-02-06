import React, { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../services/firebase";
import * as C from "./styles";
import { MDBBadge, MDBBtn } from "mdb-react-ui-kit";
import { Col, Row } from "react-bootstrap";
import Backdrop from "bootstrap/js/src/util/backdrop";
import Button from "react-bootstrap/Button";
import firebaseRequest from "../../services/firebaseRequest";
import ChatHeader from "../ChatHeader";
import ChatBody from "../ChatBody";
import ChatFooter from "../ChatFooter";
import { onDOMContentLoaded } from "bootstrap/js/src/util";
import { onSnapshot } from "firebase/firestore";
import Spinner from "react-bootstrap/Spinner";

const getUser = (users, userLogged) =>
  users?.filter((user) => user !== userLogged?.email)[0];

const SidebarChatsItem = ({
  id,
  users,
  user,
  setUserChat,
  active,
  count,
  setCount,
  chatRef,
  usr,
}) => {
  const [UserItem, setUserItem] = useState("");
  const [load, setLoad] = useState(true);
  const getAllUserChats = () => {
    const getUserItem = [];
    db.collection("users")
      .where("email", "==", getUser(users, user))
      .get()
      .then((doc) => {
        doc.forEach((item) => getUserItem.push(item.data()));
        setLoad(false);
      });
    return getUserItem;
  };

  const [getUserItem] = useCollection(
    db.collection("users").where("email", "==", getUser(users, user))
  );

  // create new chat
  const handleNewChat = () => {
    const userChat = {
      chatId: id,
      name: item.split("@")[0],
      nickname: getUserItem?.docs?.[0]?.data().nickname,
      photoURL: Avatar?.photoURL,
      notified: false,
    };

    setUserChat(userChat);
  };

  const Avatar = getUserItem?.docs?.[0]?.data();
  const item = getUser(users, user);
  useEffect(() => {
    setUserItem(getAllUserChats());
  }, []);

  function test() {
    console.log(UserItem[0].email);
  }

  return (
    <C.Container onClick={handleNewChat} className={active}>
      {load && (
        <Spinner animation="border" role="status" variant="dark">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}

      <Row>
        {UserItem.length !== 0 && count && (
          <Col>
            <C.Name>{UserItem[0]?.nickname}</C.Name>
          </Col>
        )}
        <Col>
          {count.get(UserItem[0]?.email) !== 0 &&
            count.get(UserItem[0]?.email) && (
              <Col>
                <MDBBadge
                  className="ms-2"
                  style={{ "font-size": "16px", color: "blue" }}
                >
                  {count.get(UserItem[0].email)}
                </MDBBadge>
              </Col>
            )}
        </Col>
      </Row>
    </C.Container>
  );
};

export default SidebarChatsItem;

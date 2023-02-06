import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import {
  Nav,
  NavLink,
  NavMenu,
  Input,
  Div,
  H2,
  Container_search,
  Offcanvas_menu,
  Styled_ListGroup,
  Styled_ListItem,
  Button_styled,
} from "./navbarLogger.style";
import { Col, Container, ListGroup, Offcanvas, Row } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import firebaseRequest from "../../services/firebaseRequest";
import { onSnapshot } from "firebase/firestore";
import { BsFillBellFill } from "react-icons/bs";
import { AiFillSetting } from "react-icons/ai";
import { MDBListGroup, MDBListGroupItem } from "mdb-react-ui-kit";
import { GiGamepad } from "react-icons/gi";
import { useParams } from "react-router-dom";
import { MDBCol, MDBIcon } from "mdbreact";
import { StyledOffCanvas, Menu, Overlay } from "styled-off-canvas";
import { BiSearchAlt2 } from "react-icons/bi";

const NavbarLogged = ({
  setEnd,
  end,
  setListenerChats,
  setListenerNotification,
  topPlayersApex,
  setTopPlayersApex,
  topPlayersLeague,
  setTopPlayersLeague,
}) => {
  const [user, loading] = useAuthState(auth);
  const [searchTerm, setSearchTerm] = useState("");

  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [show, setShow] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showOffCanvasPoke, setShowOffCanvasPoke] = useState(false);
  const [showOffCanvasPending, setShowOffCanvasPending] = useState(false);

  const [pendingFriends, setPendingFriends] = useState(null);
  const [pendingPoke, setPendingPoke] = useState(null);
  const [pokeCount, setPokeCount] = useState(null);
  const [pendingNot, setPendingNot] = useState(null);
  const handleClose = () => setShow(false);
  const [playersFound, setPlayersFound] = useState(null);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showSettingMenu, setShowSettingMenu] = useState(false);

  const ShowMenu = () => {
    setShowSettingMenu(true);
  };

  const handleCloseSearch = () => {
    setShowSearchBar(false);
  };
  const handleShowSearch = () => setShowSearchBar(true);
  // name = parametro URL (nickname)
  const { url_name } = useParams();

  function visitProfile(profileNick) {
    setEnd(false);
    handleCloseSearch();
    navigate("/profile/" + profileNick);
  }

  // search in all users
  const findProfile = (term) => {
    if (term.length !== 0) {
      firebaseRequest.findUserByName(term).then((response) => {
        setPlayersFound(response.slice(0, 4));
        setShowOverlay(true);
      });
    } else {
      setShowOverlay(false);
      setPlayersFound(null);
    }
  };

  // get notification count of chats
  const getNotcount = () => {
    firebaseRequest
      .getNotificationCount(localStorage.getItem("email"))
      .then(function (result) {
        setNotification(result);
      });
  };
  const handleClosePendingCanvas = () => {
    console.log("handleClosePendingCanvas");
    setShowOffCanvasPending(false);
  };
  // show pending friends
  const showPendingNotification = () => {
    setPendingNot(null);
    firebaseRequest
      .pendingNotification(localStorage.getItem("email"))
      .then((res) => {
        console.log(res);

        setPendingFriends(res);
        setShowOffCanvasPending(true);
        setShowOffCanvasPoke(false);
      });
    // if (pendingFriends) {
    //   setShowOffCanvasPending(true);
    // } else {
    //   firebaseRequest
    //     .pendingNotification(localStorage.getItem("email"))
    //     .then((res) => {
    //       console.log(res);

    //       setPendingFriends(res);
    //       setShowOffCanvasPending(true);
    //       setShowOffCanvasPoke(false);
    //     });
    // }
  };
  // show pending poke
  const showPendingPoke = () => {
    setPendingNot(null);
    firebaseRequest.pendingPoke(localStorage.getItem("email")).then((res) => {
      setPendingPoke(res);
      setShowOffCanvasPoke(true);
      setShowOffCanvasPending(false);
    });
  };
  const removePendingPoke = (nickname_poke) => {
    firebaseRequest
      .removePendingPoke(localStorage.getItem("uid"), nickname_poke)
      .then((res) => {
        if (res.length === 0) {
          setPendingPoke(false);
        } else {
          setPendingPoke(res);
        }
      });
  };

  // remove pending friends
  const removePendingReq = (future_friend_name) => {
    firebaseRequest
      .removePending(future_friend_name, localStorage.getItem("uid"))
      .then((res) => {
        setPendingFriends(res);
      });
  };
  const addFriend = (future_friend_uid, future_friend_name) => {
    firebaseRequest
      .addFriend(
        future_friend_uid,
        future_friend_name,
        localStorage.getItem("nickname"),
        localStorage.getItem("uid")
      )
      .then((res) => {
        removePendingReq(future_friend_name);
      });
    setShowOffCanvasPending(false);
  };
  // listen for changes in user document
  const listener_notification_newFriend = () => {
    let Ncount = 0;
    const myUsr = db
      .collection("users")
      .where("email", "==", localStorage.getItem("email"));
    const sub = onSnapshot(myUsr, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        setPokeCount(Object.keys(change.doc.data().poke).length);
        if (Object.keys(Object.keys(change.doc.data().pending)).length > 0) {
          setPendingNot(
            Object.keys(Object.keys(change.doc.data().pending)).length
          );
        } else {
          setPendingNot(0);
        }
      });
    });
  };
  // listen for changes in all chat that contains user email
  const listener_chats = () => {
    const q = db
      .collection("chats")
      .where("users", "array-contains", localStorage.getItem("email"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "modified") {
          getNotcount();
        }
      });
    });
  };
  function removeDuplicates(obj) {
    // Create an array to store the unique values
    let uniqueValues = [];

    // Create an object to store the unique key-value pairs
    let uniqueObj = {};

    // Loop through each key-value pair in the input object using Object.entries
    Object.entries(obj).forEach(([key, val]) => {
      // If the value is not already in the uniqueValues array, add it to the array and the unique object
      if (
        !uniqueValues.includes(val) &&
        val !== localStorage.getItem("nickname")
      ) {
        if (val) {
          uniqueValues.push(val);
          uniqueObj[key] = val;
        }
      }
    });

    // Return the unique object
    return uniqueObj;
  }

  const getAllPlayer = () => {
    firebaseRequest.getAllNicknameApex().then((res) => {
      setTopPlayersApex(removeDuplicates(res));
    });
    firebaseRequest.getAllNicknameLeague().then((res) => {
      setTopPlayersLeague(removeDuplicates(res));
    });
  };
  // reset search bar
  function reset() {
    setPlayersFound(false);
    setSearchTerm(null);
    setEnd(false);
  }

  useEffect(() => {
    if (!localStorage.getItem("uid")) {
      navigate("/");
    }
    // getNick();
    getNotcount();
  }, [showOffCanvasPending]);
  listener_notification_newFriend();
  listener_chats();
  const refPoke = useRef(null);
  const refPendingOverlay = useRef(null);
  const ref = useRef(null);

  return (
    <>
      <Container_search>
        <div
          style={{
            "padding-left": "1%",
            paddingTop: "0.5%",
            "padding-right": "10%",
          }}
        >
          <h1>WannaQ</h1>
        </div>
        <Nav>
          <NavMenu>
            <div
              style={{
                paddingTop: "0.5%",
              }}
            >
              <BiSearchAlt2
                size={45}
                style={{
                  cursor: "pointer",
                }}
                onClick={handleShowSearch}
              ></BiSearchAlt2>
            </div>

            {/* <button >
              <H2>WannaQ search</H2>
            </button> */}

            {showSearchBar && (
              <Offcanvas
                show={showSearchBar}
                onHide={handleCloseSearch}
                placement={"top"}
                style={{
                  width: "30%",

                  height: "50%",
                  "background-color": "blue",
                }}
                responsive={"xxl"}
              >
                <Offcanvas_menu>
                  <Offcanvas.Header closeButton></Offcanvas.Header>
                  <Offcanvas.Body>
                    <Container
                    // style={{
                    //   "padding-right": "100%",
                    // }}
                    >
                      <div>
                        <h2>Search Player</h2>

                        <Input
                          type="text"
                          placeholder="Search new friend"
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            findProfile(e.target.value);
                          }}
                        />
                      </div>

                      <Row>
                        <Col sm={4} style={{ "padding-top": "5px" }}>
                          {playersFound &&
                            playersFound.map((item) => (
                              <MDBListGroup style={{ minWidth: "20rem" }} light>
                                <MDBListGroupItem
                                  tag="button"
                                  action
                                  style={{
                                    " border-block-color": "pink",
                                    border: " 1px solid",
                                    height: "40px",
                                  }}
                                  color="blue"
                                  active
                                  aria-current="true"
                                  onClick={() => visitProfile(item)}
                                  class="list-group-item rounded-3 list-group-item-light mb-2"
                                >
                                  {" "}
                                  {item}
                                </MDBListGroupItem>
                              </MDBListGroup>
                              // <ListGroup variant="flush">
                              //   <Styled_ListItem
                              //     tag="button"
                              //     key={item}
                              //     style={{
                              //       width: "220%",
                              //     }}
                              //     action
                              //     onClick={() => visitProfile(item)}
                              //   >
                              //     {item}
                              //   </Styled_ListItem>
                              // </ListGroup>
                            ))}
                        </Col>
                      </Row>
                    </Container>
                  </Offcanvas.Body>
                </Offcanvas_menu>
              </Offcanvas>
            )}

            <NavLink
              to={`/profile/${localStorage.getItem("nickname")}`}
              activestyle
              onClick={reset}
            >
              <h2>Profile</h2>
            </NavLink>
            <NavLink
              to="/matchmaking"
              activeStyle
              onClick={() => getAllPlayer()}
            >
              <h2>Matchmaking</h2>
            </NavLink>
            <NavLink
              to="/chat"
              activeStyle
              style={{ paddingRight: "0", width: "35%" }}
            >
              <h2>Chat </h2>{" "}
            </NavLink>
            {notification !== 0 && (
              <div
                style={{
                  paddingTop: "0.5%",
                  "padding-left": "0",
                  fontSize: "20px",
                }}
              >
                <Badge bg="secondary">{notification}</Badge>
              </div>
            )}

            <div
              ref={refPendingOverlay}
              style={{
                "padding-left": "5%",
                "padding-right": "1%",
                paddingTop: { pendingNot } === 0 ? "2%" : "0",
              }}
            >
              {pendingFriends && (
                <Offcanvas
                  show={showOffCanvasPending}
                  onHide={(e) => setShowOffCanvasPending(false)}
                  placement={"end"}
                  style={{ height: "50%", width: "20vw" }}
                  onEscapeKeyDown={(e) => setShowOffCanvasPending(false)}
                >
                  <Offcanvas_menu>
                    <Offcanvas.Header closeButton>
                      <Offcanvas.Title>
                        Friends request received
                      </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                      {pendingFriends &&
                        Object.keys(pendingFriends).map((key, value) => (
                          <ListGroup>
                            <Styled_ListItem>
                              <Row
                                style={{
                                  "padding-left": "15%",
                                  "padding-bottom": "2%",
                                  margin: "auto",
                                  fontSize: "20px",
                                }}
                              >
                                {key} wants to be your friend
                              </Row>
                              <Row>
                                <Col>
                                  <Button_styled
                                    onClick={() =>
                                      addFriend(pendingFriends[key], key)
                                    }
                                  >
                                    accetta
                                  </Button_styled>{" "}
                                </Col>
                                <Col>
                                  {" "}
                                  <Button_styled
                                    onClick={() => removePendingReq(key)}
                                  >
                                    rifiuta
                                  </Button_styled>
                                </Col>
                              </Row>
                            </Styled_ListItem>
                          </ListGroup>
                        ))}
                    </Offcanvas.Body>
                  </Offcanvas_menu>
                </Offcanvas>
              )}
            </div>

            <div
              ref={refPoke}
              style={{
                "padding-left": "5%",
                "padding-right": "1%",
                paddingTop: "2%",
                paddingTop: { pokeCount } === 0 ? "2%" : "0",
              }}
            >
              {pendingPoke && (
                <Offcanvas
                  show={showOffCanvasPoke}
                  onHide={(e) => setShowOffCanvasPoke(false)}
                  placement={"end"}
                >
                  <Offcanvas_menu>
                    <Offcanvas.Header closeButton>
                      <Offcanvas.Title>Poke received</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                      {pendingPoke &&
                        Object.keys(pendingPoke).map((key, value) => (
                          <ListGroup>
                            <Styled_ListItem>
                              <div style={{ paddingLeft: "1%" }}>
                                <Row>
                                  <Col style={{ fontSize: "17px" }}>
                                    <div style={{ fontSize: "20px" }}>
                                      {key}
                                    </div>
                                    <div> wants to play {pendingPoke[key]}</div>
                                  </Col>
                                  <Col style={{ paddingTop: "3%" }}>
                                    {" "}
                                    <Button_styled
                                      onClick={() => removePendingPoke(key)}
                                    >
                                      ok
                                    </Button_styled>{" "}
                                  </Col>
                                </Row>
                              </div>
                            </Styled_ListItem>
                          </ListGroup>
                        ))}
                    </Offcanvas.Body>
                  </Offcanvas_menu>
                </Offcanvas>
              )}
            </div>
            <div>
              <BsFillBellFill
                size={40}
                color={"white"}
                onClick={showPendingNotification}
              ></BsFillBellFill>
            </div>
            <div>
              {pendingNot > 0 && (
                <div
                  style={{
                    paddingTop: "10px",
                    fontSize: "20px",
                    paddingRight: "10px",
                  }}
                >
                  <Badge bg="secondary">{pendingNot}</Badge>
                </div>
              )}
            </div>
            <div>
              <GiGamepad
                color={"white"}
                size={70}
                onClick={showPendingPoke}
              ></GiGamepad>
            </div>
            <div>
              {pokeCount > 0 && (
                <div
                  style={{
                    paddingTop: "10px",
                    fontSize: "20px",
                    paddingRight: "10px",
                  }}
                >
                  <Badge bg="secondary">{pokeCount}</Badge>
                </div>
              )}
            </div>
            <div
              style={{
                paddingLeft: "10%",
                paddingRight: "1%",
              }}
            >
              <div
                style={{
                  paddingLeft: "15%",
                  paddingTop: "0",
                }}
              >
                <AiFillSetting size={50} onClick={ShowMenu}></AiFillSetting>
                {showSettingMenu && (
                  <Offcanvas
                    show={showSettingMenu}
                    onHide={(e) => setShowSettingMenu(false)}
                    placement={"end"}
                    style={{ height: "40%", width: "20%" }}
                    onExit={(e) => setShowSettingMenu(false)}
                  >
                    <Offcanvas_menu>
                      <Offcanvas.Header closeButton>
                        {/* <Offcanvas.Title>Friends request received</Offcanvas.Title> */}
                      </Offcanvas.Header>
                      <Offcanvas.Body>
                        <div style={{ margin: "auto", paddingBottom: "10px" }}>
                          <ListGroup>
                            <div style={{ paddingBottom: "5%" }}>
                              <Styled_ListItem>
                                <NavLink
                                  style={{ paddingLeft: "0" }}
                                  to="/settings"
                                  activeStyle
                                >
                                  Settings
                                </NavLink>
                              </Styled_ListItem>
                            </div>
                            <div style={{ paddingBottom: "5%" }}>
                              <Styled_ListItem>
                                <NavLink
                                  style={{ paddingLeft: "0" }}
                                  onClick={function (event) {
                                    logout();
                                  }}
                                  to="/"
                                >
                                  Logout
                                </NavLink>
                              </Styled_ListItem>
                            </div>
                          </ListGroup>
                        </div>
                      </Offcanvas.Body>
                    </Offcanvas_menu>
                  </Offcanvas>
                )}
              </div>
            </div>
          </NavMenu>
          {/* <div
            className="ml-auto"
            style={{
              paddingLeft: "18%",
              paddingRight: "1%",
              "padding-top": "1.5%",
              display: "flex",
            }}
          >
            <AiFillSetting size={50} onClick={ShowMenu}></AiFillSetting>
            {showSettingMenu && (
              <Offcanvas
                show={showSettingMenu}
                onHide={(e) => setShowSettingMenu(false)}
                placement={"end"}
                style={{ height: "30%", width: "17vw" }}
                onExit={(e) => setShowSettingMenu(false)}
              >
                <Offcanvas_menu>
                  <Offcanvas.Header closeButton>
                    {/* <Offcanvas.Title>Friends request received</Offcanvas.Title> 
                  </Offcanvas.Header>
                  <Offcanvas.Body>
                    <ListGroup>
                      <Styled_ListItem>
                        <NavLink to="/settings" activeStyle>
                          Settings
                        </NavLink>
                      </Styled_ListItem>
                      <Styled_ListItem>
                        <NavLink
                          onClick={function (event) {
                            logout();
                          }}
                          to="/"
                        >
                          Logout
                        </NavLink>
                      </Styled_ListItem>
                    </ListGroup>
                  </Offcanvas.Body>
                </Offcanvas_menu>
              </Offcanvas>
            )}
          </div> */}
        </Nav>

        {/* <ListGroup>
                 {Object.keys(pendingPoke).map((key, value) => ( 
                  <Row>
                    <Col>
                      <ListGroup.Item key="{key}">
                        <div>{key} vuole essere tuo amico</div>
                      </ListGroup.Item>
                    </Col>
                    <div>
                      <Col>
                        <Button
                          onClick={() => addFriend(pendingPoke[key], key)}
                        >
                          accetta
                        </Button>{" "}
                      </Col>
                      <Col>
                        {" "}
                        <Button onClick={() => removePendingReq(key)}>
                          rifiuta
                        </Button>
                      </Col>
                    </div>
                  </Row>
                ))}
              </ListGroup>
             */}
      </Container_search>
    </>
  );
};
export default NavbarLogged;

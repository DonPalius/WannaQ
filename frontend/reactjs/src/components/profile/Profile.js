import "../../App.css";
//routing
import Footer from "../Footer/Footer";
import Form from "react-bootstrap/Form";
import { ButtonGroup, Col, Row } from "react-bootstrap";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";
import Card from "react-bootstrap/Card";
import React, { useEffect, useState, useRef } from "react";
import "../../assets/css/Style.css";
import fetchStatsApex from "../../services/user/fetchStatsApex";
import { Wrapper } from "../styles/Landing.styles";
import fetchStatsLeague from "../../services/user/fetchStatsLeague";
import { useParams } from "react-router-dom";
import Offcanvas from "react-bootstrap/Offcanvas";
import ListGroup from "react-bootstrap/ListGroup";
import ReactStars from "react-rating-stars-component";
import Table from "react-bootstrap/Table";
import Carousel from "react-bootstrap/Carousel";
import {
  Div,
  Input,
  Modal_Body,
  Modal_Title,
  Div_checkbox,
  Container,
  Button_styled,
  friend_list_styled,
  stars_styled,
  styled_div_background,
} from "./profile.style";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import firebaseRequest from "../../services/firebaseRequest";
import { P } from "../matchmaking/styles";
import { List } from "react-bootstrap-icons";

const Profile = ({
  setEnd,
  end,
  usr,
  setUsr,
  friendList,
  setFriendList,
  apexData,
  setApexData,
  setLeagueData,
  leagueData,
}) => {
  const handleCloseReviewModal = () => setShowReview(false);
  const handleShowReviewModal = () => setShowReview(true);
  const [review, setReview] = useState({});
  const [reviewNameImg, setReviewNameImg] = useState({});

  const handleCloseReviewCanvas = () => setReviewCanvas(false);
  const handleShowReviewCanvas = () => {
    showFriend()
      .then(() => {
        console.log(review);
        console.log(
          Object.fromEntries(
            Object.entries(friendList).filter(([key, value]) =>
              Object.keys(review).includes(value)
            )
          )
        );

        setReviewNameImg(
          Object.fromEntries(
            Object.entries(friendList).filter(([key, value]) =>
              Object.keys(review).includes(value)
            )
          )
        );
      })
      .then(() => {
        setReviewCanvas(true);
      });
  };

  const [reviewCanvas, setReviewCanvas] = useState(false);

  const [newReview, setNewReview] = useState(false);

  const [showReview, setShowReview] = useState(null);
  const [friend, setFriend] = useState(false);
  const [valueCheckLeague, setValueCheckLeague] = useState(true);
  const [valueCheckApex, setValueCheckApex] = useState(true);

  const [rating, setRating] = useState(null);

  // first time new rating
  const [newRating, setNewRating] = useState(false);

  const [msg, setMsg] = useState(false);
  // let [apexData, setApexData] = useState("");
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [load, setLoad] = useState(true);
  const [showfriends, setSetShowfriends] = useState(false);
  // const [friendList, setFriendList] = useState(new Map());
  const [namePhoto, setNamePhoto] = useState(new Map());
  const [show, setShow] = useState(false);
  // searchBar
  const [searchTerm, setSearchTerm] = useState("");
  const [bio, setBio] = useState(false);
  const [newBio, setNewBio] = useState(false);
  const [photo, setPhoto] = useState(false);
  const [modifyBio, setShowModifyBio] = useState(false);
  const [overlayPoke, setShowOverlayPoke] = useState(false);
  const [elem, setElem] = useState(false);

  // end of call for backend
  // sono nella pending list
  const [waiting, setWaiting] = useState(false);
  const handleClose = () => {
    setSearchTerm("");
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const handleCloseBio = () => {
    setShowModifyBio(false);
    setNewBio(false);
  };

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  // name = parametro URL (nickname)
  const { name } = useParams();

  const getBio = () => {
    firebaseRequest.getInfoBio(name).then((res) => setBio(res));
  };
  const modBio = () => {
    firebaseRequest.ModifyBio(name, newBio).then((res) => setBio(res));
  };
  const showNewBio = (event) => {
    setShowModifyBio(true);
  };
  const visitSettings = () => {
    navigate("/settings");
  };
  // ritornano i nickname dei vari giochi
  const nickNames = () => {
    setEnd(false);
    db.collection("users")
      .where("nickname", "==", name)
      .get()
      .then((querySnap) => {
        querySnap.forEach((doc) => {
          // if (doc.data().email === localStorage.getItem("email")) {}
          if (doc.data().leagueNickname && !end) {
            // console.log("league name " + doc.data().leagueNickname);

            getLeagueData(doc.data().leagueNickname);
          }
          if (doc.data().apexNickname && !end) {
            ApexLegendsAPI(doc.data().apexNickname);
          }
        });
      });
  };

  // data from league microservice
  async function getLeagueData(gameNick) {
    if (!end) {
      fetchStatsLeague
        .getStatsLeague(gameNick)
        .then((res) => {
          console.log("res data" + res.data);
          setLeagueData(res.data);
        })
        .catch((error) => {
          fetchStatsLeague.registerNewUser(gameNick).then((res) => {
            getLeagueData(gameNick);
          });
        });
    } else {
      setLeagueData(false);
      return false;
    }
  }

  // 	get data from apex microservice
  async function ApexLegendsAPI(gameNick) {
    if (!end) {
      if (gameNick) {
        fetchStatsApex
          .getApexStats(gameNick)
          .then((res) => {
            if (res.data !== null) {
              setApexData(res.data);
            }
          })
          .catch((error) => {
            fetchStatsApex.createUser(gameNick).then(() => {
              ApexLegendsAPI(gameNick);
            });
            //
          });
      }
    } else {
      setApexData(false);
      return false;
    }
  }
  const showPopupPoke = (value) => {
    setElem(value);
    if (overlayPoke) {
      setShowOverlayPoke(false);
    } else {
      setShowOverlayPoke(true);
    }
  };

  // options for poke
  function toggle(value, type) {
    if (type === "league") {
      if (valueCheckApex === true) {
        setValueCheckLeague(!value);
        setValueCheckApex(value);
      } else {
        setValueCheckLeague(!value);
      }
    } else {
      if (valueCheckLeague === true) {
        setValueCheckApex(!value);
        setValueCheckLeague(value);
      } else {
        setValueCheckApex(!value);
      }
    }
  }

  const sendPoke = () => {
    if (valueCheckApex) {
      firebaseRequest.addPoke(elem, localStorage.getItem("nickname"), "apex");
    }
    if (valueCheckLeague) {
      firebaseRequest.addPoke(elem, localStorage.getItem("nickname"), "league");
    }
    setValueCheckApex(false);
    setValueCheckLeague(false);
    setShowOverlayPoke(false);
  };

  // metodo utilizzato nella finestra friends per cercare nuovi amici
  const handleChange = (term) => {
    if (term.length > 0) {
      let fList = Object.fromEntries(
        Object.entries(friendList).filter(([key]) =>
          key.toLowerCase().startsWith(term)
        )
      );
      setFriendList(fList);
    } else {
      showFriend();
    }
  };
  // metodo utilizzando quando sto visualizzando il profilo di un altro utente
  // mostra i button aggiungi amico o scrivi
  async function getData() {
    const myUsr = db.collection("users").doc(localStorage.getItem("uid"));
    const myFriendList = (await myUsr.get()).data().friendsList;

    if (localStorage.getItem("nickname") !== name) {
      // utente che sto visualizzando
      const Usr1 = db.collection("users").where("nickname", "==", name);
      await Usr1.get().then((querySnap) => {
        querySnap.forEach((doc) => {
          if (doc.data().pending[localStorage.getItem("nickname")]) {
            // sono in pending list
            console.log(waiting, " sono in pending list");
            setFriend(false);
            setMsg(false);
            setWaiting(true);
          } else if (myFriendList[doc.data().nickname]) {
            // mio amico
            setSetShowfriends(false);
            setMsg(true);
            setWaiting(false);
          } else {
            // non è mio amico
            setSetShowfriends(false);
            setFriend(true);
            setWaiting(false);
            setMsg(false);
          }
        });
      });
    } else {
      // mio profilo
      setMsg(false);
      setFriend(false);
      setWaiting(false);
    }
  }

  const showFriendsModal = (event) => {
    showFriend().then(() => {
      setShow(true);
    });
  };

  // get friendlist and create map Name -> photo
  async function showFriend() {
    console.log(name);
    await firebaseRequest.getFriendsList(name).then((res) => {
      setFriendList(res);
      createNamePhoto(res).then((r) => {
        setNamePhoto(r);
      });
    });
  }

  // create map Name -> photo
  async function createNamePhoto(fList) {
    const newElem = new Map();
    for (const friendListName in fList) {
      await db
        .collection("users")
        .where("nickname", "==", friendListName)
        .get()
        .then((querySnap) => {
          querySnap.forEach((doc) => {
            newElem.set(friendListName, doc.data().photoURL);
          });
        });
    }
    return newElem;
  }

  const removeFriend = (event, nick) => {
    const friendName = Object.keys(friendList).find((elem) => elem === nick);

    firebaseRequest
      .removeFriend(friendList, friendName, localStorage.getItem("uid"), name)
      .then((res) => showFriend());
  };
  const AddFriend = () => {
    firebaseRequest.addPending(
      name,
      localStorage.getItem("nickname"),
      localStorage.getItem("uid")
    );
    setFriend(false);
    setWaiting(true);
  };
  // retrive chat id, nickname, photo for const userchat and after setUsr(defined in app.js)
  const openChat = (value) => {
    firebaseRequest.getEmail(value).then((res) => {
      firebaseRequest.getUserChatId(Object.keys(res)).then((r) => {
        if (!r) {
          firebaseRequest.createChat(value).then(() => {
            firebaseRequest.getUser(value).then((response) => {
              firebaseRequest
                .getUserChatId(Object.keys(res))
                .then((chatid) => {
                  const userChat = {
                    chatId: chatid,
                    name: value.split("@")[0],
                    nickname: value,
                    photoURL: response["photoURL"],
                    notified: false,
                  };
                  setUsr(userChat);
                })
                .then(() => {
                  navigate("/chat");
                });
            });
          });
        } else {
          firebaseRequest
            .getUser(value)
            .then((response) => {
              const userChat = {
                chatId: r,
                name: value.split("@")[0],
                nickname: value,
                photoURL: response["photoURL"],
                notified: false,
              };
              setUsr(userChat);
            })
            .then(() => {
              navigate("/chat");
            });
        }
      });
    });
  };

  // get from from name
  async function getPhoto() {
    db.collection("users")
      .where("nickname", "==", name)
      .get()
      .then((querySnap) => {
        querySnap.forEach((doc) => {
          setPhoto(doc.data().photoURL);
        });
      });
  }
  const ref = useRef(null);
  const addNewRating = (newRat) => {
    if (name !== localStorage.getItem("nickname")) {
      setNewRating(newRat);
    }
  };

  const ratingChanged = (newRating) => {
    if (name !== localStorage.getItem("nickname")) {
      setRating(null);
      console.log(newRating, "new rating");
      firebaseRequest
        .addRating(name, localStorage.getItem("nickname"), newRating)
        .then((response) => {
          setRating(response);
          console.log(response);
        });
    } else {
      console.log("my account... I can't rate myself");
    }
  };
  function addNewReview() {
    firebaseRequest
      .addNewReview(name, localStorage.getItem("uid"), newReview, newRating)
      .then((r) => {
        setReview(r);
        firebaseRequest.getRating(name).then((r) => {
          if (isNaN(r)) {
            setRating(0);
          } else {
            console.log(r);
            setRating(r);
          }
        });
        handleCloseReviewModal();
        setNewRating(false);
      });
  }

  function handleNewReview(elem) {
    setNewReview(elem);
  }

  useEffect(() => {
    setRating(null);
    showFriend();
    firebaseRequest.getReview(name).then((r) => {
      setReview(r);
    });

    firebaseRequest.getRating(name).then((r) => {
      if (isNaN(r)) {
        setRating(0);
      } else {
        console.log(r);
        setRating(r);
      }
    });

    console.log("start");
    setEnd(false);

    getPhoto();
    if (!localStorage.getItem("uid")) {
      navigate("/");
    }
    getBio();

    // console.log(leagueData.rankflex != false);
    // console.log(leagueData.ranksoloq != false);

    nickNames();
    getData();
    sleep(500).then(() => {
      console.log("end");
      setEnd(true);
      setLoad(false);
    });
  }, [name, load]);
  return (
    <div style={{ "background-color": "#ddd" }}>
      <div
        style={{
          "background-color": "white",
          textAlign: "center",
          "padding-top": "20px",
          margin: "auto",
          width: "50%",
          height: "100dvh",
          paddingBottom: " 0.5%",
          "overflow-y": "scroll",
        }}
      >
        {load === true && (
          <div
            style={{
              display: "inline-block",
              marginTop: "20%",
              width: "30%",
              height: "30%",
            }}
          >
            <Spinner animation="border" role="status" variant="dark" size="xl">
              <span style={{ color: "black" }} className="visually-hidden">
                Loading...
              </span>
            </Spinner>
          </div>
        )}
        {load === false && (
          <div style={{ overflow: "scroll" }}>
            <img
              src={photo}
              alt="fireSpot"
              style={{
                "border-radius": " 50%",
              }}
              width="100"
              referrerPolicy="no-referrer"
              key={Date.now()}
            />
            <div
              style={{
                textAlign: "center",
                " justify-content": "center",
              }}
            >
              <h3 style={{ color: "black" }}>Rating</h3>
              {rating !== null && (
                <div style={{ display: "inline-block" }}>
                  <ReactStars
                    isHalf={true}
                    count={5}
                    value={rating}
                    size={24}
                    edit={false}
                    activeColor="#ffd700"
                  />
                </div>
              )}
            </div>

            {/* {rating !== null && name !== localStorage.getItem("nickname") && (
        <div>
          {" "}
          <ReactStars
            count={5}
            value={rating}
            onChange={ratingChanged}
            size={24}
            edit={true}
            activeColor="#ffd700"
          />
          ,
        </div>
      )} */}

            {rating === 0 && (
              <Div>
                <h2>no rating yet</h2>
              </Div>
            )}
            {name !== localStorage.getItem("nickname") &&
              Object.values(friendList).includes(name) === false && (
                <Button_styled
                  variant="primary"
                  onClick={handleShowReviewModal}
                >
                  Leave a review
                </Button_styled>
              )}

            <Modal show={showReview} onHide={handleCloseReviewModal}>
              <Modal.Header closeButton>
                <Modal_Title>Your review</Modal_Title>
              </Modal.Header>
              <Modal_Body>
                <div style={{ "padding-left": "10px" }}>
                  <Input
                    type="text"
                    placeholder="new review"
                    onChange={(e) => {
                      handleNewReview(e.target.value);
                    }}
                  />
                  <ReactStars
                    count={5}
                    onChange={addNewRating}
                    size={24}
                    activeColor="#ffd700"
                  />
                </div>
              </Modal_Body>
              <Modal.Footer>
                <Button_styled
                  variant="secondary"
                  onClick={handleCloseReviewModal}
                >
                  Close
                </Button_styled>
                <Button_styled variant="primary" onClick={addNewReview}>
                  Save Changes
                </Button_styled>
              </Modal.Footer>
            </Modal>
            {localStorage.getItem("nickname") === name && (
              <Button_styled onClick={(event) => showFriendsModal(event)}>
                Friends
              </Button_styled>
            )}

            <Button_styled variant="primary" onClick={handleShowReviewCanvas}>
              show reviews
            </Button_styled>
            {review && (
              <Offcanvas
                show={reviewCanvas}
                onHide={handleCloseReviewCanvas}
                responsive="lg"
                style={{ backgroundColor: "teal" }}
              >
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title>
                    <div style={{ color: "white", textAlign: "center" }}>
                      Review list
                    </div>
                  </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                  {Object.keys(reviewNameImg).map((value_friendList) => (
                    <Div>
                      <ListGroup>
                        <div style={{ paddingBottom: "10px" }}>
                          <ListGroup.Item
                            style={{
                              border: "4px solid gray",
                            }}
                          >
                            <img
                              src={namePhoto.get(value_friendList)}
                              style={{
                                "border-radius": " 50%",
                              }}
                              referrerPolicy="no-referrer"
                              alt="fireSpot"
                              width="50"
                            />
                            <Div style={{ fontSize: "25px" }}>
                              {value_friendList}
                            </Div>
                            <Div>{review[reviewNameImg[value_friendList]]}</Div>
                            <Div style={{ display: "inline-block" }}>
                              {" "}
                              <ReactStars
                                count={5}
                                value={rating}
                                size={24}
                                edit={false}
                                activeColor="#ffd700"
                              />
                            </Div>
                          </ListGroup.Item>
                        </div>
                      </ListGroup>
                    </Div>
                  ))}
                </Offcanvas.Body>
              </Offcanvas>
            )}
            {friendList && (
              <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                  <Modal_Title>
                    <h2 style={{ color: "black" }}>Friends list</h2>{" "}
                    <Input
                      type="text"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        handleChange(e.target.value);
                      }}
                    />
                  </Modal_Title>

                  {/* <button onClick={}>Search</button> */}
                </Modal.Header>
                <Modal_Body>
                  {Object.keys(friendList).map((value) => (
                    <ListGroup>
                      <ListGroup.Item
                        style={{
                          " paddingTop": "5px",
                          " border": "2px solid black",
                        }}
                      >
                        <Row>
                          <Col key={value}>
                            <img
                              src={namePhoto.get(value)}
                              style={{
                                cursor: "pointer",
                                "border-radius": " 100%",
                                width: "80px",
                                height: "80px",
                              }}
                              referrerPolicy="no-referrer"
                              alt="fireSpot"
                              width="50"
                              onClick={(event) => {
                                setEnd(false);
                                handleClose();
                                navigate("/profile/" + value);
                              }}
                            />
                          </Col>
                          <Col key="{value}" style={{ paddingTop: "20px" }}>
                            <P
                              style={{ cursor: "pointer" }}
                              onClick={(event) => {
                                setEnd(false);
                                handleClose();
                                navigate("/profile/" + value);
                              }}
                            >
                              {value}
                            </P>
                          </Col>
                          <Col ref={ref} style={{ paddingTop: "20px" }}>
                            <Button_styled onClick={() => showPopupPoke(value)}>
                              Poke
                            </Button_styled>
                            {overlayPoke && (
                              <Overlay
                                show={overlayPoke}
                                container={ref}
                                target={ref}
                                placement="bottom"
                                containerPadding={10}
                                transition={true}
                              >
                                <Popover id="popover-contained">
                                  <Popover.Body>
                                    <Div_checkbox>
                                      <Form>
                                        <h4>select game:</h4>
                                        <Form.Check
                                          type="checkbox"
                                          id="disabled-custom-switch"
                                          checked={valueCheckApex}
                                          onChange={(e) => {
                                            toggle(valueCheckApex, "apex");
                                          }}
                                          label="Apex"
                                        />
                                        <Form.Check
                                          type="checkbox"
                                          checked={valueCheckLeague}
                                          onChange={(e) =>
                                            toggle(valueCheckLeague, "league")
                                          }
                                          label="league"
                                          id="disabled-custom-switch"
                                        />
                                      </Form>
                                      <Button_styled
                                        onClick={() => sendPoke(value)}
                                      >
                                        Send
                                      </Button_styled>
                                    </Div_checkbox>
                                  </Popover.Body>
                                </Popover>
                              </Overlay>
                            )}
                          </Col>
                          <Col style={{ paddingTop: "20px" }}>
                            <Button_styled onClick={() => openChat(value)}>
                              message
                            </Button_styled>
                          </Col>
                          <Col style={{ paddingTop: "20px" }}>
                            <Button_styled
                              onClick={(event) => {
                                removeFriend(event, value);
                              }}
                            >
                              delete
                            </Button_styled>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    </ListGroup>
                  ))}
                </Modal_Body>
                <Modal.Footer>
                  <Button_styled variant="secondary" onClick={handleClose}>
                    Close
                  </Button_styled>
                </Modal.Footer>
              </Modal>
            )}

            {/* {friendList && (

              <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                  <Modal_Title>
                    <h2 style={{ color: "black" }}>Friends list</h2>{" "}
                    <Input
                      type="text"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        handleChange(e.target.value);
                      }}
                    />
                  </Modal_Title>


                </Modal.Header>
                <Modal_Body>
                  {Object.keys(friendList).map((value) => (
                    <ListGroup>
                      <ListGroup.Item
                        style={{
                          " paddingTop": "5px",
                          " border": "2px solid black",
                        }}
                      >
                        <Row>
                          <Col key={value}>
                            <img
                              src={namePhoto.get(value)}
                              style={{
                                cursor: "pointer",
                                "border-radius": " 100%",
                                width: "80px",
                                height: "80px",
                              }}
                              referrerPolicy="no-referrer"
                              alt="fireSpot"
                              width="50"
                              onClick={(event) => {
                                setEnd(false);
                                handleClose();
                                navigate("/profile/" + value);
                              }}
                            />
                          </Col>
                          <Col key="{value}" style={{ paddingTop: "20px" }}>
                            <P
                              style={{ cursor: "pointer" }}
                              onClick={(event) => {
                                setEnd(false);
                                handleClose();
                                navigate("/profile/" + value);
                              }}
                            >
                              {value}
                            </P>
                          </Col>
                          <Col ref={ref} style={{ paddingTop: "20px" }}>
                            <Button_styled onClick={() => showPopupPoke(value)}>
                              Poke
                            </Button_styled>
                            {overlayPoke && (
                              <Overlay
                                show={overlayPoke}
                                container={ref}
                                target={ref}
                                placement="bottom"
                                containerPadding={10}
                                transition={true}
                              >
                                <Popover id="popover-contained">
                                  <Popover.Body>
                                    <Div_checkbox>
                                      <Form>
                                        <h4>select game:</h4>
                                        <Form.Check
                                          type="checkbox"
                                          id="disabled-custom-switch"
                                          checked={valueCheckApex}
                                          onChange={(e) => {
                                            toggle(valueCheckApex, "apex");
                                          }}
                                          label="Apex"
                                        />
                                        <Form.Check
                                          type="checkbox"
                                          checked={valueCheckLeague}
                                          onChange={(e) =>
                                            toggle(valueCheckLeague, "league")
                                          }
                                          label="league"
                                          id="disabled-custom-switch"
                                        />
                                      </Form>
                                      <Button_styled
                                        onClick={() => sendPoke(value)}
                                      >
                                        Send
                                      </Button_styled>
                                    </Div_checkbox>
                                  </Popover.Body>
                                </Popover>
                              </Overlay>
                            )}
                          </Col>
                          <Col style={{ paddingTop: "20px" }}>
                            <Button_styled onClick={() => openChat(value)}>
                              message
                            </Button_styled>
                          </Col>
                          <Col style={{ paddingTop: "20px" }}>
                            <Button_styled
                              onClick={(event) => {
                                removeFriend(event, value);
                              }}
                            >
                              delete
                            </Button_styled>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    </ListGroup>
                  ))}
                </Modal_Body>
                <Modal.Footer>
                  <Button_styled variant="secondary" onClick={handleClose}>
                    Close
                  </Button_styled>
                </Modal.Footer>
              </Modal>
            )} */}

            {msg && (
              <Button_styled onClick={() => openChat(name)}>
                Write a message
              </Button_styled>
            )}

            {friend === true &&
              Object.values(friendList).includes(name) === false &&
              name != localStorage.getItem("nickname") && (
                <Button_styled onClick={AddFriend}>Add friend</Button_styled>
              )}
            {waiting === true && localStorage.getItem("nickname") !== name && (
              <Div>
                <h4>in attesa di risposta</h4>
              </Div>
            )}

            {localStorage.getItem("nickname") === name && (
              <Button_styled onClick={showNewBio}>Edit bio</Button_styled>
            )}

            <div style={{ "padding-top": "20px" }}></div>
            {bio && (
              <Div>
                <div
                  style={{
                    width: "30%",
                    height: "auto",
                    margin: "auto",
                    color: "black",
                    textAlign: "center",
                    "font-size": "20px",
                    border: "2px solid gray",
                  }}
                >
                  {bio}
                </div>
              </Div>
            )}
            {!bio && (
              <Div
                style={{
                  width: "20%",
                  height: "auto",
                  margin: "auto",
                  textAlign: "center",
                  "font-size": "20px",
                  border: "2px solid gray",
                }}
              >
                bio is empty
              </Div>
            )}

            {modifyBio && (
              <Modal show={modifyBio} onHide={handleCloseBio}>
                <Modal.Header closeButton>
                  <Modal_Title>
                    <h2>Modify Bio</h2>
                  </Modal_Title>
                </Modal.Header>
                <Modal.Body>
                  <Input
                    type="text"
                    placeholder={bio}
                    onChange={(e) => {
                      setNewBio(e.target.value);
                    }}
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button_styled variant="secondary" onClick={handleCloseBio}>
                    Close
                  </Button_styled>
                  <Button_styled variant="primary" onClick={modBio}>
                    Save Changes
                  </Button_styled>
                </Modal.Footer>
              </Modal>
            )}
            <Div>
              {load === false && (
                <Carousel variant="dark" style={{ height: "55dvh" }}>
                  {leagueData && (
                    <Carousel.Item>
                      <div style={{ height: "100%" }}>
                        <p style={{ color: "black" }}>
                          League of legends nickname: {leagueData.summonername}
                        </p>
                        <Row>
                          {/* <Col> */}
                          <h1 style={{ color: "black" }}>Statistics soloQ</h1>

                          {leagueData.ranksoloq === null && (
                            <h2 style={{ color: "black" }}>
                              No recent data available
                            </h2>
                          )}
                          {leagueData.ranksoloq !== null && (
                            <div
                              style={{
                                textAlign: "center",
                                "padding-left": "31.5%",
                              }}
                            >
                              <Table
                                striped
                                title="Statistics soloQ"
                                bordered
                                hover
                                style={{
                                  width: "35%",
                                  " border": " 2px solid gray",
                                }}
                              >
                                <thead>
                                  <tr>
                                    <th>Rank SOLOQ</th>
                                    <th>Wins SOLOQ</th>
                                    <th>LP SOLOQ</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>{leagueData.ranksoloq}</td>
                                    <td>{leagueData.winssoloq}</td>
                                    <td>{leagueData.pointsoloq}</td>
                                  </tr>
                                </tbody>
                              </Table>
                            </div>
                          )}
                          {/* </Col>
                          <Col> */}
                          <h1 style={{ color: "black" }}>Statistics Flex</h1>
                          {leagueData.rankflex === null && (
                            <h2 style={{ color: "black" }}>
                              No recent data available
                            </h2>
                          )}

                          {leagueData.rankflex !== null && (
                            <div
                              style={{
                                textAlign: "center",
                                "padding-left": "31.5%",
                              }}
                            >
                              <Table
                                striped
                                bordered
                                hover
                                style={{
                                  width: "35%",
                                  " border": " 2px solid gray",
                                }}
                              >
                                <thead>
                                  <tr>
                                    <th>Rank FLEX</th>
                                    <th>Wins FLEX</th>
                                    <th>LP FLEX</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>{leagueData.rankflex}</td>
                                    <td>{leagueData.winsflex}</td>
                                    <td>{leagueData.pointflex}</td>
                                  </tr>
                                </tbody>
                              </Table>
                            </div>
                          )}

                          {/* </Col> */}
                        </Row>
                        {!leagueData && end && (
                          <p style={{ color: "black" }}>
                            no data nickname available{" "}
                            {localStorage.getItem("nickname") === name && (
                              <Button_styled onClick={visitSettings}>
                                Add league nickname
                              </Button_styled>
                            )}
                          </p>
                        )}
                      </div>
                    </Carousel.Item>
                  )}

                  <Carousel.Item>
                    <div style={{ height: "200%" }}>
                      {apexData && (
                        <Wrapper>
                          <Div>
                            {apexData && (
                              <p>
                                Apex legends nickname: {apexData.gameNickname}
                              </p>
                            )}
                          </Div>
                          <Div>
                            <h1>Statistics Apex</h1>
                          </Div>
                          <div
                            style={{
                              textAlign: "center",
                              display: "inline-block",
                              width: "50%",
                            }}
                          >
                            <Table
                              striped
                              title="Statistics Apex"
                              bordered
                              hover
                            >
                              <thead>
                                <tr>
                                  <th>Rank</th>
                                  <th>Wins</th>
                                  <th>Kills</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>{apexData.rank}</td>
                                  <td>{apexData.wins}</td>
                                  <td>{apexData.kills}</td>
                                </tr>
                              </tbody>
                            </Table>
                          </div>
                          {/* {localStorage.getItem("nickname") === name && (
        <Button style={button_style} onClick={(event) => onClick(event)}>Friends</Button>
      )} */}
                        </Wrapper>
                      )}
                      {apexData === false && (
                        <Div>
                          <p>
                            no data nickname available{" "}
                            {localStorage.getItem("nickname") === name && (
                              <Button_styled onClick={visitSettings}>
                                Add apex nickname
                              </Button_styled>
                            )}
                          </p>
                        </Div>
                      )}
                    </div>
                  </Carousel.Item>
                </Carousel>
              )}
            </Div>
            <Div style={{ paddingBottom: " 2%", paddingTop: "2%" }}>
              <h2>New stats will be added</h2>
            </Div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

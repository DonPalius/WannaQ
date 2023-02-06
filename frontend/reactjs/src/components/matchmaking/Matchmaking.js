import React, { useEffect, useState } from "react";
import Footer from "../Footer/Footer";
import ListGroup from "react-bootstrap/ListGroup";
import Table from "react-bootstrap/Table";
import {
  ButtonGroup,
  Col,
  Container,
  ModalBody,
  ModalTitle,
  Row,
} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import fetchStats from "../../services/user/fetchStatsApex";
import fetchStatsLeague from "../../services/user/fetchStatsLeague";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../services/firebase";
import Modal from "react-bootstrap/Modal";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import * as C from "./styles";
import firebaseRequest from "../../services/firebaseRequest";

const Matchmaking = ({
  setEnd,
  end,
  usr,
  setUsr,
  topPlayersLeague,
  topPlayersApex,
}) => {

  const [facebook, setFacebook] = useState();
  const [showTable, setShowTable] = useState(false);
  const [name, setName] = useState("");
  // show flex rank
  const [flex, setFlex] = useState("");
  // show solo rank
  const [solo, setSolo] = useState("");
  const [namePhoto, setNamePhoto] = useState();
  //  all data
  let [game, setGame] = useState(null);
  const [loading, setLoading] = useState(false);
  let [usersData, setUsersData] = useState([]);
  const [noPlayer, setNoPlayer] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const sendPoke = (value) => {
    firebaseRequest.addPoke(name, localStorage.getItem("nickname"), value);
  };

  const getName = async (uid, game) => {
    const key_value = [];
    if (game === "Apex Legends") {
      await db
        .collection("users")
        .doc(uid)
        .get()
        .then((querySnap) => {
          setName(querySnap.data().nickname);
          key_value.push(querySnap.data().apexNickname);
          key_value.push(querySnap.data().photoURL);
        });
    } else {
      await db
        .collection("users")
        .doc(uid)
        .get()
        .then((querySnap) => {
          setName(querySnap.data().nickname);
          key_value.push(querySnap.data().leagueNickname);
          key_value.push(querySnap.data().photoURL);
        });
    }
    return key_value;
  };
  const visitProfile = (id) => {
    db.collection("users")
      .doc(id)
      .get()
      .then((snap) => {
        setEnd(false);
        navigate("/profile/" + snap.data().nickname);
      });
  };

  const openChat = (value) => {
    db.collection("users")
      .doc(value)
      .get()
      .then((snap) => {
        value = snap.data().nickname;
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
      });
  };

  const startMatchmaking = async (type) => {
    matchmakingLeague(type);

  };

  // da fixare la parte di apex
  const matchmakingLeague = async (queue) => {
    setGame("League of Legends");
    setUsersData([]);
    setShowTable(false);

    let i = 0;
    setNamePhoto(new Map());
    const newElements = new Map(namePhoto);
    if (queue === "soloq") {
      setSolo("ranksoloq");
      setFlex("");
      await fetchStatsLeague
        .getMatchLeagueSolo()
        .then(async (res) => {
          if (res.data.length === 0) {
            setNoPlayer(true);
            setShow(true);
          } else {
            setUsersData(res.data);

            for (i = 0; i < res.data.length; i++) {
              await getName(res.data[i].id, "League of Legends").then((res) => {
                newElements.set(String(res[0]).toLowerCase(), res[1]);
              });
            }
            setGame("League of Legends");
            setNamePhoto(newElements);
          }
        })
        .then(() => {
          setShowTable(true);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setSolo("");
      setFlex("rankflex");
      await fetchStatsLeague
        .getMatchLeagueFlex()
        .then(async (res) => {
          if (res.data.length === 0) {
            setNoPlayer(true);
            setShow(true);
          } else {
            setUsersData(res.data);
            for (i = 0; i < res.data.length; i++) {
              await getName(res.data[i].id, "League of Legends").then((res) => {
                newElements.set(res[0], res[1]);
              });
            }
            setGame("League of Legends");
            setNamePhoto(newElements);
          }
        })
        .then(() => {
          setShowTable(true);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const matchmakingApex = async (e) => {
    const id = "1";
    let i = 0;
    setUsersData([]);
    setNamePhoto(new Map());

    const newElements = new Map(namePhoto);
    await fetchStats
      .getMatchApex()
      .then(async (res) => {
        if (res.data.length === 0) {
          setNoPlayer(true);
          setShow(true);
        } else {
          setGame("Apex Legends");
          setUsersData(res.data);
          for (i = 0; i < res.data.length; i++) {
            await getName(res.data[i].id, "Apex Legends").then((res) => {
              newElements.set(res[0], res[1]);
            });
          }

          setNamePhoto(newElements);
        }
      })
      .then(() => {
        setShowTable(true);
      })
      .catch((error) => {
        setNoPlayer(true);
        setShow(true);
        console.log(error);
      });
  };

  // const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    // if logout in other windows
    if (!localStorage.getItem("uid")) {
      navigate("/");
    }
  });

  return (
    <>
      <div style={{ "background-color": "#ddd" }}>
        <div
          style={{
            backgroundColor: "white",
            textAlign: "center",
            "padding-top": "20px",
            margin: "auto",
            width: "70%",

            height: "100dvh",
          }}
        >
          <C.Container>
            <Row>
              <div style={{ paddingleft: "0", paddingBottom: "20px" }}>
                <Dropdown style={{ paddingLeft: "0", width: "100%" }}>

                  <Dropdown.Toggle
                    id="dropdown-button-dark-example1"
                    variant="success"
                  >
                    Matchmaking
                  </Dropdown.Toggle>

                  <Dropdown.Menu variant="dark">
                    <Dropdown.Item onClick={() => startMatchmaking("soloq")}>
                      LEAGUE SOLOQ
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => startMatchmaking("flex")}>
                      LEAGUE FLEX
                    </Dropdown.Item>
                    <Dropdown.Item onClick={matchmakingApex}>
                      Apex Legends
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Row>
            {noPlayer && (
              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <ModalTitle>
                    <h2>
                      <C.P>Attention</C.P>
                    </h2>
                  </ModalTitle>
                </Modal.Header>
                <Modal.Body>
                  <C.P>No player available at the moment, try later!</C.P>
                </Modal.Body>
                <Modal.Footer>
                  <C.Button_styled variant="secondary" onClick={handleClose}>
                    Close
                  </C.Button_styled>
                </Modal.Footer>
              </Modal>
            )}
            {Object.getOwnPropertyNames(topPlayersLeague).length !== 0 &&
              showTable === false && (
                <div>
                  <h2 style={{ color: "black" }}>
                    Top player League of Legends
                  </h2>
                  <Table
                    striped
                    bordered
                    hover
                    className="table text-black"
                    style={{
                      width: "100%",
                      fontSize: "25px",
                      border: "4px solid #ddd",
                    }}
                  >
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Nickname</th>
                      </tr>
                    </thead>
                    {Object.keys(topPlayersLeague).map((item) => (
                      <tbody>
                        <tr>
                          <td>{item}</td>
                          <td>{topPlayersLeague[item]}</td>
                        </tr>
                      </tbody>
                    ))}
                  </Table>
                </div>
              )}
            {Object.getOwnPropertyNames(topPlayersApex).length !== 0 &&
              showTable === false && (
                <div>
                  <h2 style={{ color: "black" }}>Top player Apex Legends</h2>
                  <Table
                    striped
                    bordered
                    hover
                    className="table text-black"
                    style={{
                      width: "100%",
                      fontSize: "25px",
                      border: "4px solid #ddd",
                    }}
                  >
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Nickname</th>
                      </tr>
                    </thead>
                    {Object.keys(topPlayersApex).map((item) => (
                      <tbody>
                        <tr>
                          <td>{item}</td>
                          <td>{topPlayersApex[item]}</td>
                        </tr>
                      </tbody>
                    ))}
                  </Table>
                </div>
              )}
            <Row>
              {showTable && namePhoto.size !== 0 && (
                <div style={{ color: "black", margin: "auto" }}>
                  <table
                    striped
                    bordered
                    hover
                    className="table text-black"
                    style={{
                      width: "100%",
                      fontSize: "25px",
                      border: "4px solid #ddd",
                    }}
                  >
                    <thead>
                      <tr>
                        <td>Profile photo</td>
                        <td>Nickname</td>
                        <td>Rank</td>
                        <td>Overview</td>
                      </tr>
                    </thead>

                    <tbody>
                      {usersData.map((item) => (
                        <tr
                          style={{
                            border: "4px solid #ddd",
                          }}
                        >
                          <td style={{ paddingLeft: "10px" }}>
                            {game === "Apex Legends" && (
                              <img
                                src={namePhoto.get(item.gameNickname)}
                                referrerPolicy="no-referrer"
                                style={{
                                  width: namePhoto
                                    .get(item.gameNickname)
                                    .startsWith("https://graph.facebook.com/")
                                    ? // ||
                                      // pathname.startsWith("/profile/")
                                      "100%"
                                    : "100%",
                                  borderRadius: "70%",
                                }}
                              />
                            )}

                            {game === "League of Legends" && (
                              <img
                                src={namePhoto.get(item.summonername)}
                                referrerPolicy="no-referrer"
                                style={{
                                  width: namePhoto
                                    .get(item.summonername)
                                    .startsWith("https://graph.facebook.com/")
                                    ? // ||
                                      // pathname.startsWith("/profile/")
                                      "75%"
                                    : "75%",
                                  borderRadius: "100%",
                                }}
                              />
                            )}
                          </td>
                          <td style={{ "padding-top": "40px" }}>
                            {game === "League of Legends" && (
                              <a>{item.summonername}</a>
                            )}
                            {game === "Apex Legends" && (
                              <a>{item.gameNickname}</a>
                            )}
                          </td>
                          <td style={{ "padding-top": "40px" }}>
                            {solo && <a>{item.ranksoloq}</a>}
                            {flex && <a>{item.rankflex}</a>}
                            {game === "Apex Legends" && <a>{item.rank}</a>}
                          </td>

                          <td style={{ "padding-top": "40px" }}>
                            <C.Button_styled onClick={() => sendPoke(game)}>
                              Send Poke
                            </C.Button_styled>
                            <C.Button_styled
                              onClick={() => visitProfile(item.id)}
                            >
                              Profile
                            </C.Button_styled>
                            <C.Button_styled onClick={() => openChat(item.id)}>
                              message
                            </C.Button_styled>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </Row>
          </C.Container>
        </div>
      </div>
    </>
  );

  //	<th>{usersData[match].rank}</th>
};

export default Matchmaking;

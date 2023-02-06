import React, { useState, useEffect } from "react";
import {
  auth,
  db,
  provider_google,
  provider_facebook,
} from "../../services/firebase";

import {
  FacebookLoginButton,
  GoogleLoginButton,
} from "react-social-login-buttons";
import Toast from "react-bootstrap/Toast";

import * as C from "./styles";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import Modal from "react-bootstrap/Modal";
import { H6 } from "../SidebarHeader/styles";
import Button from "react-bootstrap/Button";
import fetchStats from "../../services/user/fetchStatsApex";
import fetchStatsLeague from "../../services/user/fetchStatsLeague";
import { useCollection } from "react-firebase-hooks/firestore";
import fetchStatsApex from "../../services/user/fetchStatsApex";
import firebaseRequest from "../../services/firebaseRequest";
import { signInWithPopup } from "firebase/auth";
import { doc } from "firebase/firestore";
import Footer from "../Footer/Footer";

const Login = ({
  setTypeLogin,
  typeLogin,
  setApexData,
  apexData,
  setLeagueData,
  leagueData,
}) => {
  const [user, loading] = useAuthState(auth);
  const [leagueName, setLeagueName] = useState("");
  const [apexName, setApexName] = useState("");
  const [firebaseNickname, setFirebaseNickname] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const [call, setCall] = useState(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();

  const noWannaQname = "you need to setup at least the WannaQ nickname";
  const noAllNick = "you will require to setup nicknames later";
  const [showToast, setShowToast] = useState(false);

  const [showModalDialog, setModalDialog] = useState(false);
  const [type, setType] = useState(false);

  const handleCloseModalDialog = () => {
    if (type !== noWannaQname) {
      navigate("/profile/" + localStorage.getItem("nickname"));
    } else {
      setModalDialog(false);
      setShow(true);
    }
  };
  const handleShowModalDialog = (type) => {
    if (type === noWannaQname) {
      setType(noWannaQname);
    } else {
      setType(noAllNick);
    }
    setShowToast(true);
  };

  // setup il document utente
  // in caso cambi il nickname di wannaq viene aggiornato
  async function setFirebaseData(firebaseNickname) {
    const refChat = db.collection("users").doc(user.uid);
    await refChat
      .get()
      .then((doc) => {
        if (doc.exists) {
          if (doc.data().nickname !== firebaseNickname) {
            firebaseRequest.updateFirebaseNickname(user.uid, firebaseNickname);
          }
        } else {
          firebaseRequest.createUsr(
            user.email,
            user.uid,
            user.photoURL,
            firebaseNickname,
            leagueName,
            apexName
          );
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
    localStorage.setItem("nickname", firebaseNickname);
  }

  // :)
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  // setto localStorage, check if user exists otherwise show view new user
  const handleSignin = (provider) => {
    setTypeLogin(provider["providerId"]);
    let ready = false;
    setApexData(false);
    setLeagueData(false);
    if (!localStorage.getItem("accessToken")) {
      signInWithPopup(auth, provider)
        .then((res) => {
          localStorage.setItem("accessToken", res.user.accessToken);
          localStorage.setItem("uid", res.user.uid);
          localStorage.setItem("email", res.user.email);
          localStorage.setItem("photoUrl", res.user.photoURL);
          // DA COMMENTARE
          db.collection("users")
            .where("email", "==", res.user.email)
            .get()
            .then((doc) => {
              if (!doc.empty) {
                const dbRef = db.collection("users").doc(res.user.uid);
                dbRef
                  .get()
                  .then((doc) => {
                    if (doc.exists) {
                      console.log(doc.data().leagueNickname, "LeagueNickname");
                      console.log(doc.data().apexNickname, "apexNickname");
                      console.log(doc.data().nickname, "nickname");

                      if (doc.data().leagueNickname) {
                        fetchStatsLeague
                          .registerNewUser(doc.data().leagueNickname)
                          .catch((error) => {
                            fetchStatsLeague.getStatsLeague(
                              doc.data().leagueNickname
                            );
                          })
                          .finally(() => {
                            fetchStatsLeague
                              .getStatsLeague(doc.data().leagueNickname)
                              .then((res) => {
                                setLeagueData(res.data);
                                console.log("setting league data", leagueData);
                              });
                          });
                        if (doc.data().apexNickname) {
                          fetchStatsApex
                            .createUser(doc.data().apexNickname)
                            .catch((error) => {
                              console.log(error);
                              fetchStatsApex.getApexStats(
                                doc.data().apexNickname
                              );
                            })
                            .finally(() => {
                              fetchStatsApex
                                .getApexStats(doc.data().apexNickname)
                                .then((res) => {
                                  setApexData(res.data);
                                  console.log("setting apexData", apexData);
                                });
                            });
                        }
                      }
                    } else {
                      handleShow();
                    }
                    localStorage.setItem("nickname", doc.data().nickname);
                    sleep(100).then(() => {
                      navigate("/profile/" + doc.data().nickname);
                    });
                  })
                  .catch((error) => {
                    console.log("Error getting document:", error);
                  });
              } else {
                console.log("NEW USER ");
                handleShow();
              }
            });
        })
        .catch(alert);
    }
  };
  const alreadyLog = () => {
    db.collection("users")
      .doc(localStorage.getItem("uid"))
      .get()
      .then((doc) => {
        if (doc.exists) {
          navigate("/profile/" + doc.data().nickname);
        } else {
          localStorage.clear();
        }

        //
      });
  };

  useEffect(() => {
    if (localStorage.getItem("uid")) {
      alreadyLog();
    }
  }, []);

  return (
    <C.div>
      <div className="container-fluid">
        <div className="col-md-8 col-sm-10 col-12 mx-auto my-auto text-center">
          <h1>Welcome to WannaQ</h1>
          <p>
            Do you want to play your favorite games but you don't have friends
            to play with? Now you can with WannaQ
          </p>
          <h2>How does it work?</h2>
          <p>
            After the registration you will be asked to complete your profile.
            Then you will be able to find friends. In the Matchmaking section
            you can take a look at the profiles of compatible users and check
            out their in game stats.{" "}
          </p>
          <h2>Are you ready?</h2>
          <C.div_google className="col-md-8 col-sm-10 col-12 mx-auto my-auto text-center ">
            {localStorage.getItem("nickname") === null && (
              <GoogleLoginButton onClick={() => handleSignin(provider_google)}>
                <a className="text-black">Login con Google</a>
              </GoogleLoginButton>
            )}
          </C.div_google>
          <C.div_facebook className="col-md-8 col-sm-10 col-12 mx-auto my-auto text-center">
            {localStorage.getItem("nickname") === null && (
              <FacebookLoginButton
                width={"100px"}
                onClick={() => handleSignin(provider_facebook)}
              >
                Login con Facebook
              </FacebookLoginButton>
            )}
          </C.div_facebook>
        </div>
      </div>

      {show && (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title style={{ color: "black" }}>
              Enter your game Nickname
            </Modal.Title>

          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="form-group mb-2">
                <H6>Enter game Nickname WannaQ app </H6>
                <input
                  type="text"
                  placeholder="Enter game Nickname "
                  name="gameNickname"
                  className="form-control bg-transparent text-black"
                  value={firebaseNickname}
                  onChange={(e) => setFirebaseNickname(e.target.value)}
                ></input>
              </div>
            </form>
            <form>
              <div className="form-group mb-2">
                <H6>Enter game Nickname league </H6>
                <input
                  type="text"
                  placeholder="..."
                  name="gameNickname"
                  className="form-control bg-transparent text-black"
                  value={leagueName}
                  onChange={(e) => setLeagueName(e.target.value)}
                ></input>
              </div>
            </form>
            <form>
              <div className="form-group mb-2">
                <H6>Enter game Nickname apex </H6>
                <input
                  type="text"
                  placeholder="..."
                  name="gameNickname"
                  className="form-control bg-transparent text-black"
                  value={apexName}
                  onChange={(e) => setApexName(e.target.value)}
                ></input>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={async (event) => {
                handleClose(event);
                if (firebaseNickname.length !== 0) {
                  setFirebaseData(firebaseNickname).then(() => {
                    fetchStatsLeague.registerNewUser(leagueName).then(() => {
                      fetchStatsApex.createUser(apexName).then((res) => {
                        console.log(apexName);
                        // if (res.data !== apexName) {
                        //   firebaseRequest.updateNickname(
                        //     res.data,
                        //     localStorage.getItem("uid"),
                        //     "apex"
                        //   );
                        // }
                      });
                    });
                    if (leagueName || apexName) {
                      localStorage.setItem("nickname", firebaseNickname);
                      sleep(100).then(() => {
                        navigate("/profile/" + firebaseNickname);
                      });
                      // navigate profile
                    } else {
                      handleShowModalDialog(noAllNick);
                    }
                  });
                } else {
                  console.log(" no wannaq nick");
                  handleShowModalDialog(noWannaQname);
                  handleShow();
                }
              }}
              onChange={(e) => setCall(true)}
            >
              Save Changes
            </Button>
            <Toast
              onClose={() => setShowToast(false)}
              show={showToast}
              delay={3000}
              bg={"danger"}
              autohide
            >
              <Toast.Header>
                <strong className="me-auto">Error</strong>
              </Toast.Header>
              <Toast.Body style={{ color: "black", textSize: "15px" }}>
                {type}
              </Toast.Body>
            </Toast>
          </Modal.Footer>
        </Modal>
      )}
      {/* {type && (
        <Modal
          show={showModalDialog}
          onHide={() => handleCloseModalDialog(firebaseNickname)}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <C.Div>Attention</C.Div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <C.Div>{type}</C.Div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => handleCloseModalDialog(firebaseNickname)}
            >
              ok
            </Button>
          </Modal.Footer>
        </Modal>
      )} */}
    </C.div>
  );
};

export default Login;

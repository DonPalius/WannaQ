import React, { useEffect, useState } from "react";
import "bootstrap/js/src/collapse.js";
import {
  Accordion,
  Alert,
  Card,
  Col,
  Collapse,
  Container,
  Fade,
  Form,
  FormControl,
  Row,
} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import NavbarLogged from "../navbarLogged";
import Toast from "react-bootstrap/Toast";
import "../../assets/css/Style.css";
import {
  Div,
  AccordionWrapper,
  Input,
  Modal_Title,
  Modal_Body,
  H2,
  Div_1,
  Button_styled,
  H3_styled,
  H2_styled,
  Styled_Input,
} from "./settings.style";
import fetchStats from "../../services/user/fetchStatsApex";
import { auth, db } from "../../services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import firebaseRequest from "../../services/firebaseRequest";
import Modal from "react-bootstrap/Modal";
import fetchStatsApex from "../../services/user/fetchStatsApex";
import fetchStatsLeague from "../../services/user/fetchStatsLeague";
const Settings = ({ setTypeLogin, typeLogin }) => {
  const [openLeague, setOpenLeague] = useState(false);
  const [openApex, setOpenApex] = useState(false);
  let [leagueData, setLeagueData] = useState("");
  let [apexData, setApexData] = useState("");
  const [leagueName, setLeagueName] = useState("");
  const [apexName, setApexName] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const [newEmail, setNewEmail] = useState(null);
  const [showLeague, setShowLeague] = useState(false);
  const [showApexBox, setShowApexBox] = useState(false);
  const [showEmailBox, setShowEmailBox] = useState(false);
  const handleClose = () => setShowEmailBox(false);
  const handleShow = () => setShowEmailBox(true);

  const [user, loading] = useAuthState(auth);
  const modifyEmail = () => {
    firebaseRequest
      .updateEmail(localStorage.getItem("uid"), searchTerm)
      .then(() => {
        setSearchTerm("");
        handleClick("email", false);
      });
  };
  const getNickNames = async () => {
    const refChat = db.collection("users").doc(localStorage.getItem("uid"));
    await refChat
      .get()
      .then((doc) => {
        setLeagueName(doc.data().leagueNickname);
        setApexName(doc.data().apexNickname);
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  };

  const updateGameNickname = (game) => {
    if (searchTerm.length > 0) {
      if (game === "league") {
        fetchStatsLeague
          .updateNickname(searchTerm)
          .then(() => {
            firebaseRequest
              .updateNickname(searchTerm, localStorage.getItem("uid"), game)
              .then(() => {
                setLeagueName(searchTerm);

                handleClick("league", false);
              });
          })
          .catch((error) => {
            if (
              error.response.data.message === "User Not Present In Database"
            ) {
              firebaseRequest
                .updateNickname(searchTerm, localStorage.getItem("uid"), game)
                .then(() => {
                  setLeagueName(searchTerm);

                  handleClick("league", false);
                });
            } else {
              setError(error.response.data.message);
              setShowToast(true);
            }
          });
      } else {
        fetchStatsApex.upUsr(searchTerm).then(() => {
          firebaseRequest
            .updateNickname(searchTerm, localStorage.getItem("uid"), game)
            .then(() => {
              setApexName(searchTerm);
              handleClick("apex", false);
            });
        });
      }
    } else {
      setSearchTerm("");
    }
  };

  const handleClick = (type, action) => {
    if (type === "email") {
      setShowEmailBox(action);
    } else if (type === "apex") {
      setShowApexBox(action);
    } else if (type === "league") {
      setShowLeague(action);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("uid")) {
      navigate("/");
    }
    getNickNames();
  }, []);

  return (
    <>
      <div style={{ "background-color": "#ddd" }}>
        <div
          style={{
            "background-color": "white",
            textAlign: "center",
            margin: "auto",
            width: "50%",
            height: "100%",
          }}
        >
          <Div_1>
            <H2 className="mb-0" font-color="black">
              Personal information
            </H2>

            <Div>
              <Row>
                <Col>
                  <H3_styled>Email</H3_styled>
                </Col>
                <Col>
                  <div>
                    <H3_styled>{localStorage.getItem("email")}</H3_styled>
                  </div>
                </Col>
                <Col>
                  <Button_styled onClick={() => handleClick("email", true)}>
                    Modify
                  </Button_styled>
                  {showEmailBox && (
                    <Modal
                      show={showEmailBox}
                      onHide={() => handleClick("email", false)}
                    >
                      <Modal.Header closeButton>
                        <Modal_Title>
                          <H2_styled>Update email</H2_styled>
                        </Modal_Title>
                      </Modal.Header>
                      <Modal_Body>
                        <Styled_Input>
                          <Input
                            type="text"
                            placeholder="New Email"
                            value={searchTerm}
                            onChange={(e) => {
                              setSearchTerm(e.target.value);
                            }}
                          />
                        </Styled_Input>
                      </Modal_Body>
                      <Modal.Footer>
                        <Button_styled
                          variant="secondary"
                          onClick={() => handleClick("email", false)}
                        >
                          Close
                        </Button_styled>
                        <Button_styled variant="primary" onClick={modifyEmail}>
                          Save Changes
                        </Button_styled>
                      </Modal.Footer>
                    </Modal>
                  )}
                </Col>
              </Row>
              <Row>
                <Col>
                  <H3_styled>Type of login</H3_styled>
                </Col>
                <Col>
                  <H3_styled>{typeLogin}</H3_styled>
                </Col>
                <Col></Col>
              </Row>
            </Div>
            <Div>
              <Row>
                <Col>
                  <H3_styled>Email</H3_styled>
                </Col>
                <Col>
                  <div>
                    <H3_styled>{localStorage.getItem("email")}</H3_styled>
                  </div>
                </Col>
                <Col>
                  <Button_styled onClick={() => handleClick("email", true)}>
                    Modify
                  </Button_styled>
                  {showEmailBox && (
                    <Modal
                      show={showEmailBox}
                      onHide={() => handleClick("email", false)}
                    >
                      <Modal.Header closeButton>
                        <Modal_Title>
                          <H2_styled>Update email</H2_styled>
                        </Modal_Title>
                      </Modal.Header>
                      <Modal_Body>
                        <Styled_Input>
                          <Input
                            type="text"
                            placeholder="New Email"
                            value={searchTerm}
                            onChange={(e) => {
                              setSearchTerm(e.target.value);
                            }}
                          />
                        </Styled_Input>
                      </Modal_Body>
                      <Modal.Footer>
                        <Button_styled
                          variant="secondary"
                          onClick={() => handleClick("email", false)}
                        >
                          Close
                        </Button_styled>
                        <Button_styled variant="primary" onClick={modifyEmail}>
                          Save Changes
                        </Button_styled>
                      </Modal.Footer>
                    </Modal>
                  )}
                </Col>
              </Row>
              <Row>
                <Col>
                  <H3_styled>Type of login</H3_styled>
                </Col>
                <Col>
                  <H3_styled>{typeLogin}</H3_styled>
                </Col>
                <Col></Col>
              </Row>
            </Div>

            <H2 className="mb-0">Games information</H2>

            <Div>
              <Row>
                <Col>
                  <H3_styled>Apex Legends</H3_styled>
                </Col>
                <Col>
                  <H3_styled>{apexName}</H3_styled>
                </Col>
                <Col>
                  <Button_styled onClick={() => handleClick("apex", true)}>
                    Modify
                  </Button_styled>
                  {showApexBox && (
                    <Modal
                      show={showApexBox}
                      onHide={() => handleClick("apex", false)}
                    >
                      <Modal.Header closeButton>
                        <Modal_Title>
                          <H2_styled>Update apex</H2_styled>
                        </Modal_Title>
                      </Modal.Header>
                      <Modal_Body>
                        <Styled_Input>
                          <Input
                            type="text"
                            placeholder="New apex nickname"
                            value={searchTerm}
                            onChange={(e) => {
                              setSearchTerm(e.target.value);
                            }}
                          />
                        </Styled_Input>
                      </Modal_Body>
                      <Modal.Footer>
                        <Button_styled
                          variant="secondary"
                          onClick={() => handleClick("apex", false)}
                        >
                          Close
                        </Button_styled>
                        <Button_styled
                          variant="primary"
                          onClick={() => updateGameNickname("apex")}
                        >
                          Save Changes
                        </Button_styled>
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
                          <Toast.Body style={{ color: "black" }}>
                            {error}
                          </Toast.Body>
                        </Toast>
                      </Modal.Footer>
                    </Modal>
                  )}
                </Col>
              </Row>
              <Row>
                <Col>
                  <H3_styled>League of legends</H3_styled>
                </Col>
                <Col>
                  <H3_styled>{leagueName}</H3_styled>
                </Col>
                <Col>
                  <Button_styled onClick={() => handleClick("league", true)}>
                    Modify
                  </Button_styled>
                  {showLeague && (
                    <Modal
                      show={showLeague}
                      onHide={() => handleClick("league", false)}
                    >
                      <Modal.Header closeButton>
                        <Modal_Title>
                          <H2_styled>Update league nickname</H2_styled>
                        </Modal_Title>
                      </Modal.Header>
                      <Modal_Body>
                        <Styled_Input>
                          {" "}
                          <Input
                            type="text"
                            placeholder="New league nickname"
                            value={searchTerm}
                            onChange={(e) => {
                              setSearchTerm(e.target.value);
                            }}
                          />
                        </Styled_Input>
                      </Modal_Body>
                      <Modal.Footer>
                        <Button_styled
                          variant="secondary"
                          onClick={() => handleClick("league", false)}
                        >
                          Close
                        </Button_styled>
                        <Button_styled
                          variant="primary"
                          onClick={() => updateGameNickname("league")}
                        >
                          Save Changes
                        </Button_styled>
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
                          <Toast.Body style={{ color: "black" }}>
                            {error}
                          </Toast.Body>
                        </Toast>
                      </Modal.Footer>
                    </Modal>
                  )}
                </Col>
              </Row>
            </Div>
          </Div_1>
        </div>
      </div>
    </>
  );
};

export default Settings;

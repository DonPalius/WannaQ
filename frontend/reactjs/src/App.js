import React, { useEffect, useState } from "react";
import "./App.css";

import { Container, Row, Col } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle";
import Profile from "./components/profile/Profile.js";
import Matchmaking from "./components/matchmaking/Matchmaking";
import HomeChat from "./components/HomeChat/HomeChat";
import NavbarLogged from "../src/components/navbarLogged/index";
import Settings from "./components/Settings";
import Login from "./components/Login";
import Footer from "./components/Footer/Footer";

// tolto footer <Footer /> per problema di css con la chat

function App() {
  const [log, setLog] = useState(false);
  const [typeLogin, setTypeLogin] = useState(null);
  const [apexData, setApexData] = useState(false);
  const [leagueData, setLeagueData] = useState(false);

  window.onbeforeunload = (event) => {
    const e = event || window.event;
    e.preventDefault();
    if (e) {
      e.returnValue = "";
    }
    return "";
  };
  useEffect(() => {
    setLog(window.location.href);
  }, [log]);
  return (
    <>
      <div>
        <Router>
          <Row>
            <Col>
              <Routes>
                <Route
                  path="/"
                  element={
                    <Login
                      setTypeLogin={setTypeLogin}
                      typeLogin={typeLogin}
                      setApexData={setApexData}
                      apexData={apexData}
                      setLeagueData={setLeagueData}
                      leagueData={leagueData}
                    />
                  }
                />
                <Route
                  path="*"
                  element={
                    <WithNav
                      setTypeLogin={setTypeLogin}
                      typeLogin={typeLogin}
                      setApexData={setApexData}
                      apexData={apexData}
                      setLeagueData={setLeagueData}
                      leagueData={leagueData}
                    />
                  }
                />
              </Routes>
            </Col>
          </Row>
          <Footer />
        </Router>
      </div>
    </>
  );
}

export default App;

function WithNav({
  setTypeLogin,
  typeLogin,
  setApexData,
  apexData,
  setLeagueData,
  leagueData,
}) {
  const [end, setEnd] = useState(false);
  const [usr, setUsr] = useState(null);
  const [topPlayersLeague, setTopPlayersLeague] = useState(new Map());
  const [topPlayersApex, setTopPlayersApex] = useState(new Map());

  const [friendList, setFriendList] = useState(new Map());

  return (
    <>
      <NavbarLogged
        setEnd={setEnd}
        end={end}
        topPlayersLeague={topPlayersLeague}
        setTopPlayersLeague={setTopPlayersLeague}
        topPlayersApex={topPlayersApex}
        setTopPlayersApex={setTopPlayersApex}
      />

      <div>
        <Routes>
          <Route
            path="/profile/:name"
            element={
              <Profile
                setEnd={setEnd}
                end={end}
                usr={usr}
                setUsr={setUsr}
                friendList={friendList}
                setFriendList={setFriendList}
                setApexData={setApexData}
                apexData={apexData}
                setLeagueData={setLeagueData}
                leagueData={leagueData}
              />
            }
          />
          <Route
            path="/chat"
            element={
              <HomeChat
                usr={usr}
                setUsr={setUsr}
                friendList={friendList}
                setFriendList={setFriendList}
              />
            }
          />
          <Route
            path="/matchmaking"
            element={
              <Matchmaking
                setEnd={setEnd}
                end={end}
                usr={usr}
                setUsr={setUsr}
                topPlayersLeague={topPlayersLeague}
                topPlayersApex={topPlayersApex}
              />
            }
          />
          <Route
            path="/settings"
            element={
              <Settings setTypeLogin={setTypeLogin} typeLogin={typeLogin} />
            }
          />
        </Routes>
      </div>
    </>
  );
}

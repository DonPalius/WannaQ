import React from "react";
import * as C from "./styles";
import { MdPerson, MdMoreVert, MdSearch } from "react-icons/md";
import NavbarLogged from "../navbarLogged";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../services/firebase";

const ChatHeader = ({ photoURL, name }) => {
  return (
    <C.Container>
      <C.UserInfo>
        {!photoURL && <MdPerson />}
        {photoURL && (
          <C.Avatar
            rel="noreferrer"
            referrerpolicy="no-referrer"
            src={photoURL}
          />
        )}
        <C.NameContent>
          <C.Name>{name}</C.Name>
        </C.NameContent>
      </C.UserInfo>
    </C.Container>
  );
};

export default ChatHeader;

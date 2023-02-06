import styled, { css } from "styled-components";
import { NavLink as Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";

export const Container_search = styled.div`
  background: teal;
  position: relative;
  width: 100%;
  display: flex;
  margin: auto;
  padding-top: 2%;
  justify-content: flex-start;
  z-index: 10;
`;
export const Button_styled = styled.button`
display:inline-block;
  padding:0.46em 1.6em;
  border:0.1em solid #000000;
  margin:0 0.2em 0.2em 0;
    border-radius: 25px;
  box-sizing: border-box;
  text-decoration:none;
  font-weight:300;
  color:white;
  text-shadow: 0 0.04em 0.04em rgba(0,0,0,0.35);
  background-color:midnightblue;
  text-align:center;
  transition: all 0.15s;
  :hover {
    text-shadow: 0 0 2em rgba(255,255,255,1);
    color:pink;
    border-color:pink;
  }
  @media all and (max-width:30em){
      a{
            display:block;
            margin:0.4em auto;
      }
`;

export const Styled_ListItem = styled.div`
  border-color: grey;
  padding-top: 3%;
  padding-bottom: 3%;
  height: auto;
  width: auto;
  text-align: center;
  border: 2px solid gainsboro;

`;

export const Styled_ListGroup = styled.div`
  background: black;
  color: black;
`;

export const Offcanvas_menu = styled.div`
  background: teal;
  height: 100%;
  display: relative;
`;

export const Nav = styled.nav`
  height: 150px;
  text-align: center;
  width: 100%;
  overflow: auto;
  padding-left: 10px;
  justify-content: flex-start;
  z-index: 10;
  /* Third Nav */
  /* justify-content:  */
`;
export const Modal_Title = styled.div`
  color: black;
`;
export const Modal_Body = styled.div`
  color: black;
`;

export const StyledIcon = styled.div`
  padding-left: 10%;
  cursor: pointer;
  &.active {
    color: #15cdfc;
  }
`;

export const NavLink = styled(Link)`
  color: white;
  text-align: center;
  align-items: center;
  text-decoration: none;
  height: 100%;
  width: 100%;
  padding-top: 1%;
  padding-left: 10%;
  font-size: 150%;

  cursor: pointer;
  &.active {
    color: #15cdfc;
  }
`;

export const Bars = styled(FaBars)`
  display: none;
  color: red;
  @media screen and (max-width: 768px) {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100%, 75%);
    font-size: 1.8rem;
    cursor: pointer;
  }
`;

export const NavMenu = styled.div`
  display: flex;
  align-items: center;
  margin: auto;
  /* Second Nav */
  /* margin-right: 24px; */
  /* Third Nav */
  /* width: 100vw;
  white-space: nowrap; */
  @media screen and (max-width: 768px) {
    display: none;
  }
`;
export const Input = styled.input`
  ::placeholder,
  ::-webkit-input-placeholder {
    color: black;
  }
  :-ms-input-placeholder {
    color: black;
  }
`;

export const H2 = styled.h2`
  color: white;
  padding-right: 150px;
`;

export const Div = styled.div`
  color: black;
`;

export const NavBtn = styled.nav`
  background: white;
  color: black;
  display: flex;
  align-items: center;
  margin-right: 24px;
  /* Third Nav */
  /* justify-content: flex-end;
  width: 100vw; */
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const NavBtnLink = styled(Link)`
  border-radius: 4px;
  background: white;
  color: black;
  padding: 10px 22px;
  outline: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  /* Second Nav */
  margin-left: 24px;
  &:hover {
    transition: all 0.2s ease-in-out;
    background: #fff;
    color: #010606;
  }
`;

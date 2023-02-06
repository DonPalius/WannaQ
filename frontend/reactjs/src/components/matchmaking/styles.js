import styled from "styled-components";
import test from "./prova.jpg";

// export const bg_img = styled.div`
//   background-image: url(${test});
//   background-repeat: no-repeat;
//   height: 70vh;
// `;
export const Container = styled.div`
  width: 70%;
  padding-left: 10%;
  padding-right: 10%;

  height: 50vh;
  display: inline-block;
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
  background-color:darkblue;
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

export const Table = styled.div`
  border-collapse: collapse;
  border-spacing: 0;
`;

export const P = styled.div`
  color: black;
`;
export const Modal_Title = styled.div`
  color: black;
`;
export const Modal_Body = styled.div`
  color: black;
`;

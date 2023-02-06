import styled, { css } from "styled-components";
export const Div = styled.div`
  color: black;
  text-align: center;
`;

export const styled_div_background = styled.div`
  background-color: black;
  textalign: center;
  padding-top: 20px;
  width: 20%;
  height: 100%;
`;

export const stars_styled = styled.div`
  margin: auto;
  width: 50%;
`;

export const styled_bio = styled.div`
  width: 30%;
  border: 2px solid black;
`;

export const friend_list_styled = styled.div`
  border-block-color: black;
  padding-top: 3px;
  border: 2px solid black;
`;

export const Container = styled.div`
  height: 100%;
  padding-top: 20px;
  position: sticky;
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

export const background = styled.nav`
  color: black;
`;

export const Div_checkbox = styled.nav`
  background-color: black;
`;
export const Modal_Title = styled.div`
  color: black;
`;
export const Modal_Body = styled.div`
  color: black;
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

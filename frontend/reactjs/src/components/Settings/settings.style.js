import styled, { css } from "styled-components";
export const Div = styled.div`
  position: sticky;
  display: flex;
  background: teal;
  border: 4px solid teal;
  flex-direction: column;
  width: auto;
  margin: auto auto;
  border-style: inset;
  border-spacing: 40px;
  position: relative;
  border-bottom: 4px solid gray;
  border-left: 4px solid gray;
`;

export const Styled_Input = styled.div`
  padding-left: 20px;
`;
export const Div_1 = styled.div`
  border-left: 4px solid gray;
  border-right: 4px solid gray;
`;

export const H2_styled = styled.h2`
  color: black;
`;
export const H3_styled = styled.h3`
  color: white;
  padding-top: 10px;
  margin: auto;
  padding-bottom: 10px;
  font-size: 20px;
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
  font-size: 130%;
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

export const H2 = styled.h2`
  color: black;
  height: 7%;
  padding-top: 2%;
  padding-bottom: 2%;
  border-top: 4px solid grey;
  border-right: 4px solid grey;
  border-left: 4px solid grey;
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

export const Modal_Title = styled.div``;
export const Modal_Body = styled.div``;

export const AccordionWrapper = styled.div`
  background-color: grey;
  position: relative;
  display: flex;
  flex-direction: column;
  width: auto;
  word-wrap: break-word;
  background-clip: border-box;
  margin: auto auto;
  border-style: ridge;
  border-spacing: 40px;
  position: relative;
  border-color: dark gray;
`;

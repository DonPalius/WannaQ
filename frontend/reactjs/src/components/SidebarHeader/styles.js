import styled from "styled-components";

export const Container = styled.div`
  height: 59px;
  background-color: #f0f2f5;
  padding: 10px 16px;+
  color:black;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
  box-shadow: 0 1px 2px #0003;
`;
export const H6 = styled.h6`
  color: black;
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
export const Div = styled.nav`
  color: black;
  font-size: 20px;
`;

export const Modal_Title = styled.div`
  color: black;
`;
export const Modal_Body = styled.div`
  color: black;
`;
export const Avatar = styled.img`
  width: 40px;
  height: 40px;
  cursor: pointer;
  border-radius: 50%;
  color: black;
`;

export const Options = styled.div`
  display: flex;
  gap: 10px;

  svg {
    width: 24px;
    height: 24px;
    color: #54656f;
    cursor: pointer;
  }
`;

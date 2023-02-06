import styled from "styled-components";

export const Box = styled.div`
  position: relative;
  background: midnightblue;
  bottom: 0;
  width: 100%;
  align-items: center;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  text-align: center;

  /* background: red; */
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

export const Row = styled.div`
  grid-template-columns: repeat(auto-fill, minmax(185px, 1fr));
  grid-gap: 50px;
  justify-content: center;
  display: flex;

  @media (max-width: 100%) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
`;

export const FooterLink = styled.a`
  color: #fff;
  margin-bottom: 20px;
  font-size: 100%;

  text-decoration: none;

  &:hover {
    color: green;
    transition: 200ms ease-in;
  }
`;

export const Heading = styled.p`
  font-size: 15px;
  color: #fff;
  margin-bottom: 40px;
  font-weight: bold;
`;

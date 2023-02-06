import React from "react";
import {
  Box,
  Container,
  Row,
  Column,
  FooterLink,
  Heading,
} from "./FooterStyles";
import { useLocation } from "react-router-dom";
const Footer = () => {
  const { pathname } = useLocation();
  return (
    <Box
      style={{
        position:
          pathname === "/chat" ||
          pathname === "/" ||
          pathname === "/matchmaking" ||
          pathname.startsWith("/profile/")
            ? // ||
              // pathname.startsWith("/profile/")
              "relative"
            : "fixed",
        height: pathname === "/chat" ? "30vh" : "auto",
      }}
    >
      <Row>
        <Column>
          <Heading>About Us</Heading>
          <FooterLink href="#">Aim</FooterLink>
          <FooterLink href="#">Vision</FooterLink>
        </Column>
        <Column>
          <Heading>Contact Us</Heading>
          <FooterLink href="https://www.linkedin.com/in/andrea-paletto-b8365a245/">
            Don Palius
          </FooterLink>
        </Column>
        <Column>
          <Heading>Social Media</Heading>
          <FooterLink href="https://it-it.facebook.com/">
            <i className="fab fa-facebook-f">
              <span style={{ marginLeft: "10px" }}>Facebook</span>
            </i>
          </FooterLink>
          <FooterLink href="https://www.instagram.com/">
            <i className="fab fa-instagram">
              <span style={{ marginLeft: "10px" }}>Instagram</span>
            </i>
          </FooterLink>
        </Column>
      </Row>
    </Box>
  );
};
export default Footer;

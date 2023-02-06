import styled, { css } from 'styled-components';

export const Btn = styled.button`
	display: block;
	background: var(--darkblue);
	width: 10%;
	min-width: 150px;
	height: 50px;
	border-radius: 30px;
	color: var(--white);
	border: 0;
	font-size: var(--fontBig);
	margin: 20px auto;
	transition: all 0.3s;
	outline: none;
	cursor: pointer;

	:hover {
		opacity: 0.8;
	}
`;

export const Nav = styled.nav`
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-around;
	align-items: center;
	background: var(--bg);
	color: var(--text);
	transition: all 150ms linear;
	${(props) =>
		props.isScrolled &&
		css`
			background: var(--headerBg);
			box-shadow: var(--headerBoxShadow);
		`}
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 64px;
	padding: 0 60px;
	z-index: 2;
	@media screen and (max-width: 768px) {
		justify-content: space-between;
		padding: 0 30px;
	}
	.logo {
		flex: 2;
		color: var(--text);
		font-size: 32px;
	}
	.nav-links {
		@media screen and (max-width: 768px) {
			display: none;
		}
	}
	.hamburger-react {
		display: none;
		z-index: 99;
		& > div > div {
			background: var(--text) !important;
		}
		@media screen and (max-width: 768px) {
			display: block;
		}
	}
`;

export const Wrapper = styled.div`
	max-width: var(--maxWidth);
	margin: 0 auto;
	padding: 0 20px;

	h1 {
		color: var(--medGrey);

		@media screen and (max-width: 768px) {
			font-size: var(--fontBig);
		}
	}
`;

export const Box = styled.div`
	h1 {
		color: var(--medGrey);

		@media screen and (max-width: 768px) {
			font-size: var(--fontBig);
		}
	}
`;

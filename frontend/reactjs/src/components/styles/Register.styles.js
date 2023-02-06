import styled, { css } from 'styled-components';
export const Btn = styled.button`
	display: block;
	background: var(--green);
	width: 5%;
	min-width: 300px;
	height: 60px;
	border-radius: 10px;
	color: var(--white);
	border: 0;
	font-size: var(--fontBig);
	margin: 10px auto;
	transition: all 0.3s;
	outline: none;
	cursor: pointer;

	:hover {
		opacity: 0.8;
	}
`;

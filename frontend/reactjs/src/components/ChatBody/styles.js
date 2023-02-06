import styled from "styled-components";

export const Container = styled.div`
  background-image: url("https://img.freepik.com/free-vector/stylish-hexagonal-line-pattern-background_1017-19742.jpg?w=2000");
  overflow-y: auto;
  height: 100%;
  border-right: 2px solid gray;
  &::-webkit-scrollbar {
    width: 6px;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

import styled from "styled-components";

export const Wrapper = styled.div`
  // border: 1px solid;
  height: 79vh;
  padding: 15px ;
`;

export const StyledEvent = styled.span`
  background: ${({ bgColor }) => bgColor};
  color: white;
  text-align: left !important;
  padding: 2px 10px;
  margin: 0 3px;
  border-radius: 10px;
  font-size: 13px;
  // cursor: pointer;
  text-transform: capitalize;
`;

export const SevenColGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  ${(props) => props.fullheight && `height: calc(100% - 75px);`}
  ${(props) =>
    props.fullheight &&
    `grid-template-rows: repeat(6, 1fr);`}
  div {
    display: grid;
    border: 1px solid;
    ${StyledEvent} {
      display: none;
    }
    ${StyledEvent}:nth-child(-n + 3) {
      display: block;
    }

    span {
      text-align: right;
      padding-right: 15px;
      height: fit-content;
    }

    span.active {
      background-color: pink;
      border-bottom: 2px solid red;
      position: relative;
    }
    span.active::before {
      content: "Today ";
      font-size: 14px;
    }
  }
`;

export const HeadDays = styled.span`
  text-align: center;
  border: 1px solid;
  height: 30px;
  padding: 5px;
  background: darkolivegreen;
  color: white;
`;

export const DateControls = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  align-items: center;

  ion-icon {
    font-size: 1.6rem;
    cursor: pointer;
  }
`;

export const SeeMore = styled.p`
  font-size: 12px;
  padding: 0 5px;
  margin-bottom: 0;
`;

export const View = styled.p`
text-align: right;
content-align: bottom;
  font-size: 12px;
  padding: 0 5px;
  margin-bottom: 0;
  cursor: pointer;
`;

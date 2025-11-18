import styled from 'styled-components';

export const Main = styled.main`
  margin: 0 auto;
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  display: block;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 0px;
  }
`;

export const HeaderWrapper = styled.header`
  display: flex;
  flex-direction: column;
  background: ${({ theme: { colors } }) => colors.bgColor};
  width: 100%;
  min-height: 60px;
  box-sizing: border-box;

  @media screen and (min-width: 1200px) {
    flex-direction: column-reverse;
  }
`;

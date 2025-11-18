import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const ShimmerEffect = styled.div`
  animation: ${shimmer} 1.5s linear infinite forwards;
  background: linear-gradient(to right, 
    ${props => props.theme.name === 'dark' ? '#2a2a2a' : '#f6f6f6'} 8%, 
    ${props => props.theme.name === 'dark' ? '#3a3a3a' : '#e6e6e6'} 18%, 
    ${props => props.theme.name === 'dark' ? '#2a2a2a' : '#f6f6f6'} 33%);
  background-size: 800px 104px;
  border-radius: 4px;
`;

const NavbarContainer = styled.nav`
  position: sticky;
  top: 0;
  z-index: 100;
  background: ${props => props.theme.colors.cardBackground};
  border-bottom: 1px solid ${props => props.theme.colors.borderColor};
  padding: 0;
  width: 100%;
  margin-top: 24px;
`;

const NavbarContent = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 16px;
  overflow-x: auto;
  height: 56px;
  
  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

const TabShimmer = styled(ShimmerEffect)`
  height: 32px;
  width: 100px;
  margin-right: 24px;
  border-radius: 16px;
  flex-shrink: 0;
`;

const NavbarShimmer: React.FC = () => {
  return (
    <NavbarContainer>
      <NavbarContent>
        <TabShimmer />
        <TabShimmer />
        <TabShimmer />
        <TabShimmer />
        <TabShimmer />
        <TabShimmer />
      </NavbarContent>
    </NavbarContainer>
  );
};

export default NavbarShimmer;

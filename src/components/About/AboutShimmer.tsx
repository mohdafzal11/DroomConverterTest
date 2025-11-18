import React from 'react';
import styled, { keyframes } from 'styled-components';
import { AboutContainer, AboutSection, ButtonContainer } from './About.styled';

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

const HeadingShimmer = styled(ShimmerEffect)`
  width: 300px;
  height: 38px;
  margin-bottom: 1.5rem;
  border-radius: 6px;
`;

const TextShimmer = styled(ShimmerEffect)`
  width: 100%;
  max-width: 800px;
  height: 20px;
  margin-bottom: 12px;
  border-radius: 4px;
`;

const ButtonShimmer = styled(ShimmerEffect)`
  width: 150px;
  height: 45px;
  border-radius: 2rem;
`;

const AboutShimmer: React.FC = () => {
  return (
    <AboutContainer>
      {/* First token section */}
      <AboutSection>
        <HeadingShimmer />
        <TextShimmer />
        <TextShimmer />
        <TextShimmer style={{ width: '80%' }} />
        <ButtonContainer>
          <ButtonShimmer />
          <ButtonShimmer />
        </ButtonContainer>
      </AboutSection>

      {/* Second token section */}
      <AboutSection>
        <HeadingShimmer />
        <TextShimmer />
        <TextShimmer />
        <TextShimmer style={{ width: '70%' }} />
        <ButtonContainer>
          <ButtonShimmer />
          <ButtonShimmer />
        </ButtonContainer>
      </AboutSection>
    </AboutContainer>
  );
};

export default AboutShimmer;

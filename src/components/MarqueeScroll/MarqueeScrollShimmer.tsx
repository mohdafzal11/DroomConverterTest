import React from 'react';
import styled, { keyframes } from 'styled-components';
import { MarqueeContainer } from './MarqueeScroll.styled';

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

const MarqueeContentShimmer = styled.div`
  display: flex;
  padding: 6px 16px;
  gap: 32px;
  width: max-content;
`;

const TokenItemShimmer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
`;

const TokenIconShimmer = styled(ShimmerEffect)`
  width: 24px;
  height: 24px;
  border-radius: 50%;
`;

const TokenNameShimmer = styled(ShimmerEffect)`
  width: 80px;
  height: 16px;
  border-radius: 4px;
`;

const TokenPriceShimmer = styled(ShimmerEffect)`
  width: 60px;
  height: 16px;
  border-radius: 4px;
`;

const TokenChangeShimmer = styled(ShimmerEffect)`
  width: 50px;
  height: 16px;
  border-radius: 4px;
`;

const TokenInfoShimmer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MarqueeScrollShimmer: React.FC = () => {
  const shimmerTokens = Array.from({ length: 15 }, (_, index) => (
    <TokenItemShimmer key={index}>
      <TokenIconShimmer />
      <TokenInfoShimmer>
        <TokenNameShimmer />
        <TokenPriceShimmer />
        <TokenChangeShimmer />
      </TokenInfoShimmer>
    </TokenItemShimmer>
  ));

  return (
    <MarqueeContainer>
      <MarqueeContentShimmer>
        {shimmerTokens}
      </MarqueeContentShimmer>
    </MarqueeContainer>
  );
};

export default MarqueeScrollShimmer;

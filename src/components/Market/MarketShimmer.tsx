import React from 'react';
import styled, { keyframes } from 'styled-components';
import { 
  MarketContainer, 
  MarketHeading, 
  MarketStatusSection, 
  MarketStatsGrid, 
  MarketItemContainer,
  FiatTableContainer 
} from './Market.styled';

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
  width: 200px;
  height: 40px;
  margin-bottom: 2rem;
  border-radius: 8px;
`;

const TitleShimmer = styled(ShimmerEffect)`
  width: 300px;
  height: 28px;
  margin-bottom: 1rem;
  border-radius: 6px;
`;

const TextShimmer = styled(ShimmerEffect)`
  width: 100%;
  height: 20px;
  margin-bottom: 10px;
  border-radius: 4px;
`;

const ShortTextShimmer = styled(ShimmerEffect)`
  width: 60%;
  height: 20px;
  margin-bottom: 0.5rem;
  border-radius: 4px;
`;

const ValueShimmer = styled(ShimmerEffect)`
  width: 100px;
  height: 32px;
  margin-bottom: 0.75rem;
  border-radius: 4px;
`;

const SubtitleShimmer = styled(ShimmerEffect)`
  width: 80px;
  height: 18px;
  border-radius: 4px;
`;

const ButtonShimmer = styled(ShimmerEffect)`
  width: 150px;
  height: 45px;
  border-radius: 3rem;
  margin: 0 auto;
  margin-bottom: 3rem;
`;

const TableShimmer = styled(ShimmerEffect)`
  width: 100%;
  height: 300px;
  border-radius: 8px;
`;

const MarketShimmer: React.FC = () => {
  return (
    <MarketContainer>
      <HeadingShimmer />
      
      {/* First market section */}
      <MarketStatusSection>
        <TitleShimmer />
        <TextShimmer />
        <TextShimmer />
        <ShortTextShimmer />
      </MarketStatusSection>
      
      <MarketStatsGrid>
        <MarketItemContainer>
          <ValueShimmer />
          <SubtitleShimmer />
        </MarketItemContainer>
        
        <MarketItemContainer>
          <ValueShimmer />
          <SubtitleShimmer />
        </MarketItemContainer>
        
        <MarketItemContainer>
          <ValueShimmer />
          <SubtitleShimmer />
        </MarketItemContainer>
      </MarketStatsGrid>
      
      <ButtonShimmer />
      
      {/* Second market section */}
      <MarketStatusSection>
        <TitleShimmer />
        <TextShimmer />
        <TextShimmer />
        <ShortTextShimmer />
      </MarketStatusSection>
      
      <MarketStatsGrid>
        <MarketItemContainer>
          <ValueShimmer />
          <SubtitleShimmer />
        </MarketItemContainer>
        
        <MarketItemContainer>
          <ValueShimmer />
          <SubtitleShimmer />
        </MarketItemContainer>
        
        <MarketItemContainer>
          <ValueShimmer />
          <SubtitleShimmer />
        </MarketItemContainer>
      </MarketStatsGrid>
      
      <ButtonShimmer />
      
      <FiatTableContainer>
        <TableShimmer />
      </FiatTableContainer>
    </MarketContainer>
  );
};

export default MarketShimmer;

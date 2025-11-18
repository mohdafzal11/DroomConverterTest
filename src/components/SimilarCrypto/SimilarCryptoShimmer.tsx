import React from 'react';
import styled, { keyframes } from 'styled-components';
import {
  Container,
  Header,
  GridContainer,
  MarqueeContainer,
  MarqueeRow,
  MarqueeContent,
  ShimmerCard,
  ShimmerImage,
  ShimmerText,
  ShimmerPrice
} from './SimilarCrypto.styled';

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
  height: 30px;
  margin-bottom: 1.5rem;
  border-radius: 6px;
`;

const SubheadingShimmer = styled(ShimmerEffect)`
  width: 220px;
  height: 24px;
  margin-bottom: 1rem;
  margin-top: 2rem;
  border-radius: 6px;
`;

const DescriptionShimmer = styled(ShimmerEffect)`
  width: 100%;
  max-width: 600px;
  height: 16px;
  margin-bottom: 1.5rem;
  border-radius: 4px;
`;

const SimilarCryptoShimmer: React.FC = () => {
  // Function to render a row of shimmer cards
  const renderShimmerRow = (count: number, isReverse: boolean = false) => {
    // Create an array with fixed keys to ensure consistent server/client rendering
    const items = Array.from({ length: count }, (_, i) => i);
    
    return (
      <MarqueeRow>
        <MarqueeContent isReverse={isReverse} style={{ animation: 'none' }}>
          {items.map((index) => (
            <ShimmerCard key={`shimmer-${isReverse ? 'rev-' : ''}${index}`} style={{ animation: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShimmerImage />
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.25rem', 
                  marginLeft: '0.75rem' 
                }}>
                  <ShimmerPrice />
                  <ShimmerText width="40px" />
                </div>
              </div>
            </ShimmerCard>
          ))}
        </MarqueeContent>
      </MarqueeRow>
    );
  };

  return (
    <Container>
      <Header>
        <HeadingShimmer />
      </Header>

      {/* Similar Assets Section */}
      <SubheadingShimmer />
      <DescriptionShimmer />
      
      <MarqueeContainer>
        {renderShimmerRow(12)}
        {renderShimmerRow(12, true)}
      </MarqueeContainer>

      {/* Top Crypto Assets Section */}
      <SubheadingShimmer />
      <DescriptionShimmer />
      
      <MarqueeContainer>
        {renderShimmerRow(12)}
      </MarqueeContainer>

      {/* How to Buy Guides Section */}
      <SubheadingShimmer />
      <DescriptionShimmer />
      
      <GridContainer>
        {Array.from({ length: 6 }, (_, i) => i).map((index) => (
          <ShimmerCard key={`guide-shimmer-${index}`} style={{ animation: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShimmerImage />
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.25rem', 
                marginLeft: '0.75rem' 
              }}>
                <ShimmerPrice />
                <ShimmerText width="80px" />
              </div>
            </div>
          </ShimmerCard>
        ))}
      </GridContainer>
    </Container>
  );
};

export default SimilarCryptoShimmer; 
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { 
  RelatedContainer, 
  SectionHeading, 
  SubHeading, 
  SectionDescription, 
  CardGrid, 
  CardRow, 
  CardRowInner, 
  IconsWrapper 
} from './Related.styled';

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
  width: 400px;
  height: 38px;
  margin-bottom: 2rem;
  border-radius: 6px;
`;

const SubHeadingShimmer = styled(ShimmerEffect)`
  width: 300px;
  height: 28px;
  margin-bottom: 0.5rem;
  border-radius: 6px;
`;

const DescriptionShimmer = styled(ShimmerEffect)`
  width: 100%;
  max-width: 800px;
  height: 20px;
  margin-bottom: 2rem;
  border-radius: 4px;
`;

const CryptoCardShimmer = styled.div`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  padding: 0.6rem 0.9rem;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.bgColor};
  border: 1px solid rgba(239, 242, 245, 0.5);
  box-shadow: rgba(0, 0, 0, 0.05) 0px 4px 12px;
  flex: 0 0 auto;
  min-width: auto;
  margin: 0 0.25rem;
`;

const IconShimmer = styled(ShimmerEffect)`
  width: 24px;
  height: 24px;
  border-radius: 50%;

  @media (max-width: 480px) {
    width: 16px;
    height: 16px;
  }
`;

const CardContentShimmer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-left: 0.75rem;
`;

const TickerShimmer = styled(ShimmerEffect)`
  width: 70px;
  height: 12px;
  border-radius: 3px;
  margin-bottom: 6px;
`;

const PriceShimmer = styled(ShimmerEffect)`
  width: 90px;
  height: 16px;
  border-radius: 3px;
  margin-bottom: 6px;
`;

const ChangeShimmer = styled(ShimmerEffect)`
  width: 50px;
  height: 10px;
  border-radius: 3px;
`;

const RelatedShimmer: React.FC = () => {
  // Create an array of shimmering crypto cards
  const renderCryptoCards = (count: number) => {
    return Array.from({ length: count }, (_, index) => (
      <CryptoCardShimmer key={`card-shimmer-${index}`}>
        <IconsWrapper>
          <IconShimmer />
          <IconShimmer style={{ marginLeft: '-8px' }}/>
        </IconsWrapper>
        <CardContentShimmer>
          <TickerShimmer />
          <PriceShimmer />
          <ChangeShimmer />
        </CardContentShimmer>
      </CryptoCardShimmer>
    ));
  };

  return (
    <RelatedContainer>
      <HeadingShimmer />

      {/* Popular conversions section */}
      <div>
        <SubHeadingShimmer />
        <DescriptionShimmer />

        <CardGrid>
          <CardRow>
            <CardRowInner>
              {renderCryptoCards(12)}
            </CardRowInner>
          </CardRow>
        </CardGrid>
      </div>

      {/* Convert other assets section */}
      <div>
        <SubHeadingShimmer />
        <DescriptionShimmer />

        <CardGrid>
          {Array.from({ length: 3 }, (_, rowIndex) => (
            <CardRow key={`row-shimmer-${rowIndex}`}>
              <CardRowInner isReverse={rowIndex % 2 === 1}>
                {renderCryptoCards(12)}
              </CardRowInner>
            </CardRow>
          ))}
        </CardGrid>
      </div>
    </RelatedContainer>
  );
};

export default RelatedShimmer;

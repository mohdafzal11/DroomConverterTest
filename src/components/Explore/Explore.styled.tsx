import styled, { keyframes } from 'styled-components';

export const ExploreContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: -60px auto 0; /* pull much closer to converter */
  padding: 0 1rem;
  position: relative;
  z-index: 1;
`;

export const SectionHeading = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textColor};
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

export const SectionDescription = styled.p`
  font-size: 1.05rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.textColorSub};
  max-width: 800px;
`;

export const CardGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow: hidden;
  margin-bottom:2rem;
`;

const scrollLeft = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-33.333%);
  }
`;

const scrollRight = keyframes`
  from {
    transform: translateX(-33.333%);
  }
  to {
    transform: translateX(0);
  }
`;

export const CardRow = styled.div`
  width: 100%;
  overflow: hidden;
  mask-image: linear-gradient(
    to right,
    transparent,
    black 10%,
    black 90%,
    transparent
  );
  -webkit-mask-image: linear-gradient(
    to right,
    transparent,
    black 10%,
    black 90%,
    transparent
  );
`;

export const CardRowInner = styled.div<{ isReverse?: boolean }>`
  display: flex;
  gap: 1rem;
  animation: ${({ isReverse }) => isReverse ? scrollRight : scrollLeft} 30s linear infinite;
  width: fit-content;
  
  &:hover {
    animation-play-state: paused;
  }
`;

export const CryptoCard = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.cardBg};
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  min-width: 140px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: 768px) {
    min-width: 120px;
    padding: 0.75rem;
  }
`;

export const IconsWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
  
  img:first-child {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    z-index: 2;
  }
  
  img:last-child {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-left: -8px;
    z-index: 1;
    border: 2px solid ${({ theme }) => theme.colors.cardBg};
  }

  @media (max-width: 768px) {
    img:first-child {
      width: 28px;
      height: 28px;
    }
    
    img:last-child {
      width: 20px;
      height: 20px;
    }
  }
`;

export const CryptoCardContent = styled.div`
  text-align: center;
  width: 100%;
`;

export const CryptoCardTicker = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textColor};
  margin-bottom: 0.25rem;
`;

export const CryptoCardPrice = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0.25rem;
`;

import styled from "styled-components";
import Image from "next/image";

export const MarqueeContainer = styled.div`
  width: 100%;
  overflow: hidden;
  background: ${({ theme: { colors } }) => colors.background};
  border-bottom: 1px solid ${({ theme: { colors } }) => colors.borderColor};
  padding: 6px 0;
  position: relative;
  background-color: ${({ theme }) => theme.colors.bgColor};
`;

export const MarqueeContent = styled.div`
  display: flex;
  gap: 32px;
  padding: 0 16px;
  width: max-content;
  position: relative;

  /* Simplified animation for triple-duplicated content */
  @keyframes marquee {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-33.33%); /* Move by exactly 1/3 for perfect loop with triple content */
    }
  }

  /* Fixed animation duration - not dependent on item count */
  animation: marquee 110s linear infinite;
  
  /* Create clone on hover to avoid empty space */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -10px;
    width: 10px;
    height: 100%;
    background: transparent;
  }
  
  &:hover {
    animation-play-state: paused;
  }
`;

export const TokenItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 8px;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.borderColor};
  }
`;


export const TokenInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const TokenName = styled.span`
  color: ${props => props.theme.colors.textColor};
  font-weight: 500;
`;

export const TokenPrice = styled.span`
  color: ${props => props.theme.colors.textColor};
  font-weight: 600;
`;

export const PriceChange = styled.span<{ isPositive: boolean }>`
  color: ${props => props.isPositive ? props.theme.colors.upColor : props.theme.colors.downColor};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const ArrowIcon = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 10px;
`;

export const TokenImage = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TokenTicker = styled.span`
  color: ${props => props.theme.colors.textSecondary || props.theme.colors.textColor};
  font-size: 14px;
  font-weight: 400;
  opacity: 0.8;
`;
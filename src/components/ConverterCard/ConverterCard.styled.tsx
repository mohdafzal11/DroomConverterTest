import styled, { css } from "styled-components";


export const ConverterContainer = styled.div<{ isNavSticky: boolean; activeSection: string }>`
  background: ${props => props.theme.colors.cardBackground};
  padding: 0;
  margin: 0 auto 80px;
  max-width: 1000px;
  border-radius: 0;
  border: none;
  box-shadow: none;
  transition: none;
  padding-top: ${props => !props.isNavSticky && props.activeSection === 'converter' ? '0' : '0'};
  
  @media (max-width: 768px) {
    margin: 0 auto 80px;
    padding-top: ${props => !props.isNavSticky && props.activeSection === 'converter' ? '0' : '0'};
  }
`;

export const IconsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 12px;
  margin-top: 5px;
`;

export const CryptoIcon = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: -8px;
`;

export const ConversionHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 16px 0px;
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: flex-start;

  margin-bottom: 8px;
  min-height: 60px;
  width: 100%;
`;

export const Title = styled.h1`
  font-size: 48px;
  font-weight: 300;
  color: ${props => props.theme.colors.textColor};
  margin: 0;
  line-height: 1.2;

  
  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

export const ExchangeRate = styled.p`
  font-size: 15px;
  color: ${props => props.theme.colors.textColorSub};
  margin: 0;
  margin-bottom: 20px;
  min-height: 20px;
  height: auto;
  display: block;
  box-sizing: border-box;
`;

export const ConversionForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
  margin-bottom: 24px;
`;

export const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const InputWrapper = styled.div`
  flex: 1;
  position: relative;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const Input = styled.input`
  width: 100%;
  height: 56px;
  border: 1px solid ${props => props.theme.colors.borderColor};
  border-radius: 50px;
  background: ${props => props.theme.colors.colorNeutral1};
  color: ${props => props.theme.colors.textColor};
  font-size: 18px;
  padding: 0 120px 0 20px;
  
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
    
  &[type=number] {
    -moz-appearance: textfield;
  }
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textColorSub};
  }
`;

export const SelectButton = styled.button`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  height: 46px;
  min-width: 100px;
  padding: 8px 40px 8px 15px;
  border: none;
  border-radius: 50px;
  background: ${props => props.theme.name === "dark" ? props.theme.colors.colorLightNeutral1 : props.theme.colors.colorLightNeutral2};
  color: ${props => props.theme.colors.textColor};
  font-size: 16px;
  font-weight: 500;
  appearance: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.name === "dark" ? props.theme.colors.colorLightNeutral1 : props.theme.colors.colorNeutral2};
  }
  
  &:focus {
    outline: none;
  }
`;

export const SwapIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 8px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

export const SwapButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.name === "dark" ? props.theme.colors.colorLightNeutral1 : props.theme.colors.colorNeutral2};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.theme.colors.textColor};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.colorLightNeutral1};
  }

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 2px;
  }
`;

export const BuyButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 16px;
  margin-bottom: 20px;
`;

export const BuyButton = styled.button`
  background: #4A49F5;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 12px 28px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #4A49F5;
  }
`;

export const ShareButton = styled.button`
  background: none;
  border: none;
  color: #4A49F5;
  font-weight: 600;
  cursor: pointer;
  margin-left: 8px;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    color: #4A49F5;
    text-decoration: underline;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const LastUpdated = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 24px;
  font-size: 14px;
  color: ${props => props.theme.colors.textColorSub};
  gap: 8px;
`;

export const RefreshButton = styled.button`
  background: none;
  border: none;
  color: #4A49F5;
  font-weight: 600;
  cursor: pointer;
  margin-left: 8px;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    color: #4A49F5;
    text-decoration: underline;
  }
  
  &:disabled {
    color: ${props => props.theme.colors.textColorSub};
    cursor: not-allowed;
    text-decoration: none;
  }
  
  svg {
    animation: ${props => props.disabled ? 'spin 1s linear infinite' : 'none'};
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const TokenName = styled.span<{ ticker?: string; imageColor?: string }>`
  color: ${props => {
    if (props.imageColor) return props.imageColor;
    if (!props.ticker) return 'inherit';
    const hash = props.ticker.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const h = hash % 360;
    return `hsl(${h}, 70%, 50%)`;
  }};
  font-weight: 500;
`;

export const TokenText = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const SelectArrow = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.textColorSub};
  }
`;

export const SearchWrapper = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  z-index: 100000;
  width: 360px;
`;

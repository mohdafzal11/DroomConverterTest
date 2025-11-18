import React from 'react';
import styled, { keyframes } from 'styled-components';
import { 
  ConverterContainer, 
  ConversionHeader, 
  TitleWrapper, 
  IconsWrapper, 
  ConversionForm, 
  InputRow, 
  InputWrapper, 
  SwapIconWrapper, 
  BuyButtonWrapper,
  LastUpdated
} from './ConverterCard.styled';

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

const IconShimmer = styled(ShimmerEffect)`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: -8px;
`;

const TitleShimmer = styled(ShimmerEffect)`
  width: 70%;
  height: 48px;
  border-radius: 4px;
  margin: 0;
`;

const SubtitleShimmer = styled(ShimmerEffect)`
  width: 50%;
  height: 20px;
  margin: 8px 0 20px 0;
`;

const ButtonShimmer = styled(ShimmerEffect)`
  width: 180px;
  height: 45px;
  border-radius: 50px;
`;

const InputShimmer = styled(ShimmerEffect)`
  width: 100%;
  height: 56px;
  border-radius: 50px;
`;

const SelectShimmer = styled(ShimmerEffect)`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  height: 46px;
  width: 100px;
  border-radius: 50px;
`;

const SwapButtonShimmer = styled(ShimmerEffect)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const LastUpdatedShimmer = styled(ShimmerEffect)`
  width: 300px;
  height: 20px;
  margin-left: auto;
`;

const ConverterCardShimmer: React.FC = () => {
  return (
    <ConverterContainer>
      <ConversionHeader>
        <TitleWrapper>
          <IconsWrapper>
            <IconShimmer />
            <IconShimmer />
          </IconsWrapper>
          <TitleShimmer />
        </TitleWrapper>

        <SubtitleShimmer />

        <BuyButtonWrapper>
          <ButtonShimmer />
        </BuyButtonWrapper>
      </ConversionHeader>

      <ConversionForm>
        <InputRow>
          <InputWrapper>
            <InputShimmer />
            <SelectShimmer />
          </InputWrapper>

          <SwapIconWrapper>
            <SwapButtonShimmer />
          </SwapIconWrapper>

          <InputWrapper>
            <InputShimmer />
            <SelectShimmer />
          </InputWrapper>
        </InputRow>
      </ConversionForm>

      <LastUpdated>
        <LastUpdatedShimmer />
      </LastUpdated>
    </ConverterContainer>
  );
};

export default ConverterCardShimmer;

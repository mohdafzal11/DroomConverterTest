import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FAQContainer, FAQHeading, FAQGrid, FAQItem } from './FAQ.styled';

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
  height: 40px;
  margin-bottom: 2.5rem;
  border-radius: 6px;
`;

const QuestionShimmer = styled(ShimmerEffect)`
  width: 85%;
  height: 24px;
  margin-bottom: 1rem;
  border-radius: 4px;
`;

const AnswerLineShimmer = styled(ShimmerEffect)`
  width: 100%;
  height: 16px;
  margin-bottom: 8px;
  border-radius: 4px;
`;

const FAQShimmer: React.FC = () => {
  // Create array of 10 FAQ items for the shimmer effect
  const faqItems = Array.from({ length: 10 }, (_, index) => (
    <FAQItem key={index}>
      <QuestionShimmer />
      <AnswerLineShimmer />
      <AnswerLineShimmer style={{ width: '90%' }} />
      <AnswerLineShimmer style={{ width: '75%' }} />
    </FAQItem>
  ));

  return (
    <FAQContainer>
      <HeadingShimmer />
      <FAQGrid>
        {faqItems}
      </FAQGrid>
    </FAQContainer>
  );
};

export default FAQShimmer;

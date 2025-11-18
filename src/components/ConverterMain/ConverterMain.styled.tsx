import styled from "styled-components";

export const ConverterContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 16px;
  width: 100%;
  position: relative;

  /* Normal page layout */
  &::before {
    content: '';
    display: block;
    height: 8px;
    width: 100%;
  }

  /* Add consistent smaller spacing between sections */
  & > div:not(:first-child) {
    margin-top: 16px;
  }
`;

export const HomepageCenter = styled.div`
  position: relative;
  height: 45vh; /* even more compact to fit everything in viewport */
  width: 100%;

  .converter-anim {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    transition: top 900ms cubic-bezier(0.22, 1, 0.36, 1), transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
    display: flex;
    justify-content: center;
    z-index: 10; /* keep converter above everything while animating */
  }

  &.animating {
    height: auto;
    min-height: 100vh;
    .converter-anim {
      top: 8px; /* match regular page converter position */
      transform: translateY(0);
    }
  }

  /* Container for shimmers that appear during animation */
  .shimmers {
    position: relative;
    z-index: 1; /* below converter */
    padding-top: 500px; /* proper space under converter to avoid overlap */
    opacity: 0;
    transition: opacity 400ms ease 150ms;
    pointer-events: none; /* avoid covering converter interactions */
  }

  &.animating .shimmers {
    opacity: 1;
    /* keep pointer events disabled during animation, we navigate away after */
  }

  @media (max-width: 768px) {
    height: 48vh; /* compact for mobile viewport fit */
    .converter-anim {
      top: 50%;
      transform: translateY(-50%);
    }
    .shimmers {
      padding-top: 520px; /* mobile converter spacing to avoid overlap */
    }
  }
`;

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import * as S from './Footer.styled';
import { getPageUrl, getHostPageUrl } from 'utils/config';
import { useTheme } from 'styled-components';
import Link from 'next/link';

interface SocialItem {
  text: string;
  url: string;
  iconUrl: string;
  color: string;
}

interface CompanyItem {
  text: string;
  url: string;
}

interface QuickLinkItem {
  text: string;
  url: string;
}

interface FooterData {
  socials: SocialItem[];
  company: CompanyItem[];
  'quick-links': QuickLinkItem[];
}


const Footer = () => {
  const { name } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [footerData, setFooterData] = useState<FooterData>({
    socials: [],
    company: [],
    'quick-links': []
  });

  const fetchFooterData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_CENTRAL_API || 'https://droomdroom.com/api/v1'}/footer-menu`
      );
      setFooterData(response.data);
    } catch (error) {
      console.error('Error fetching footer data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFooterData();
  }, []);

  const handleExternalRedirect = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
    window.location.href = url;
  };

  return (
    <S.FooterWrapper>
      <S.SocialsSection>
        <S.SocialsContainer>
          <S.SocialsContent>
            <S.SocialsTitle>Follow Us on Socials</S.SocialsTitle>
            <S.SocialsDescription>
              We use social media to react to breaking news, update supporters and share information.
            </S.SocialsDescription>
          </S.SocialsContent>
          <S.SocialIcons>
            {isLoading ? (
              // Loading placeholders for social icons
              Array(8).fill(0).map((_, index) => (
                <S.SocialIconLink key={index} as="div" style={{ opacity: 0.3, cursor: 'default' }}>
                  <div style={{ width: '20px', height: '20px', backgroundColor: '#ccc', borderRadius: '2px' }} />
                </S.SocialIconLink>
              ))
            ) : (
              footerData.socials.map((social, index) => (
                <S.SocialIconLink 
                  key={index}
                  href={social.url} 
                  target="_blank" 
                  rel="nofollow" 
                  $bgColor={social.text === 'Google News' ? 'transparent' : social.color} 
                  aria-label={social.text}
                  style={{
                    border: social.text === 'Google News' ? `2px solid ${social.color}` : 'none'
                  }}
                >
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    filter: social.text === 'Google News' ? 'none' : 'brightness(0) invert(1)'
                  }}>
                    <Image
                      src={social.iconUrl}
                      alt={social.text}
                      width={20}
                      height={20}
                    />
                  </div>
                </S.SocialIconLink>
              ))
            )}
          </S.SocialIcons>
        </S.SocialsContainer>
      </S.SocialsSection>

      <S.Divider />

      <S.FooterContent>
        <S.BrandSection>
          <S.LogoContainer>
            <Image
              src={`${getPageUrl("")}/DroomDroom_${name === 'light' ? 'Black' : 'White'}.svg`}
              alt="DroomDroom Logo"
              width={200}
              height={30}
              priority
              sizes="200px"
            />
          </S.LogoContainer>
          <S.Description>
            DroomDroom dedicates thousands of hours of research into the web3 industry to deliver you free, world-class, and accurate content.
          </S.Description>
        </S.BrandSection>

        <S.LinksSection>
          <S.Title>Company</S.Title>
          <S.ButtonsGrid>
            {isLoading ? (
              // Loading placeholders for company links
              Array(6).fill(0).map((_, index) => (
                <S.ButtonLink key={index} as="div" style={{ opacity: 0.3, cursor: 'default' }}>
                  <div style={{ width: '80px', height: '16px', backgroundColor: '#ccc', borderRadius: '2px' }} />
                </S.ButtonLink>
              ))
            ) : (
              footerData.company.map((item, index) => (
                <Link key={index} href={getHostPageUrl(item.url)} rel="dofollow" passHref legacyBehavior>
                  <S.ButtonLink>{item.text}</S.ButtonLink>
                </Link>
              ))
            )}
          </S.ButtonsGrid>
        </S.LinksSection>

        <S.LinksSection>
          <S.Title>Quick Links</S.Title>
          <S.ButtonsGrid>
            {isLoading ? (
              // Loading placeholders for quick links
              Array(8).fill(0).map((_, index) => (
                <S.ButtonLink key={index} as="div" style={{ opacity: 0.3, cursor: 'default' }}>
                  <div style={{ width: '100px', height: '16px', backgroundColor: '#ccc', borderRadius: '2px' }} />
                </S.ButtonLink>
              ))
            ) : (
              footerData['quick-links'].map((item, index) => (
                <Link key={index} href={getHostPageUrl(item.url)} rel="dofollow" passHref legacyBehavior>
                  <S.ButtonLink>{item.text}</S.ButtonLink>
                </Link>
              ))
            )}
          </S.ButtonsGrid>
        </S.LinksSection>
      </S.FooterContent>

      <S.Copyright>Copyright © 2025 DroomDroom Corporation. All Rights Reserved</S.Copyright>
    </S.FooterWrapper>
  );
};

export default Footer;
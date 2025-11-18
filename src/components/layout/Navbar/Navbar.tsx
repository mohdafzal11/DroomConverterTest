import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from 'styled-components';
import {
  NavbarWrapper,
  NavbarContent,
  MenuList,
  MenuLink,
  ShimmerMenuLink,
  BackButton,
  DropdownContainer,
  DropdownTrigger ,
  DropdownItem
} from './Navbar.styled';
import { VscTriangleLeft } from 'react-icons/vsc';
import { getHostPageUrl } from 'utils/config';
import MarqueeScroll from 'components/MarqueeScroll/MarqueeScroll';


interface MenuItem {
  text: string;
  url?: string;
  type: 'link' | 'dropdown';
  items?: MenuItem[];
}

const Navbar = () => {
  const { name } = useTheme();
  const router = useRouter();
  const currentPath = router.pathname;
  const isSpecificCoinPage = currentPath === '/[slug]';
  const [isLoading, setIsLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navbarContentRef = useRef<HTMLDivElement>(null);

  const fetchMenuItems = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_CENTRAL_API || 'https://droomdroom.com/api/v1'}/header-menu`
      );
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleDropdownToggle = useCallback((dropdownText: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    if (!dropdownTimeoutRef.current) {
      setOpenDropdown((prev) => {
        const newValue = prev === dropdownText ? null : dropdownText;
        return newValue;
      });
    }
  }, []);

  const handleDropdownEnter = (dropdownText: string) => {
    if (window.innerWidth > 768) {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
        dropdownTimeoutRef.current = null;
      }
      setOpenDropdown(dropdownText);
    }
  };

  const handleDropdownLeave = () => {
    if (window.innerWidth > 768) {
      dropdownTimeoutRef.current = setTimeout(() => {
        setOpenDropdown(null);
      }, 300);
    }
  };

  const handleDropdownContentEnter = () => {
    if (window.innerWidth > 768) {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
        dropdownTimeoutRef.current = null;
      }
    }
  };

  const handleDropdownContentLeave = () => {
    if (window.innerWidth > 768) {
      dropdownTimeoutRef.current = setTimeout(() => {
        setOpenDropdown(null);
      }, 150);
    }
  };

  const dropdownItems = React.useMemo(
    () => menuItems.filter((item) => item.type === 'dropdown'),
    [menuItems]
  );

  useEffect(() => {
    if (openDropdown && triggerRef.current && dropdownRef.current && navbarContentRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const dropdown = dropdownRef.current;
      const navbarContentRect = navbarContentRef.current.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;

      let topPosition, leftPosition;

      if (window.innerWidth <= 768) {
        topPosition = triggerRect.bottom + scrollY + 12;
        dropdown.style.position = 'fixed';
        dropdown.style.top = `${topPosition}px`;
        dropdown.style.left = `${triggerRect.left + triggerRect.width / 2 + 20}px`;
        dropdown.style.transform = 'translateX(-50%)';
      } else {
        topPosition = triggerRect.bottom - navbarContentRect.top + 12;
        leftPosition = triggerRect.left - navbarContentRect.left + triggerRect.width / 2;
        dropdown.style.position = 'absolute';
        dropdown.style.top = `${topPosition}px`;
        dropdown.style.left = `${leftPosition}px`;
        dropdown.style.transform = 'translateX(-50%)';
      }
    }
  }, [openDropdown]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openDropdown &&
        triggerRef.current &&
        dropdownRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown && window.innerWidth <= 768) {
      const timer = setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 100);
      return () => {
        clearTimeout(timer);
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [openDropdown]);

  return (
    <NavbarWrapper>
      <NavbarContent ref={navbarContentRef}>
        <MenuList>
          {isLoading ? (
            Array.from({ length: 6 }, (_, index) => (
              <li key={`shimmer-${index}`} style={{ position: 'relative', flexShrink: 0 }}>
                <ShimmerMenuLink />
              </li>
            ))
          ) : (
            <>
              {menuItems.map((item, index) => (
                <li key={index} style={{ position: 'relative', flexShrink: 0, zIndex: item.type === 'dropdown' ? 2000 : 'auto' }}>
                  {item.type === 'link' ? (
                    <MenuLink href={getHostPageUrl(item.url!)} aria-label={`Go to ${item.text}`}>
                      {item.text === 'Price' && isSpecificCoinPage && (
                        <BackButton>{VscTriangleLeft({ size: 14 })}</BackButton>
                      )}
                      {item.text}
                    </MenuLink>
                  ) : (
                    <div
                      onMouseEnter={() => handleDropdownEnter(item.text)}
                      onMouseLeave={handleDropdownLeave}
                      style={{ position: 'relative', zIndex: 2000 }}
                    >
                      <DropdownTrigger
                        ref={openDropdown === item.text ? triggerRef : null}
                        onClick={() => handleDropdownToggle(item.text)}
                        aria-expanded={openDropdown === item.text}
                        aria-label={`Toggle ${item.text} menu`}
                        className="dropdown-trigger"
                      >
                        <span>{item.text}</span>
                        <div style={{ marginLeft: '4px', transition: 'transform 0.2s ease-in-out' }}>
                          {openDropdown === item.text ? (
                            <ChevronUp style={{ width: '16px', height: '16px' }} />
                          ) : (
                            <ChevronDown style={{ width: '16px', height: '16px' }} />
                          )}
                        </div>
                      </DropdownTrigger>
                    </div>
                  )}
                </li>
              ))}
            </>
          )}
        </MenuList>
      </NavbarContent>
      {openDropdown && (
        (() => {
          const currentDropdownItem = menuItems.find(item => item.text === openDropdown && item.type === 'dropdown');
          return currentDropdownItem && currentDropdownItem.items ? (
            <DropdownContainer
              ref={dropdownRef}
              className="dropdown-container"
              isOpen={!!openDropdown}
              isDark={name === 'dark'}
              onMouseEnter={handleDropdownContentEnter}
              onMouseLeave={handleDropdownContentLeave}
            >
              {currentDropdownItem.items.map((dropdownItem, index) => (
                <DropdownItem
                  key={index}
                  isDark={name === 'dark'}
                  onClick={() => window.open(getHostPageUrl(dropdownItem.url!), '_blank')}
                  aria-label={`Go to ${dropdownItem.text}`}
                >
                  <span>{dropdownItem.text}</span>
                </DropdownItem>
              ))}
            </DropdownContainer>
          ) : null;
        })()
      )}
     <  MarqueeScroll/>
    </NavbarWrapper>
  );
};

export default Navbar;
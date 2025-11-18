import React, { useEffect, useState, useRef } from 'react';
import { NavbarWrapper, TabItem, TabList, ScrollButton, ScrollableContainer } from 'components/Navbar/Navbar.styled';
import { useRouter } from 'next/router';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useTheme } from 'styled-components';
import { Token } from 'src/types';




interface NavbarProps {
    fromToken: Token;
    toToken: Token;
    activeTab: string;
    setActiveTab: (tabId: string) => void;
    headerHeight: number;
    isNavSticky: boolean;
    setIsNavSticky: (isSticky: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ fromToken, toToken, activeTab, setActiveTab, headerHeight, isNavSticky, setIsNavSticky }) => {

    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const router = useRouter();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const navbarRef = useRef<HTMLDivElement>(null);
    const theme = useTheme();

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    const updateScrollButtons = () => {
        if (!scrollContainerRef.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowLeftArrow(scrollLeft > 20);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', updateScrollButtons);
            updateScrollButtons();
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', updateScrollButtons);
            }
        };
    }, []);

    useEffect(() => {
        // Use a single placeholder element that will be properly managed
        const navPlaceholder = document.createElement('div');
        navPlaceholder.style.display = 'none';
        navPlaceholder.style.width = '100%';
        navPlaceholder.style.visibility = 'hidden';
        navPlaceholder.style.margin = '0';
        navPlaceholder.style.padding = '0';
        navPlaceholder.style.height = '0';
        navPlaceholder.style.overflow = 'hidden';
        navPlaceholder.classList.add('navbar-placeholder');

        const headerPlaceholder = document.getElementById('header-placeholder');
        let navbarHeight = 0;
        let navbarPosition = -1;
        let isFixed = false;
        let originalStyles = {} as Record<string, string>;

        const getThemeColors = () => {
            const computedStyle = getComputedStyle(document.documentElement);
            return {
                background: computedStyle.getPropertyValue('--background-color') ||
                    computedStyle.getPropertyValue('--bg-color') ||
                    '#ffffff',
                borderColor: computedStyle.getPropertyValue('--border-color') || '#e5e7eb'
            };
        };

        // Capture original styles once the navbar is rendered
        const captureOriginalStyles = () => {
            if (!navbarRef.current) return;

            const computedStyle = window.getComputedStyle(navbarRef.current);
            originalStyles = {
                position: computedStyle.position,
                top: computedStyle.top,
                left: computedStyle.left,
                right: computedStyle.right,
                width: computedStyle.width,
                maxWidth: computedStyle.maxWidth,
                margin: computedStyle.margin,
                padding: computedStyle.padding,
                paddingTop: computedStyle.paddingTop,
                paddingBottom: computedStyle.paddingBottom,
                zIndex: computedStyle.zIndex,
                background: computedStyle.background,
                borderBottom: computedStyle.borderBottom,
                transition: computedStyle.transition
            };
        };

        // Calculate the initial position of the navbar
        const calculateNavbarPosition = () => {
            if (!navbarRef.current) return 0;
            const rect = navbarRef.current.getBoundingClientRect();
            return rect.top + window.scrollY;
        };

        // Update the placeholder height to match navbar height
        const updatePlaceholder = () => {
            if (!navbarRef.current) return;
            
            // Get the current height of navbar
            navbarHeight = navbarRef.current.offsetHeight;
            
            // Update placeholder height
            navPlaceholder.style.height = `${navbarHeight}px`;
        };

        const getHeaderHeight = () => {
            return headerPlaceholder ? headerPlaceholder.offsetHeight : 0;
        };

        // Check scroll position and toggle fixed position
        const handleScroll = () => {
            if (!navbarRef.current) return;

            // Initialize navbar position if it hasn't been set yet
            if (navbarPosition === -1) {
                navbarPosition = calculateNavbarPosition();
                captureOriginalStyles();
                
                // Add placeholder after header, not before main content
                if (headerPlaceholder && headerPlaceholder.parentNode) {
                    headerPlaceholder.parentNode.insertBefore(navPlaceholder, headerPlaceholder.nextSibling);
                } else if (navbarRef.current.parentNode) {
                    // Fallback - keep placeholder with navbar
                    navbarRef.current.parentNode.insertBefore(navPlaceholder, navbarRef.current);
                }
                
                // Initialize placeholder height
                updatePlaceholder();
            }

            const scrollY = window.scrollY || document.documentElement.scrollTop;
            const headerHeight = getHeaderHeight();
            const scrollThreshold = navbarPosition - headerHeight;

            // Check if we should fix the navbar
            if (scrollY >= scrollThreshold) {
                if (!isFixed) {
                    isFixed = true;
                    
                    // Show the placeholder to maintain layout, but keep it invisible
                    navPlaceholder.style.display = 'block';
                    navPlaceholder.style.visibility = 'hidden';
                    navPlaceholder.style.height = `${navbarHeight}px`;
                    
                    // Fix the navbar position
                    navbarRef.current.style.position = 'fixed';
                    navbarRef.current.style.top = `${headerHeight}px`;
                    navbarRef.current.style.left = '0';
                    navbarRef.current.style.right = '0';
                    navbarRef.current.style.margin = '0 auto';
                    navbarRef.current.style.padding = originalStyles.padding;
                    navbarRef.current.style.paddingTop = originalStyles.paddingTop;
                    navbarRef.current.style.paddingBottom = originalStyles.paddingBottom;
                    navbarRef.current.style.maxWidth = '1370px'; 
                    navbarRef.current.style.width = '100%';
                    navbarRef.current.style.zIndex = '999999';
                    navbarRef.current.style.backgroundColor = theme.colors.bgColor;
                    navbarRef.current.style.transition = 'opacity 0.2s ease-in-out';
                    
                    if (originalStyles.borderBottom) {
                        navbarRef.current.style.borderBottom = originalStyles.borderBottom;
                    }
                    
                    // Important: Update state AFTER DOM changes to prevent React rerender issues
                    setTimeout(() => {
                        setIsNavSticky(true);
                    }, 0);
                }
            } else {
                if (isFixed) {
                    isFixed = false;
                    
                    // Hide the placeholder
                    navPlaceholder.style.display = 'none';
                    navPlaceholder.style.height = '0';
                    
                    // Restore original navbar styles
                    Object.entries(originalStyles).forEach(([key, value]) => {
                        (navbarRef.current!.style as any)[key] = value;
                    });
                    
                    // Important: Update state AFTER DOM changes
                    setTimeout(() => {
                        setIsNavSticky(false);
                    }, 0);
                }
            }
        };

        // Recalculate on resize
        const handleResize = () => {
            // Reset position so it will be recalculated
            navbarPosition = calculateNavbarPosition();
            updatePlaceholder();
            handleScroll();
        };

        // Set up header height observer
        let resizeObserver: ResizeObserver | null = null;
        if (headerPlaceholder) {
            resizeObserver = new ResizeObserver(() => {
                if (isFixed && navbarRef.current) {
                    const headerHeight = getHeaderHeight();
                    navbarRef.current.style.top = `${headerHeight}px`;
                }
                handleScroll();
            });
            
            resizeObserver.observe(headerPlaceholder);
        }

        // Ensure the main container has consistent top margin
        const fixMainLayout = () => {
            const mainContainer = document.querySelector('main.Layout-styled__Main-sc-d1850f4d-0');
            if (mainContainer) {
                // Ensure consistent margin-top for main content
                (mainContainer as HTMLElement).style.marginTop = '0';
                (mainContainer as HTMLElement).style.paddingTop = '20px';
            }
        };
        
        // Apply layout fixes
        fixMainLayout();

        // Set up event listeners
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);

        // Initial calculation
        setTimeout(() => {
            captureOriginalStyles();
            navbarPosition = calculateNavbarPosition();
            updatePlaceholder();
            handleScroll();
            fixMainLayout();
        }, 100);

        // Clean up event listeners and DOM elements
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            
            if (resizeObserver && headerPlaceholder) {
                resizeObserver.unobserve(headerPlaceholder);
                resizeObserver.disconnect();
            }
            
            if (navPlaceholder.parentNode) {
                navPlaceholder.parentNode.removeChild(navPlaceholder);
            }
            
            // Reset any main content padding changes
            const mainContent = document.querySelector('main');
            if (mainContent && mainContent.getAttribute('data-original-padding-top')) {
                mainContent.style.paddingTop = mainContent.getAttribute('data-original-padding-top') || '';
                mainContent.removeAttribute('data-original-padding-top');
            }
        };
    }, []);

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        
        const fromSlug = `${fromToken.name.toLowerCase().replace(/\s+/g, '-')}-${fromToken.ticker.toLowerCase()}`;
        const toSlug = `${toToken.name.toLowerCase().replace(/\s+/g, '-')}-${toToken.ticker.toLowerCase()}`;
        const newUrl = `/converter/${fromSlug}/${toSlug}#${tabId}`;
        
        window.history.replaceState(null, '', newUrl);
        
        const targetElement = document.getElementById(tabId);
        if (targetElement) {
            let totalOffset = 0;
            
            const headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) {
                totalOffset += headerPlaceholder.offsetHeight;
            }
            
            if (navbarRef.current) {
                totalOffset += navbarRef.current.offsetHeight;
            }
            
            const elementPosition = targetElement.offsetTop;
            const scrollToPosition = elementPosition - totalOffset;
            
            window.scrollTo({
                top: Math.max(0, scrollToPosition),
                behavior: 'smooth'
            });
        }
    };

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    const scrollToTop = () => {
        // if (scrollContainerRef.current) {
        //     scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        // } //This does not work
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <NavbarWrapper ref={navbarRef}>
            {isMobile && showLeftArrow && (
                <ScrollButton direction="left" onClick={scrollLeft}>
                    <ChevronLeft size={18} />
                </ScrollButton>
            )}

            <ScrollableContainer ref={scrollContainerRef}>
                <TabList>
                  {isNavSticky && <TabItem
                        id="tab-converter"
                        active={activeTab === 'converter'}
                        onClick={() => scrollToTop()}
                    >
                        Converter
                    </TabItem>}
                    <TabItem
                        id="tab-markets"
                        active={activeTab === 'markets'}
                        onClick={() => handleTabChange('markets')}
                    >
                        Market
                    </TabItem>

                    <TabItem
                        id="tab-about"
                        active={activeTab === 'about'}
                        onClick={() => handleTabChange('about')}
                    >
                        About
                    </TabItem>

                    <TabItem
                        id="tab-faq"
                        active={activeTab === 'faq'}
                        onClick={() => handleTabChange('faq')}
                    >
                        FAQ
                    </TabItem>

                    <TabItem
                        id="tab-related"
                        active={activeTab === 'related'}
                        onClick={() => handleTabChange('related')}
                    >
                        Related
                    </TabItem>

                    <TabItem
                        id="tab-conversion-tables"
                        active={activeTab === 'conversion-tables'}
                        onClick={() => handleTabChange('conversion-tables')}
                    >
                        Conversion Tables
                    </TabItem>

                    {/* <TabItem
                        id="tab-more"
                        active={activeTab === 'more'}
                        onClick={() => handleTabChange('more')}
                    >
                        More
                    </TabItem> */}
                </TabList>
            </ScrollableContainer>

            {isMobile && showRightArrow && (
                <ScrollButton direction="right" onClick={scrollRight}>
                    <ChevronRight size={18} />
                </ScrollButton>
            )}
        </NavbarWrapper>
    );
};

export default Navbar;


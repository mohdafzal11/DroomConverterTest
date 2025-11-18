/**
 * This script adds 'nofollow' attribute to external links in the document.
 * It runs after the page loads to ensure all links are processed.
 */
(function() {
  // Function to detect if a URL is external
  function isExternalLink(url) {
    if (!url) return false;
    // Get current hostname
    const currentHostname = window.location.hostname;
    
    try {
      // Extract hostname from the URL
      const urlHostname = new URL(url).hostname;
      // Compare hostnames
      return urlHostname !== currentHostname && urlHostname !== '';
    } catch (e) {
      // If URL parsing fails, assume it's not external
      return false;
    }
  }
  
  // Process all links in the document
  function addNoFollowToExternalLinks() {
    const links = document.querySelectorAll('a');
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      
      // Skip if it's not an external link or already has rel attribute with nofollow
      if (!isExternalLink(href)) return;
      
      // Get current rel attribute
      const rel = link.getAttribute('rel') || '';
      
      // Add nofollow only if it's not already there
      if (!rel.includes('nofollow')) {
        const newRel = rel ? `${rel} nofollow` : 'nofollow';
        link.setAttribute('rel', newRel);
      }
    });
  }
  
  // Run once when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addNoFollowToExternalLinks);
  } else {
    addNoFollowToExternalLinks();
  }
  
  // Also run when content changes (for dynamic content)
  if (window.MutationObserver) {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
          addNoFollowToExternalLinks();
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
})(); 
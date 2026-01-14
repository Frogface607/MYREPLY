// MyReply Content Script for Wildberries Seller Portal

(function() {
  'use strict';

  const MYREPLY_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 6L14.5 11L20 12L16 16L17 22L12 19L7 22L8 16L4 12L9.5 11L12 6Z" fill="currentColor"/>
  </svg>`;

  // Create MyReply button
  function createButton(reviewText) {
    const btn = document.createElement('button');
    btn.className = 'myreply-btn';
    btn.innerHTML = `
      <span class="myreply-btn-icon">${MYREPLY_ICON}</span>
      <span>MyReply</span>
    `;
    btn.title = 'Сгенерировать ответ с MyReply';
    
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openPopupWithReview(reviewText);
    });
    
    return btn;
  }

  // Open popup with review text
  function openPopupWithReview(reviewText) {
    chrome.runtime.sendMessage({
      type: 'OPEN_POPUP_WITH_REVIEW',
      reviewText: reviewText,
    });
  }

  // Find and inject buttons on WB
  function injectButtons() {
    // WB reviews are in cards with review text
    // Selectors may need adjustment based on actual WB seller portal structure
    const reviewCards = document.querySelectorAll('[class*="review"], [class*="feedback"], [data-testid*="review"]');
    
    reviewCards.forEach(card => {
      // Skip if already processed
      if (card.querySelector('.myreply-btn')) return;
      
      // Find review text container
      const textContainer = card.querySelector('[class*="text"], [class*="content"], p');
      if (!textContainer) return;
      
      const reviewText = textContainer.textContent?.trim();
      if (!reviewText || reviewText.length < 10) return;
      
      // Find action buttons area or create one
      let actionsArea = card.querySelector('[class*="actions"], [class*="buttons"]');
      
      if (!actionsArea) {
        actionsArea = document.createElement('div');
        actionsArea.style.cssText = 'margin-top: 8px; display: flex; gap: 8px; align-items: center;';
        
        // Try to find a good place to insert
        const replyBtn = card.querySelector('button');
        if (replyBtn) {
          replyBtn.parentElement?.insertBefore(actionsArea, replyBtn.nextSibling);
        } else {
          card.appendChild(actionsArea);
        }
      }
      
      // Add MyReply button
      const myReplyBtn = createButton(reviewText);
      actionsArea.appendChild(myReplyBtn);
    });
  }

  // Alternative injection for different WB structures
  function injectButtonsAlternative() {
    // Look for "Ответить" buttons and add MyReply next to them
    const replyButtons = document.querySelectorAll('button');
    
    replyButtons.forEach(btn => {
      const btnText = btn.textContent?.toLowerCase() || '';
      if (!btnText.includes('ответ') && !btnText.includes('reply')) return;
      
      // Skip if already has MyReply button nearby
      if (btn.parentElement?.querySelector('.myreply-btn')) return;
      
      // Find the review card parent
      let parent = btn.closest('[class*="card"], [class*="item"], [class*="review"], tr');
      if (!parent) return;
      
      // Find review text
      const textElements = parent.querySelectorAll('p, span, div');
      let reviewText = '';
      
      for (const el of textElements) {
        const text = el.textContent?.trim() || '';
        // Find the longest text that looks like a review
        if (text.length > reviewText.length && text.length > 20 && text.length < 5000) {
          reviewText = text;
        }
      }
      
      if (!reviewText) return;
      
      // Insert MyReply button
      const myReplyBtn = createButton(reviewText);
      myReplyBtn.style.marginLeft = '8px';
      btn.parentElement?.insertBefore(myReplyBtn, btn.nextSibling);
    });
  }

  // Initialize
  function init() {
    // Initial injection
    setTimeout(() => {
      injectButtons();
      injectButtonsAlternative();
    }, 1000);
    
    // Watch for DOM changes (SPA navigation, lazy loading)
    const observer = new MutationObserver((mutations) => {
      let shouldInject = false;
      
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          shouldInject = true;
          break;
        }
      }
      
      if (shouldInject) {
        setTimeout(() => {
          injectButtons();
          injectButtonsAlternative();
        }, 500);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

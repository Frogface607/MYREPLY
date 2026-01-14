// MyReply Content Script for Yandex Market Partner Portal

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

  // Find and inject buttons on Yandex Market
  function injectButtons() {
    // Yandex Market partner portal has its own structure
    // Look for review cards
    const reviewCards = document.querySelectorAll(
      '[class*="Review"], [class*="review"], [class*="Feedback"], ' +
      '[class*="feedback"], [class*="Comment"], [data-e2e*="review"]'
    );
    
    reviewCards.forEach(card => {
      if (card.querySelector('.myreply-btn')) return;
      
      // Find review text
      const textEl = card.querySelector(
        '[class*="Text"], [class*="text"], [class*="Content"], [class*="content"], ' +
        '[class*="Body"], [class*="body"], p'
      );
      
      if (!textEl) return;
      
      const reviewText = textEl.textContent?.trim();
      if (!reviewText || reviewText.length < 10) return;
      
      // Find actions or create
      let actionsEl = card.querySelector('[class*="Action"], [class*="action"], [class*="Button"]');
      
      if (!actionsEl) {
        actionsEl = document.createElement('div');
        actionsEl.style.cssText = 'margin-top: 12px; display: flex; gap: 8px;';
        card.appendChild(actionsEl);
      }
      
      const myReplyBtn = createButton(reviewText);
      actionsEl.appendChild(myReplyBtn);
    });
  }

  // Yandex often uses React, look for specific patterns
  function injectButtonsReact() {
    // Look for elements that might be review items
    const items = document.querySelectorAll('[class*="_review"], [class*="_item"], [class*="_card"]');
    
    items.forEach(item => {
      if (item.querySelector('.myreply-btn')) return;
      
      // Get all text content
      const textContent = item.textContent || '';
      if (textContent.length < 30 || textContent.length > 5000) return;
      
      // Find the actual review text element (usually a paragraph or div with most text)
      const textElements = item.querySelectorAll('p, span, div');
      let reviewText = '';
      let textEl = null;
      
      textElements.forEach(el => {
        const text = el.textContent?.trim() || '';
        // Find element with substantial text that's not a date/status
        if (text.length > reviewText.length && 
            text.length > 20 && 
            text.length < 3000 &&
            !/^\d+\s*(янв|фев|мар|апр|май|июн|июл|авг|сен|окт|ноя|дек)/i.test(text)) {
          reviewText = text;
          textEl = el;
        }
      });
      
      if (!reviewText || !textEl) return;
      
      // Insert button after text element or in actions area
      const myReplyBtn = createButton(reviewText);
      
      // Try to find existing button to place next to
      const existingBtn = item.querySelector('button');
      if (existingBtn && existingBtn.parentElement) {
        myReplyBtn.style.marginLeft = '8px';
        existingBtn.parentElement.appendChild(myReplyBtn);
      } else {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'margin-top: 8px;';
        wrapper.appendChild(myReplyBtn);
        textEl.parentElement?.appendChild(wrapper);
      }
    });
  }

  // Look for reply/answer buttons
  function injectNextToReplyButtons() {
    const buttons = document.querySelectorAll('button, [role="button"]');
    
    buttons.forEach(btn => {
      const text = btn.textContent?.toLowerCase() || '';
      const ariaLabel = btn.getAttribute('aria-label')?.toLowerCase() || '';
      
      if (!text.includes('ответ') && !text.includes('reply') && 
          !ariaLabel.includes('ответ') && !ariaLabel.includes('reply')) {
        return;
      }
      
      if (btn.parentElement?.querySelector('.myreply-btn')) return;
      
      // Find parent container
      let parent = btn.closest('[class*="review"], [class*="item"], [class*="card"], tr');
      if (!parent) parent = btn.parentElement?.parentElement?.parentElement;
      if (!parent) return;
      
      // Extract review text
      let reviewText = '';
      const textElements = parent.querySelectorAll('p, span, div');
      
      textElements.forEach(el => {
        const t = el.textContent?.trim() || '';
        if (t.length > reviewText.length && t.length > 20 && t.length < 3000) {
          reviewText = t;
        }
      });
      
      if (!reviewText) return;
      
      const myReplyBtn = createButton(reviewText);
      myReplyBtn.style.marginLeft = '8px';
      
      btn.parentElement?.insertBefore(myReplyBtn, btn.nextSibling);
    });
  }

  // Initialize
  function init() {
    // Yandex uses heavy SPA, wait longer
    setTimeout(() => {
      injectButtons();
      injectButtonsReact();
      injectNextToReplyButtons();
    }, 2000);
    
    // Watch for changes
    const observer = new MutationObserver(() => {
      setTimeout(() => {
        injectButtons();
        injectButtonsReact();
        injectNextToReplyButtons();
      }, 500);
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

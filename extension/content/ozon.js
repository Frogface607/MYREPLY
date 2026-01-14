// MyReply Content Script for Ozon Seller Portal

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

  // Find and inject buttons on Ozon
  function injectButtons() {
    // Ozon seller portal reviews structure
    // Look for review cards or review text containers
    const reviewContainers = document.querySelectorAll(
      '[class*="review"], [class*="feedback"], [class*="comment"], ' +
      '[data-widget*="review"], [data-testid*="review"]'
    );
    
    reviewContainers.forEach(container => {
      if (container.querySelector('.myreply-btn')) return;
      
      // Find text content
      const textEl = container.querySelector(
        '[class*="text"], [class*="content"], [class*="body"], p'
      );
      
      if (!textEl) return;
      
      const reviewText = textEl.textContent?.trim();
      if (!reviewText || reviewText.length < 10) return;
      
      // Find or create actions area
      let actionsArea = container.querySelector('[class*="action"], [class*="button"]');
      
      if (!actionsArea) {
        actionsArea = document.createElement('div');
        actionsArea.style.cssText = 'margin-top: 12px; display: flex; gap: 8px;';
        container.appendChild(actionsArea);
      }
      
      const myReplyBtn = createButton(reviewText);
      actionsArea.appendChild(myReplyBtn);
    });
  }

  // Alternative injection for Ozon table structure
  function injectButtonsTable() {
    // Ozon often uses tables for reviews list
    const rows = document.querySelectorAll('tr[class*="row"], tr[data-testid]');
    
    rows.forEach(row => {
      if (row.querySelector('.myreply-btn')) return;
      
      // Find cells with review text
      const cells = row.querySelectorAll('td');
      let reviewText = '';
      
      cells.forEach(cell => {
        const text = cell.textContent?.trim() || '';
        // Look for cell with substantial text
        if (text.length > reviewText.length && text.length > 30 && text.length < 3000) {
          // Avoid picking up dates, statuses, etc.
          if (!/^\d{2}\.\d{2}\.\d{4}/.test(text) && !/^(новый|отвечен|обработан)/i.test(text)) {
            reviewText = text;
          }
        }
      });
      
      if (!reviewText) return;
      
      // Find the last cell (usually actions) or the reply button cell
      const lastCell = row.querySelector('td:last-child');
      if (lastCell) {
        const myReplyBtn = createButton(reviewText);
        myReplyBtn.style.marginTop = '4px';
        lastCell.appendChild(myReplyBtn);
      }
    });
  }

  // Look for reply buttons and inject next to them
  function injectNextToReplyButtons() {
    const buttons = document.querySelectorAll('button, a[class*="btn"]');
    
    buttons.forEach(btn => {
      const text = btn.textContent?.toLowerCase() || '';
      if (!text.includes('ответ') && !text.includes('reply')) return;
      if (btn.parentElement?.querySelector('.myreply-btn')) return;
      
      // Find parent review container
      let parent = btn.closest('[class*="card"], [class*="item"], [class*="review"], tr, [class*="row"]');
      if (!parent) parent = btn.parentElement?.parentElement;
      if (!parent) return;
      
      // Extract review text
      const allText = parent.querySelectorAll('p, span, div');
      let reviewText = '';
      
      allText.forEach(el => {
        const t = el.textContent?.trim() || '';
        if (t.length > reviewText.length && t.length > 20 && t.length < 3000) {
          reviewText = t;
        }
      });
      
      if (!reviewText) return;
      
      const myReplyBtn = createButton(reviewText);
      myReplyBtn.style.marginLeft = '8px';
      
      if (btn.parentElement) {
        btn.parentElement.insertBefore(myReplyBtn, btn.nextSibling);
      }
    });
  }

  // Initialize
  function init() {
    setTimeout(() => {
      injectButtons();
      injectButtonsTable();
      injectNextToReplyButtons();
    }, 1500);
    
    // Watch for changes
    const observer = new MutationObserver(() => {
      setTimeout(() => {
        injectButtons();
        injectButtonsTable();
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

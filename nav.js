// APEX Athletic Performance Store - Navigation & Interactivity Helper
(function () {
  function getBasePath() {
    const p = window.location.pathname.toLowerCase();
    if (p.includes('checkout')) return 'checkout';
    if (p.includes('cart')) return 'cart';
    if (p.includes('product_detail') || p.endsWith('/product') || p.endsWith('/product.html')) return 'product';
    if (p.includes('product_listing') || p.includes('products') || p.includes('shop')) return 'products';
    return 'home';
  }

  function resolveUrl(target) {
    const isDirectFile = window.location.pathname.endsWith('.html');
    const isFileProto = window.location.protocol === 'file:';

    if (isFileProto) {
      const map = {
        home: 'apex_home_page/code.html',
        products: 'apex_product_listing_page/code.html',
        product: 'apex_product_detail_page/code.html',
        cart: 'apex_cart_page/code.html',
        checkout: 'apex_checkout_page/code.html'
      };
      // Determine if we are in a subdirectory
      const inSubdir = window.location.pathname.includes('apex_');
      const prefix = inSubdir ? '../' : './';
      return prefix + map[target];
    }

    // In HTTP server mode
    if (isDirectFile) {
      const fileMap = {
        home: '/index.html',
        products: '/products.html',
        product: '/product.html',
        cart: '/cart.html',
        checkout: '/checkout.html'
      };
      return fileMap[target] || '/index.html';
    }

    const routeMap = {
      home: '/',
      products: '/products',
      product: '/product',
      cart: '/cart',
      checkout: '/checkout'
    };
    return routeMap[target] || '/';
  }

  function initLinks() {
    // 1. Data-path links
    document.querySelectorAll('[data-path="home"]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = resolveUrl('home');
      });
    });

    document.querySelectorAll('[data-path="new-arrivals"], [data-path="men"], [data-path="women"], [data-path="kids"], [data-path="sale"]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = resolveUrl('products');
      });
    });

    document.querySelectorAll('[data-path="cart"]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = resolveUrl('cart');
      });
    });

    // 2. Buttons by text content
    document.querySelectorAll('button, a').forEach(el => {
      const text = el.textContent.trim().toLowerCase();
      if (text.includes('shop now') || text.includes('explore collection') || text.includes('view all drops')) {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          window.location.href = resolveUrl('products');
        });
      } else if (text.includes('proceed to checkout')) {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          window.location.href = resolveUrl('checkout');
        });
      } else if (text.includes('return to cart')) {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          window.location.href = resolveUrl('cart');
        });
      }
    });

    // 3. Product Cards to Detail Page
    document.querySelectorAll('#product-grid > div, .product-card, #apex-carousel > div').forEach(card => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', (e) => {
        // Ignore if clicking a button (like wishlist, quick add size)
        if (e.target.closest('button') && !e.target.closest('h2') && !e.target.closest('h3')) {
          return;
        }
        window.location.href = resolveUrl('product');
      });
    });

    // 4. Search bar Enter key
    const searchInputs = document.querySelectorAll('input[placeholder*="Search"]');
    searchInputs.forEach(inp => {
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          window.location.href = resolveUrl('products');
        }
      });
    });
  }

  function initNavDock() {
    if (document.getElementById('apex-floating-dock')) return;

    const current = getBasePath();
    const dock = document.createElement('div');
    dock.id = 'apex-floating-dock';
    dock.style.position = 'fixed';
    dock.style.bottom = '20px';
    dock.style.left = '50%';
    dock.style.transform = 'translateX(-50%)';
    dock.style.zIndex = '99999';
    dock.style.fontFamily = 'Inter, sans-serif';

    const pages = [
      { id: 'home', label: 'Home', icon: 'home' },
      { id: 'products', label: 'Catalog', icon: 'grid_view' },
      { id: 'product', label: 'Product Detail', icon: 'checkroom' },
      { id: 'cart', label: 'Bag (2)', icon: 'shopping_bag' },
      { id: 'checkout', label: 'Checkout', icon: 'lock' }
    ];

    let itemsHtml = pages.map(p => {
      const isActive = p.id === current;
      const bg = isActive ? 'background: #ff5a1f; color: #ffffff; font-weight: 700;' : 'background: #2a2a2a; color: #c6c6c7;';
      return `<a href="${resolveUrl(p.id)}" style="${bg} text-decoration: none; display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 9999px; font-size: 12px; letter-spacing: 0.04em; text-transform: uppercase; transition: all 0.2s ease; border: 1px solid ${isActive ? '#ff5a1f' : 'rgba(255,255,255,0.08)'};" onmouseover="if(!${isActive}) this.style.color='#ffffff'; this.style.background='#353534';" onmouseout="if(!${isActive}) this.style.color='#c6c6c7'; this.style.background='#2a2a2a';">
        <span class="material-symbols-outlined" style="font-size: 16px;">${p.icon}</span>
        <span>${p.label}</span>
      </a>`;
    }).join('');

    dock.innerHTML = `
      <div id="apex-dock-inner" style="display: flex; align-items: center; gap: 8px; background: rgba(19, 19, 19, 0.92); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); padding: 8px 12px; border-radius: 9999px; border: 1px solid rgba(255, 181, 158, 0.25); box-shadow: 0 16px 36px rgba(0,0,0,0.6);">
        <div style="display: flex; align-items: center; gap: 6px; padding-right: 8px; border-right: 1px solid rgba(255,255,255,0.12);">
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 8px #4ade80;"></span>
          <span style="font-size: 10px; font-weight: 800; letter-spacing: 0.1em; color: #ffb59e; text-transform: uppercase;">APEX LOCALHOST</span>
        </div>
        <div id="apex-dock-links" style="display: flex; align-items: center; gap: 6px;">
          ${itemsHtml}
        </div>
        <button id="apex-dock-toggle" title="Minimize/Maximize APEX Bar" style="background: none; border: none; color: #888; cursor: pointer; padding: 4px; display: flex; align-items: center; border-radius: 50%;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#888'">
          <span class="material-symbols-outlined" style="font-size: 18px;">expand_more</span>
        </button>
      </div>
    `;

    document.body.appendChild(dock);

    const toggleBtn = document.getElementById('apex-dock-toggle');
    const linksDiv = document.getElementById('apex-dock-links');
    let collapsed = false;
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      collapsed = !collapsed;
      if (collapsed) {
        linksDiv.style.display = 'none';
        toggleBtn.querySelector('span').textContent = 'expand_less';
      } else {
        linksDiv.style.display = 'flex';
        toggleBtn.querySelector('span').textContent = 'expand_more';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initLinks();
      initNavDock();
    });
  } else {
    initLinks();
    initNavDock();
  }
})();

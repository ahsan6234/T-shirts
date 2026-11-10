# APEX Athletic Apparel E-Commerce Store

High-performance athletic apparel e-commerce web application featuring modern dark-mode aesthetics, responsive typography, and reactive shopping workflows.

## 🚀 Live Localhost Server

The local web server is currently running at:
- **Local URL**: [http://localhost:8080/](http://localhost:8080/)

### 📄 Pages & Routes

| Route | Page | Description |
|---|---|---|
| [`/`](http://localhost:8080/) or [`/index.html`](http://localhost:8080/index.html) | **Home** | Hero section, drop countdown ticker, live technical specs, feature matrix, and categories |
| [`/products`](http://localhost:8080/products) or [`/products.html`](http://localhost:8080/products.html) | **Catalog** | Filterable product catalog (size, color, price slider, technical specs), multi-column grid toggle |
| [`/product`](http://localhost:8080/product) or [`/product.html`](http://localhost:8080/product.html) | **Product Detail** | AeroVent Pro Tech Tee detail page with size selector, color index, gallery, and animated Add-to-Bag toast |
| [`/cart`](http://localhost:8080/cart) or [`/cart.html`](http://localhost:8080/cart.html) | **Shopping Bag** | Dynamic cart with quantity selectors, promo drawer, shipping estimator, and checkout CTA |
| [`/checkout`](http://localhost:8080/checkout) or [`/checkout.html`](http://localhost:8080/checkout.html) | **Checkout** | 3-step shipping/payment wizard, express pay options, and mock order authorization protocol |

## 🛠️ How to Restart

To start the server at any time:
- **Double click**: [`start.bat`](file:///C:/Users/NEW%20PC%20TECH/.gemini/antigravity/scratch/stitch_athletic_apparel/stitch_athletic_apparel_e_commerce_store/start.bat)
- **Or run via PowerShell**:
  ```powershell
  powershell -ExecutionPolicy Bypass -File .\server.ps1 -Port 8080
  ```

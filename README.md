# 📦 Factory Flow (React + Vite)

A modern, serverless, zero-privacy-risk web application built with **React 18**, **Vite**, **Firebase (Firestore & Auth)**, and **jsPDF**. Designed for carton box brokers and mediators managing transactions between box factories and end customers.

---

## ✨ Features

- **Order Costing & Margin Master**: Real-time auto-calculation of customer price, total customer bill, total factory cost, and gross profit margin.
- **Box Product Specs Catalog**: Maintain box specs per customer (Length, Width, Height, Ply, GSM) with real-time auto-generated specification descriptions.
- **Factory Ledger & Customer Dues**: Running balance sheets for factory liabilities and customer receivables.
- **Photo Attachments Hub**: Drag-and-drop reference photo uploads with full-screen lightbox preview.
- **Monthly Factory PDF Generator**: 1-click **jsPDF** report generator formatted specifically to send to factory owners over WhatsApp or Email.
- **Bring Your Own Firebase (BYOF)**: Serverless client-side connection using your own free Firebase account.
- **Google OAuth Login**: Access your business data securely on any device globally.
- **1-Click CSV Backup**: Download complete order and ledger histories as CSV files.

---

## 🛠️ Getting Started

### Local Development
```bash
npm install
npm run dev
```

### Build for Production
```bash
npm run build
```

### Automatic Deploy to GitHub Pages
The project includes a pre-configured GitHub Actions workflow (`.github/workflows/deploy.yml`). Simply push to your `main` branch on GitHub, and it will deploy your static app to GitHub Pages automatically!

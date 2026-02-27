<div align="center">
  <h1>🎒 Backpack</h1>
  <p><b>The modern, lightweight API Gateway to secure and cache your backend seamlessly.</b></p>
  <br/>
</div>

![Dashboard Overview](https://raw.githubusercontent.com/placeholder/image/main/dashboard.png)

Backpack is a developer-friendly API Gateway designed with aesthetics and performance in mind. Built with **FastAPI** on the backend and an ultra-fast **Next.js** dashboard, Backpack proxies your traffic while providing enterprise-grade features out of the box.

## ✨ Features

- **⚡ Zero-Knowledge Proxying:** Routes traffic reliably without modifying your payloads.
- **🛡 WAF (Web Application Firewall):** Intercepts and blocks malicious payloads like SQLi and XSS before they touch your backend.
- **🚦 Sliding Window Rate Limiting:** Prevent API abuse effectively using distributed memory counters.
- **💾 LRU Caching:** Sub-millisecond in-memory caching for GET requests to drastically reduce backend load.
- **🔄 POST Idempotency:** Safely handles duplicate mutations, guaranteeing endpoints execute only once per unique request.
- **📊 Real-time Dashboard:** A gorgeous, dark-mode real-time UI to monitor traffic, cache hits, and thwarted threats.

---

## 🚀 Quick Start

### 1. Backend (FastAPI Gateway)

Make sure you have Python 3.9+ installed.

```bash
# Clone the repository
git clone https://github.com/yourusername/backpack.git
cd backpack/backend

# Create a virtual environment & install dependencies
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install fastapi uvicorn httpx

# Start the gateway
uvicorn main:app --reload --host 0.0.0.0 --port 8080
```

### 2. Frontend (Next.js Dashboard)

Make sure you have Node.js 18+ installed.

```bash
cd backpack/frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Dashboard will be available at **`http://localhost:3000`**.

---

## 🐳 Self-Hosting (Docker)

To deploy Backpack on your own infrastructure, we recommend using Docker.

**`docker-compose.yml`**:

```yaml
version: "3.8"

services:
  gateway:
    image: backpack-gateway:latest
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - TARGET_BACKEND_URL=https://api.yourcompany.com
    restart: always

  dashboard:
    image: backpack-dashboard:latest
    build: ./frontend
    ports:
      - "3000:3000"
    restart: always
```

Run the stack:

```bash
docker-compose up -d
```

---

## 📸 Screenshots

|                                       Overview                                       |                                Settings & Features                                 |
| :----------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------: |
| ![Dashboard](https://raw.githubusercontent.com/placeholder/image/main/dashboard.png) | ![Settings](https://raw.githubusercontent.com/placeholder/image/main/settings.png) |

_(Note: Replace placeholder image URLs with actual raw image links after uploading screenshots to GitHub)._

---

## 🤝 Contributing

We love our contributors! Here's how you can help:

1. Fork the repo.
2. Create a new branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<br/>
<div align="center">
  <b>Built with ❤️ for developers.</b>
</div>

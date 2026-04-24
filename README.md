# Silver Connect | Elite Care Terminal

**Silver Connect** is a premium, production-ready frontend terminal for a secure caregiving ecosystem. It bridges the gap between families and verified healthcare professionals through a refined, role-based digital registry.

This isn’t just a dashboard—it’s a **controlled-access registry** built with intent.

---

## The Vision
Healthcare platforms shouldn't feel cold or cluttered. Silver Connect uses a **Dossier-style design**, combining deep slate tones and subtle gold accents with fluid motion to create a calm, trustworthy experience. The UI adapts dynamically based on user clearance—because in caregiving, trust is earned.



## 🛠 Core Features

### Security & Access Control
- **Secure Fetch Layer:** A global `secureFetch` wrapper that automates JWT injection and monitors session health on every request.
- **Session Protection:** Immediate local state purging and gateway redirection upon any unauthorized signal.
- **RBAC (Role-Based Access Control):** The interface morphs based on your clearance:
  - **Admin:** The Audit & Control Terminal.
  - **Helper:** Specialist Dossier Management.
  - **Client:** Deployment & Booking Hub.

### Design Philosophy
- **Next.js 15 (App Router):** High-performance routing and modern architecture.
- **Elite Aesthetic:** A custom Tailwind theme focused on high-contrast typography and intentional spacing.
- **Fluid Motion:** Smooth, Dossier-style transitions powered by Framer Motion.
- **Adaptive UI:** Fully responsive experience from mobile terminals to 4K displays.

## Tech Stack
* **Framework:** Next.js 15+
* **Styling:** Tailwind CSS
* **Animations:** Framer Motion
* **Icons:** Lucide React
* **State:** React Context API

## Registry Integration
The terminal is hardwired to the **Live Silver Connect API** hosted on **Render**.

* **Production Endpoint:** `https://silver-connect-backend.onrender.com`
* **Operations:** Handles secure handshakes (OAuth), cryptographic identity recovery (SMTP), and real-time dispatch authorization.



## Setup

1. **Clone & Enter:**
   ```bash
   git clone [https://github.com/BatoolAmina/silver-connect.git](https://github.com/BatoolAmina/silver-connect.git)
   cd silver-connect
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Initialize Development Server:**
    ```bash
    npm run dev
    ```

* **Production Endpoint:** `https://silver-connect-backend.onrender.com`

Built with passion for the caregiving community. 

# EngNext

**EngNext** is a career platform designed to connect **engineering graduates** with **companies** offering entry-level opportunities.  
It enables students to create professional profiles, showcase their skills and projects, and apply for graduate roles — while allowing companies to discover and manage talent efficiently.

Live at: [https://engnext.xyz](https://engnext.xyz)

---

## 🚀 Overview

EngNext bridges the gap between **engineering graduates** and **employers**.  
The platform provides separate dashboards for students, companies, and admins — streamlining the hiring process for both sides.

---

## ✨ Features

### 👩‍🎓 For Graduates (Students)
- Create a professional profile with personal, educational, and skill details  
- Upload CVs, portfolios, and highlight engineering projects  
- Browse and apply for **entry-level and graduate roles**  
- Track application status and receive notifications on progress  

### 🏢 For Companies
- Register and manage a company profile with contact information and logo  
- Post and manage **graduate vacancies** (entry-level positions)  
- Search and filter graduate profiles by **university, major, skills, and graduation year**  
- View applicant details, shortlist candidates, send messages, and schedule interviews  
- Maintain a company dashboard to track hiring activity  

### 🛠️ For Admins
- Add, edit, and manage company accounts directly  
- Access an admin dashboard to oversee all companies and postings  
- Moderate or remove inactive or invalid company/graduate profiles  
- Monitor platform usage and manage overall system health  

---

## 🧩 Technology Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React, TypeScript, Tailwind CSS |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | MongoDB |
| **Deployment** | Vercel (Frontend) & Render / Railway / similar (Backend) |
| **Auth** | JWT-based Authentication |

---

## ⚙️ Installation (Local Setup)

Follow these steps to set up the project locally:

1. **Clone the repository**
   ```bash
   git clone https://github.com/avidzcheetah/EngNext.git
   cd EngNext
   ```

2. **Install dependencies**

   ```bash
   npm install
   cd backend
   npm install
   cd ..
   ```

3. **Set environment variables**

   Create a `.env` file in `/backend`:

   ```env
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   PORT=5000
   ```

4. **Run backend server**

   ```bash
   cd backend
   npm start
   ```

5. **Run frontend**

   ```bash
   npm run dev
   ```

6. Visit **[http://localhost:3000](http://localhost:3000)** to view the app.

---

## 💡 Usage

* **Graduates** can sign up, build profiles, and apply for graduate-level job postings.
* **Companies** can post roles, search graduates, and manage applicants.
* **Admins** can monitor and manage both company and graduate accounts.

---

## 🧠 Development Context

EngNext was developed to meet the needs of **Engineering and Computer Engineering students at the University of Jaffna (E21 Batch)**, helping them transition smoothly into the professional world.

---

## 🤝 Contributing

Contributions are welcome!
Developers can fork this repository to add new features such as:

* Analytics dashboard
* AI-based CV ranking
* Graduate–Company messaging
* Enhanced admin monitoring tools

To contribute:

1. Fork the repo
2. Create a new branch (`feature/your-feature-name`)
3. Commit your changes
4. Push to your branch and open a Pull Request

---

## 📬 Contact

**Developer:** Avidu Witharana
**Email:** [avidu@pm.me](mailto:avidu@pm.me)
**GitHub:** [@avidzcheetah](https://github.com/avidzcheetah)
**Live Website:** [https://engnext.xyz](https://engnext.xyz)

---

That would make your repo look more professional and ready for recruiters or portfolio showcasing.
```

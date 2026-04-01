# 💧 AquaPure – Rural Water Purifier Platform

A professional, fully responsive water purifier website built for **rural and semi-urban households** across India. Clean water is a right — AquaPure makes it affordable and accessible.

---

## 🌐 Live Preview

Open `index.html` in any modern browser to run the project locally.

---

## ✨ Features

### 🏠 Landing Page (`index.html`)
- Sticky navbar with scroll effect + active state
- Mobile-responsive hamburger menu
- Hero section with rural family background image
- Animated stats counter (10K+ homes, 500+ villages, 98% satisfaction)
- About section with village environment image
- Services section (Installation, Maintenance, Filter Replacement)
- "Why Choose Us" section with glassmorphism cards
- Contact form with validation + localStorage inquiry storage
- Footer with quick links and social buttons
- Scroll-triggered fade-in animations (Intersection Observer)

### 🔐 Register Page (`register.html`)
- Split-layout: visual panel + form panel
- Real-time **password strength indicator** (Weak / Fair / Good / Strong)
- Live field validation (name, email, phone, password, confirm, terms)
- Password show/hide toggle
- User data saved to **localStorage**
- Auto-login after registration → redirects to dashboard
- Testimonial from a real rural community member

### 🔑 Login Page (`login.html`)
- Same split-layout design as register
- Email + password validation
- Credentials verified from **localStorage**
- Error shaking effect on wrong login
- Auto-redirect if already logged in
- Redirects to dashboard on success

### 📊 Dashboard Page (`dashboard.html`)
- **Auth guard** — redirects to login if not signed in
- Sidebar navigation with active link highlighting
- Mobile sidebar with hamburger toggle
- Personalized welcome banner with time-based greeting
- Animated stat cards (Services, Completed, Days to Filter Change, Rating)
- "Book a Service" modal with form validation
- User profile card displaying localStorage data
- Image banners (family, technician, clean water)
- Toast notification system
- **Logout** with confirmation → clears localStorage session

---

## 📁 Folder Structure

```
dti-2/
│
├── index.html          → Landing Page
├── register.html       → User Registration
├── login.html          → User Sign In
├── dashboard.html      → User Dashboard
├── README.md           → Project Documentation
│
├── css/
│   ├── styles.css      → Landing page styles
│   ├── auth.css        → Login & Register styles
│   └── dashboard.css   → Dashboard page styles
│
├── js/
│   ├── main.js         → Landing page JS (navbar, scroll, animations, contact form)
│   ├── auth.js         → Auth JS (register, login, localStorage, validation)
│   └── dashboard.js    → Dashboard JS (user info, booking modal, logout, toasts)
│
└── images/
    ├── hero-family.png       → Hero background: rural family drinking water
    ├── village-water.png     → About section: village environment
    ├── technician-service.png→ Services: technician installing purifier
    ├── clean-water.png       → Services: crystal-clear pure water
    ├── rural-family.png      → Happy rural family
    └── purifier-device.png   → Water purifier product shot
```

---

## 🖼️ Image Usage

All images are AI-generated, thematically matching rural India:

| File | Usage | Description |
|---|---|---|
| `hero-family.png` | Hero section & Dashboard | Rural family drinking clean water |
| `village-water.png` | About section & Auth panels | Peaceful Indian village |
| `technician-service.png` | Services card & Dashboard | Technician helping rural family |
| `clean-water.png` | Services card & Dashboard | Crystal-clear water close-up |
| `rural-family.png` | General use | Happy family outdoors |
| `purifier-device.png` | Services: Installation | Product photography |

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary | `#0077b6` (Ocean Blue) |
| Accent | `#00d4ff` (Aqua Cyan) |
| Aqua Light | `#90e0ef` |
| Background | `#f0f8ff` |
| Font | Outfit, Inter (Google Fonts) |

---

## ⚙️ JavaScript Modules

### `main.js`
- Sticky navbar scroll behaviour
- Hamburger mobile menu toggle
- Smooth anchor scrolling
- Intersection Observer scroll animations
- Contact form validation & localStorage submission
- Animated stat counters
- Auth-aware navbar labels

### `auth.js`
- Password strength meter (4-bar visual indicator)
- Real-time field validation
- Password show/hide toggle
- Register: saves user to `aquapure_users[]` in localStorage
- Login: matches credentials from localStorage
- Loading spinner simulation
- Alert banner with auto-dismiss

### `dashboard.js`
- Auth guard (redirect if not logged in)
- User info population from localStorage
- Time-based greeting (Good Morning / Afternoon / Evening)
- Sidebar toggle for mobile
- Booking modal with service pre-selection
- Bookings saved to `aquapure_bookings[]` in localStorage
- Toast notification system
- Stat counter entry animation
- Logout with confirmation dialog

---

## 🗄️ localStorage Keys

| Key | Type | Description |
|---|---|---|
| `aquapure_users` | Array | All registered users |
| `aquapure_logged_in` | Object | Currently logged-in user |
| `aquapure_bookings` | Array | All service bookings |
| `aquapure_inquiries` | Array | Contact form submissions |

---

## 🚀 How to Run

1. **Clone or download** the project folder
2. Open `index.html` directly in any modern browser (Chrome, Firefox, Edge)
3. No build tools, no npm, no server needed — pure HTML/CSS/JS!

> **To test the full flow:**
> 1. Click **Get Started** → fills the Register form
> 2. After registration, you're auto-logged in → lands on Dashboard
> 3. Click **Book a Service** to try the booking modal
> 4. Click **Sign Out** to test logout
> 5. Go back to `login.html` and sign in with the same credentials

---

## 📌 Tech Stack

- **HTML5** – Semantic markup
- **CSS3** – Flexbox, Grid, CSS Variables, Animations, Glassmorphism
- **Vanilla JavaScript (ES6+)** – No frameworks, no dependencies
- **Google Fonts** – Outfit, Inter
- **localStorage** – Client-side persistence

---

## 🙏 Made for Rural India

> "Pure water is not a luxury. It's a right."

AquaPure is built with empathy for rural and semi-urban families across India who deserve clean, safe, and affordable drinking water solutions.

---

*© 2025 AquaPure. All rights reserved.*

# 🧪 Test Management Application

A full-featured **Test Management System** built as part of a frontend developer assignment.  
This project demonstrates real-world implementation of **authentication, multi-step form workflows, API integration, and CRUD operations**.

---

## 📌 Project Purpose

This application simulates an end-to-end **test creation and publishing platform**, similar to systems used in online assessment and learning management tools.

It is designed to showcase:
- Clean UI architecture
- Scalable component structure
- Form-heavy workflow handling
- State management and API integration
- Real-world frontend development practices

---

## 🚀 Key Features

### 🔐 Authentication
- Secure login using **User ID & Password**
- JWT token-based authentication
- Persistent session handling (localStorage/sessionStorage)
- Protected routes with redirection

---

### 📊 Dashboard (Test Listing)
- Displays all created tests
- View key details:
  - Test Name
  - Subject
  - Status (Draft / Published)
  - Created Date
- Actions:
  - Edit Test
  - View Test
  - Delete Test
- Create New Test CTA
- Search & filter support (optional enhancement)

---

### 📝 Create / Edit Test (Multi-Step Form)
A structured form to build test configuration:

- Test Name
- Subject (API-driven dropdown)
- Test Type
- Topics & Sub-topics (dynamic dependent dropdowns)
- Difficulty Level
- Marking Scheme:
  - Correct marks
  - Wrong marks
  - Unattempted marks
- Total Time & Total Marks

**Features:**
- Save as Draft
- Form validation
- Multi-step navigation

---

### ❓ Add Questions Module
- Add multiple questions per test
- Supports:
  - Question text
  - 4 options (MCQ format)
  - Correct answer selection
  - Explanation (optional)
  - Difficulty level
  - Topic & Sub-topic mapping
  - Media URL support
- Edit & delete questions
- Minimum 1 question required before proceeding

---

### 👀 Preview & Publish
- Complete test overview before publishing
- Review all questions and configurations
- Edit test or questions if needed
- Publish test with confirmation success flow
- Redirect to dashboard after publishing

---

## 🛠️ Tech Stack

- **Frontend:** React 
- **Language:** TypeScript
- **Styling:** SCSS 
- **API Integration:** REST APIs
- **Authentication:** JWT-based auth system


---

## 🧠 What This Project Demonstrates

This project highlights practical frontend engineering skills such as:

- Building **real-world multi-page workflows**
- Handling **complex form structures**
- Managing **API-driven dynamic dropdowns**
- Implementing **authentication & protected routes**
- Designing **scalable component architecture**
- Managing **state across multi-step processes**

---


# Blog Vault

Blog Vault is an interactive platform designed for users to post, manage, and engage with blogs on various topics. It provides a space for content creators to share their insights and for readers to interact by commenting and rating posts. Admins have comprehensive tools to manage users and ensure the community remains respectful and productive.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Setup](#project-setup)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

## Tech Stack

**Frontend:**
- **React:** A popular JavaScript library for building user interfaces.
- **Vite:** A fast build tool that provides a smooth development experience.
- **Tailwind CSS:** A utility-first CSS framework for creating responsive and customizable designs.

**Backend:**
- **Node.js:** A JavaScript runtime built on Chrome's V8 engine, used for building scalable network applications.
- **Express.js:** A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

**Database:**
- **MongoDB:** A NoSQL database that uses a document-oriented data model, providing flexibility and scalability.

**Authentication:**
- **Firebase:** A platform developed by Google for creating mobile and web applications, which includes authentication, real-time databases, and more.

## Features

- **User Management:** 
  - Users can sign up, log in, and manage their profiles.
  - Password recovery and email verification are supported.

- **Blog Management:** 
  - Users can create new blog posts, edit existing ones, and delete posts.
  - Posts can be categorized by tags and topics.

- **Commenting System:** 
  - Readers can leave comments on blog posts and rate them.
  - Comments are threaded to facilitate discussions.

- **Admin Controls:** 
  - Admins have the ability to manage user accounts, including banning or promoting users.
  - Admins can moderate comments to remove inappropriate content.

- **Responsive Design:** 
  - The platform is designed to be fully responsive and accessible on various devices, including desktops, tablets, and smartphones.

## Project Setup

### Prerequisites

Before setting up the project, ensure you have the following installed:
- **Node.js** (>= 14.x): [Download Node.js](https://nodejs.org/)
- **npm** or **yarn**: Comes bundled with Node.js
- **MongoDB**: [Download MongoDB](https://www.mongodb.com/try/download/community)
- **Firebase CLI**: [Install Firebase CLI](https://firebase.google.com/docs/cli#install-cli)

### Backend Setup
**Clone the repository:**
   ```bash
   git clone https://github.com/your-username/blog-vault.git
   cd blog-vault
   npm i
   npm run dev

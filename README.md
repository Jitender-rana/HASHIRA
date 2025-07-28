# 🔐 Shamir Secret Sharing App – Setup Guide

This project implements a simplified version of **Shamir's Secret Sharing** algorithm using TypeScript. It accepts a `secret.json` file containing shares and reconstructs the original secret.

---

## 📁 Project Structure

.
├── Dockerfile
├── package.json
├── tsconfig.json
├── src
│ └── index.ts
└── secret.json (you provide this)

yaml
Copy
Edit

---

## ⚙️ Requirements

- [Node.js](https://nodejs.org/) ≥ 18 (optional if using Docker)
- [Docker](https://www.docker.com/) ≥ 20.10

---

## 🚀 Running Locally (Without Docker)

1. **Install dependencies**
   ```bash
   npm install
Add secret.json in root directory

Example:

json
Copy
Edit
{
  "n": 4,
  "k": 3,
  "shares": [
    { "x": 1, "value": "Multiply(1000000000000000000, 2)", "base": 10 },
    { "x": 2, "value": "LCM(8, 12)", "base": 10 },
    { "x": 3, "value": "HCF(54, 24)", "base": 10 },
    { "x": 4, "value": "Multiply(5, 9)", "base": 10 }
  ]
}
Run app

Development mode:

bash
Copy
Edit
npm run dev
Production mode:

bash
Copy
Edit
npm run build
node dist/index.js
🐳 Running with Docker (Recommended)
Build Docker image

bash
Copy
Edit
docker build -t shamir-app .
Run the app with your secret.json file

bash
Copy
Edit
docker run -v $(pwd)/secret.json:/app/secret.json shamir-app
✅ For Windows (PowerShell):

powershell
Copy
Edit
docker run -v ${PWD}/secret.json:/app/secret.json shamir-app
🔄 Output
The app will reconstruct the secret using Lagrange interpolation.

It also detects incorrect shares and shows the most commonly occurring decoded secret.

💬 Notes
Update src/index.ts if you want to support CLI arguments or environment variables in the future.

The project uses BigInt, so your TypeScript target is set to ES2020.

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-19.2.3-blue?style=for-the-badge&logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
</p>

# Epidemic Report Generator

A modern web application for generating comprehensive epidemic reports based on user input data. This frontend provides an intuitive interface for data visualization and report generation, built with cutting-edge web technologies for optimal performance and user experience.

## Project Structure

```
epi-report/
├── public/                 # Static assets (SVG icons, images)
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── dashboard/      # Main dashboard interface
│   │   ├── login/          # Authentication pages
│   │   ├── layout.tsx      # Root layout component
│   │   └── page.tsx        # Home page
│   ├── components/         # Reusable UI components
│   │   ├── auth/           # Authentication components
│   │   ├── loading/        # Loading states
│   │   └── login/          # Login form components
│   ├── context/            # React context providers
│   │   └── AuthContext.tsx # Authentication context
│   └── services/           # API services
│       └── api.ts          # API client configuration
├── package.json            # Dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd epi-report
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Features

- Modern, responsive user interface built with Tailwind CSS
- Real-time data visualization using Recharts
- Secure authentication system
- TypeScript for type safety and better developer experience
- Optimized performance with Next.js 16
- Markdown support for rich content display

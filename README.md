# FIT-SMART Frontend Application

FIT-SMART is a comprehensive fitness and wellness platform built with React, TypeScript, and Vite. This modern web application provides an intuitive interface for users to manage their fitness journey, connect with mentors, access AI-powered workout plans, and engage with a supportive community.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation Guide](#installation-guide)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Key Features](#key-features)
- [Troubleshooting](#troubleshooting)

## Features

- **User Authentication**: Secure login and registration with JWT tokens and Google OAuth
- **Role-Based Access**: Different interfaces for Members, Mentors, and Admins
- **Dashboard**: Personalized dashboards with fitness insights and analytics
- **Mentor Booking**: Browse mentors, view availability, and book sessions with calendar integration
- **AI Fitness Plans**: Generate and manage personalized workout and nutrition plans
- **Community Forums**: Create threads, reply to discussions, like posts, and filter by tags
- **Progress Tracking**: Monitor fitness goals, workouts, and achievements
- **Reports**: Generate and download PDF reports of fitness progress
- **Notifications**: Real-time notifications for bookings, replies, and updates
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Dark Mode**: Theme support for better user experience

## Tech Stack

- **Framework**: React 19.x with TypeScript
- **Build Tool**: Vite 6.x for fast development and optimized builds
- **State Management**: Redux Toolkit with Redux Persist
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Charts**: Chart.js with react-chartjs-2
- **Authentication**: JWT with Google OAuth (@react-oauth/google)
- **UI Components**: Custom components with Lucide React icons
- **Form Handling**: React Select for country/language selection
- **PDF Generation**: jsPDF with html2canvas
- **Notifications**: React Toastify

## Prerequisites

Before installing the application, ensure you have the following installed:

- **Node.js**: Version 18.x or higher ([Download](https://nodejs.org/))
- **Yarn**: Version 1.22.x or higher ([Installation Guide](https://classic.yarnpkg.com/en/docs/install)) or npm
- **Git**: For cloning the repository ([Download](https://git-scm.com/downloads))

To verify installations, run:
```bash
node --version
yarn --version  # or npm --version
```

**Note**: Ensure the backend API is running before starting the frontend application.

## Installation Guide

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd fitSmartFront
```

### Step 2: Install Dependencies

Using Yarn (recommended):
```bash
yarn install
```

Or using npm:
```bash
npm install
```

This will install all required packages as defined in `package.json`.

### Step 3: Set Up Environment Variables

Create a `.env` file in the root directory by copying the example file:

```bash
cp example.env .env
```

Edit the `.env` file with your configuration (see [Configuration](#configuration) section).

### Step 4: Verify Backend Connection

Ensure the backend API is running and accessible at the URL specified in your `.env` file (default: `http://localhost:3000`).

### Step 5: Start the Development Server

```bash
yarn dev
```

The application will open at `http://localhost:5173` by default.

## Configuration

Configure the following environment variables in your `.env` file:

### API Configuration

```env
VITE_API_URL=http://localhost:3000/api
```

This should point to your running backend API server.

### Google OAuth Configuration

To enable Google login, you need to:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized JavaScript origins: `http://localhost:5173`
6. Add authorized redirect URIs: `http://localhost:5173`
7. Copy the Client ID

```env
VITE_OAUTH_CLIENT_ID=your_google_oauth_client_id_here
```

### Google Calendar Integration

For mentor booking calendar integration:

```env
VITE_GOOGLE_CALENDAR_API_URL=https://www.googleapis.com/calendar/v3
VITE_GOOGLE_CALENDAR_SCOPE=https://www.googleapis.com/auth/calendar
```

## Running the Application

### Development Mode

Start the development server with hot module replacement:

```bash
yarn dev
```

The application will be available at `http://localhost:5173` and will automatically reload when you make changes to the source code.

### Preview Production Build

To preview the production build locally:

```bash
yarn build
yarn preview
```

This builds the application and serves it locally to test production behavior.

## Building for Production

### Build the Application

```bash
yarn build
```

This command:
1. Runs TypeScript compiler (`tsc -b`)
2. Builds optimized production assets with Vite
3. Outputs to the `dist/` directory

### Build Output

The `dist/` directory will contain:
- Optimized JavaScript bundles
- Minified CSS files
- Optimized images and assets
- `index.html` entry point

### Deploy the Build

Upload the contents of the `dist/` directory to your web server or hosting platform:

**Popular hosting options:**
- **Vercel**: `npm i -g vercel && vercel`
- **Netlify**: Drag and drop `dist/` folder or use Netlify CLI
- **GitHub Pages**: Configure repository settings
- **AWS S3 + CloudFront**: Upload to S3 bucket
- **Traditional hosting**: Upload via FTP/SFTP

## Project Structure

```
fitSmartFront/
├── public/                  # Static assets
├── src/
│   ├── api/                 # API configuration and endpoints
│   │   ├── axiosInstance.tsx   # Axios configuration with interceptors
│   │   └── endpoints/          # API endpoint definitions
│   │       ├── bookings.tsx
│   │       ├── dashboard.tsx
│   │       ├── mentors.tsx
│   │       ├── plans.tsx
│   │       ├── threads.tsx
│   │       └── ... (other endpoints)
│   ├── assets/              # Images, fonts, and static files
│   ├── components/          # Reusable UI components
│   │   ├── footer/          # Footer component
│   │   ├── header/          # Navigation header
│   │   └── ui/              # Shared UI components
│   │       ├── button.tsx
│   │       ├── Modal.tsx
│   │       ├── dataTable.tsx
│   │       ├── pagination.tsx
│   │       ├── Charts/      # Chart components
│   │       └── ...
│   ├── config/              # Application configuration
│   │   └── appConfig.tsx    # Environment variables
│   ├── enums/               # TypeScript enums
│   │   └── userDetailEnums.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useTheme.ts      # Theme management
│   │   ├── usePagination.ts # Pagination logic
│   │   └── useCreateGoogleMeeting.ts
│   ├── interfaces/          # TypeScript interfaces
│   │   ├── user.tsx
│   │   ├── mentor.tsx
│   │   ├── booking.tsx
│   │   ├── plan.tsx
│   │   └── ...
│   ├── layouts/             # Page layouts
│   │   └── mainLayout.tsx   # Main app layout with header/footer
│   ├── pages/               # Page components
│   │   ├── Admin/           # Admin dashboard pages
│   │   ├── CommunityForum/  # Forum pages
│   │   ├── Dashboards/      # User dashboards
│   │   ├── Landing/         # Landing page
│   │   ├── Login/           # Login page
│   │   ├── Register/        # Registration page
│   │   ├── MentorBooking/   # Booking pages
│   │   ├── Plans/           # Fitness plans pages
│   │   ├── Reports/         # Reports pages
│   │   ├── Notifications/   # Notifications page
│   │   └── UserAccount/     # Profile management
│   ├── routes/              # Route configuration
│   │   └── protectedRoute.tsx  # Protected route wrapper
│   ├── services/            # Business logic services
│   │   └── googleMeetService.ts
│   ├── store/               # Redux store configuration
│   │   ├── store.tsx        # Store setup with persist
│   │   └── authSlice.tsx    # Authentication state
│   ├── types/               # Type declarations
│   ├── utils/               # Utility functions
│   │   ├── countryOptions.ts
│   │   ├── languageOptions.ts
│   │   ├── dateUtils.ts
│   │   └── filterPayload.ts
│   ├── App.tsx              # Main app component with routes
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles with Tailwind
├── .env                     # Environment variables
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── index.html               # HTML entry point
```

## Available Scripts

### Development

```bash
yarn dev              # Start development server
yarn preview          # Preview production build locally
```

### Building

```bash
yarn build            # Build for production
```

### Code Quality

```bash
yarn lint             # Run ESLint
yarn format           # Format code with Prettier
```

## Key Features

### User Roles

The application supports three user roles:

1. **Member**: Regular users who can book mentors, access fitness plans, and participate in forums
2. **Mentor**: Fitness professionals who can manage their availability, view bookings, and interact with clients
3. **Admin**: System administrators with full access to manage users, content, and system settings

### Authentication Flow

1. Users can register with email or sign in with Google OAuth
2. JWT tokens are stored securely and automatically refreshed
3. Protected routes redirect unauthenticated users to login
4. Role-based access control for different features

### Dashboard Features

**Member Dashboard:**
- Overview of fitness goals and progress
- Quick access to upcoming bookings
- Recently generated fitness plans
- Community forum highlights
- Progress charts and analytics

**Mentor Dashboard:**
- Upcoming and past sessions
- Client management
- Availability calendar
- Earnings and statistics
- Rating and reviews

**Admin Dashboard:**
- User management
- System analytics
- Content moderation
- Report generation

### Mentor Booking System

1. Browse available mentors with filters
2. View mentor profiles, specializations, and ratings
3. Check real-time availability
4. Book sessions with instant confirmation
5. Google Calendar integration for scheduling
6. Manage bookings (cancel, reschedule)

### AI Fitness Plans

1. Answer questionnaire about fitness goals
2. AI generates personalized workout and nutrition plans
3. View and manage multiple plans
4. Accept and track plan progress
5. Generate variations based on preferences

### Community Forums

- Browse threads by category and tags
- Create new discussion threads
- Reply to threads and comments
- Like posts and replies
- Filter by popular, recent, or specific tags
- Real-time updates for new activity

### Progress Tracking

- Log workouts and exercises
- Track weight, measurements, and photos
- View progress charts and trends
- Set and monitor goals
- Generate progress reports

## Troubleshooting

### Common Issues

#### Port Already in Use

If port 5173 is already in use:

```bash
# The development server will automatically try the next available port
# Or you can specify a different port in vite.config.ts
```

#### API Connection Failed

- Verify the backend is running at the URL specified in `VITE_API_URL`
- Check for CORS issues in the backend configuration
- Ensure the API URL doesn't have a trailing slash
- Check browser console for detailed error messages

#### Google OAuth Not Working

- Verify `VITE_OAUTH_CLIENT_ID` is correctly set in `.env`
- Ensure authorized JavaScript origins include your development URL
- Check that the Google Cloud project has Google+ API enabled
- Verify the OAuth consent screen is properly configured

#### Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules yarn.lock dist
yarn install
yarn build
```

#### TypeScript Errors

```bash
# Check TypeScript configuration
yarn tsc --noEmit

# Update TypeScript and related packages
yarn upgrade typescript @types/react @types/react-dom
```

#### Environment Variables Not Loading

- Ensure `.env` file is in the root directory
- All variables must start with `VITE_` prefix
- Restart the development server after changing `.env`
- Variables are embedded at build time, not runtime

#### Styling Issues

- Clear Tailwind CSS cache: `rm -rf .vite`
- Check `tailwind.config.js` content paths
- Verify `@tailwind` directives in `index.css`
- Restart dev server after Tailwind config changes

### Browser Compatibility

The application supports modern browsers:
- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)

For older browsers, additional polyfills may be required.

### Performance Optimization

- Enable code splitting in Vite config
- Use lazy loading for routes
- Optimize images before importing
- Use production builds for deployment
- Enable Gzip compression on server

### Getting Help

For additional support:
1. Check browser console for error messages
2. Review network tab for API request failures
3. Verify all environment variables are set correctly
4. Ensure backend API is running and accessible
5. Check the backend logs for API errors

## Development Guidelines

### Code Style

- Follow React best practices and hooks guidelines
- Use TypeScript for type safety
- Keep components small and focused
- Use custom hooks for reusable logic
- Follow the project's folder structure

### State Management

- Use Redux for global state (auth, user data)
- Use local state for component-specific data
- Persist only necessary data (auth tokens, user preferences)

### API Calls

- Use the configured axios instance from `api/axiosInstance.tsx`
- Define endpoints in `api/endpoints/`
- Handle errors consistently with try-catch and toast notifications
- Show loading states during API calls

## License

This project is licensed for academic purposes.

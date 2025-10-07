# Job Connect-DE (Frontend)

A bilingual open-source job platform built with Angular 18, TailwindCSS, and standalone components.

## Features

- **Bilingual Support**: English and German translations with ngx-translate
- **Modern UI**: Responsive design with TailwindCSS v3
- **Dark Mode**: Light/dark theme toggle with persistent storage
- **Authentication**: Login and registration flows with mock authentication
- **Job Listings**: Browse and filter jobs by location, category, and type
- **Company Profiles**: Explore companies and their open positions
- **Resume Management**: Upload, view, and manage resumes
- **Applications**: Track job applications with status badges
- **ATS Matching**: Candidate-job matching with AI insights and scoring
- **Admin Dashboard**: Manage jobs, companies, and resumes with statistics
- **Standalone Components**: Built with Angular 18+ standalone components

## Tech Stack

- **Framework**: Angular 18 with standalone components
- **Styling**: TailwindCSS v3
- **i18n**: ngx-translate for English/German support
- **Routing**: Angular Router
- **State Management**: Angular Signals
- **HTTP**: Angular HttpClient
- **Build Tool**: Angular CLI with esbuild

## Project Structure

```
src/app/
├── core/
│   └── services/          # Core services (auth, job, company, resume, matching, language)
├── shared/
│   └── components/        # Reusable components (cards, modals, file upload, toggles)
├── layout/
│   ├── navbar.component.ts
│   └── footer.component.ts
├── features/
│   ├── home/              # Home page with featured jobs and companies
│   ├── auth/              # Login and registration
│   ├── jobs/              # Job listings and detail pages
│   ├── companies/         # Company listings and profiles
│   ├── applications/      # User's job applications
│   ├── profile/           # User profile management
│   ├── resume-upload/     # Resume upload functionality
│   ├── resumes/           # Resume management
│   ├── candidate-matching/# ATS candidate-job matching
│   └── admin/             # Admin dashboard
└── assets/
    ├── i18n/              # Translation files (en.json, de.json)
    └── data/              # Mock data (jobs, companies, resumes, users, matches)
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

```bash
npm install
```

### Development Server

```bash
npm run start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Features Overview

### Authentication
- Mock login with email/password validation
- Registration with form validation
- Persistent user session in localStorage
- Protected routes for authenticated users

### Jobs
- Browse jobs with filtering (location, category, type)
- Detailed job pages with apply functionality
- Mock job data with realistic information

### Companies
- Company listings with card-based layout
- Company detail pages showing all open positions
- Company information and metadata

### Resume Management
- Drag-and-drop file upload
- Resume metadata (title, summary, skills)
- Resume listing with table view
- Delete and preview functionality

### Candidate Matching (ATS)
- Select job to view matching candidates
- AI-powered match scoring (mock)
- Visual progress bars for match scores
- Match factors and insights
- Candidate profile preview

### Applications
- Track submitted applications
- Status badges (Pending, Shortlisted, Rejected)
- Empty state with call-to-action

### Profile
- Edit user information
- Update bio and skills
- Persistent changes to localStorage

### Admin Dashboard
- Overview statistics (jobs, companies, resumes)
- Quick access to manage resources
- Visual cards for data display

## Internationalization

The application supports English and German languages. Switch between languages using the language toggle in the navbar.

Translation files are located in:
- `src/assets/i18n/en.json`
- `src/assets/i18n/de.json`

## Theming

The application supports light and dark modes with TailwindCSS dark mode classes. The theme preference is stored in localStorage and persists across sessions.

### Color Palette
- **Primary**: Blue shades (career/professional tone)
- **Accent**: Amber shades (call-to-action elements)
- **Neutrals**: Gray scale for backgrounds and text

## Mock Data

Mock data is stored in JSON files under `src/assets/data/`:
- `jobs.json`: Job listings
- `companies.json`: Company information
- `resumes.json`: Resume entries
- `users.json`: User accounts
- `matches.json`: Candidate matching results

## Future Enhancements

- Backend API integration (Spring Boot recommended)
- Real authentication with JWT tokens
- Database integration (PostgreSQL/MySQL)
- Real file uploads to cloud storage
- Advanced search and filtering
- Email notifications
- Real-time chat/messaging
- Company admin portal
- Payment integration for premium features

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Contact

For questions or support, please open an issue on GitHub.

---

Built with Angular 18 + TailwindCSS + standalone components

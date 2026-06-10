# CareerGrid - Job Listing Website

CareerGrid is a responsive job listing website created for the internship task requirement. It displays jobs as cards and lets users filter listings instantly by keyword, location, category, and experience level.

The project uses a clean component-wise JavaScript structure so the job data, card UI, filter logic, modal logic, and storage helper stay easy to understand.

## Features

- 24 sample job listings across software, AI, marketing, design, analytics, finance, HR, management, and non-IT roles.
- Responsive job cards with title, company, location, salary, category, work mode, and description.
- Keyword search for job title, company, and description.
- Filters for location, category, and experience level.
- Reset filters button.
- Pagination for large job lists.
- View More modal with detailed responsibilities.
- Save Job button using browser local storage.
- Dynamic summary for total jobs, remote jobs, saved jobs, current page, and category counts.
- Clean UI for desktop, tablet, and mobile screens.

## Technologies Used

- HTML5
- CSS3
- JavaScript ES Modules
- Sample JSON-style job data inside `js/data/jobs.js`

## How To Run

Because the JavaScript is split into ES modules, run the project through a local development server.

Open a terminal inside this folder:

```bash
python -m http.server 5500
```

Then visit:

```text
http://localhost:5500
```

## Project Structure

```text
job-listing-website/
  index.html
  css/
    styles.css
  js/
    app.js
    components/
      filters.js
      jobCard.js
      modal.js
    data/
      jobs.js
    utils/
      storage.js
  README.md
```

## Main Files

- `index.html` contains the page structure and connects the CSS and JavaScript modules.
- `css/styles.css` contains all responsive layout and UI styling.
- `js/data/jobs.js` contains the sample job listing data.
- `js/components/jobCard.js` renders job cards.
- `js/components/filters.js` handles filter utilities and filtering logic.
- `js/components/modal.js` controls the job detail modal.
- `js/utils/storage.js` handles saved jobs in local storage.
- `js/app.js` connects all modules and manages page state.

## Deployment

This project can be deployed on GitHub Pages, Netlify, or Vercel because it is a static website.

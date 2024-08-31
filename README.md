# Triathlon Results

This project displays triathlon race results fetched from an API, with additional features such as result sorting, error handling, and highlighting of fastest split times.

## Getting Started

To run this project locally, follow these steps:

1. Clone the repository:

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:

   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

- `src/components/ResultsTable.jsx`: Main component that fetches and displays the results.
- `src/App.jsx`: Root component that renders the ResultsTable.
- `src/main.jsx`: Entry point of the application.
- `src/index.css`: Global styles and Tailwind CSS imports.

## Features and Solutions

This project addresses the following requirements:

### Step 1: Improved Data Fetching

- Implemented error handling for API requests.
- Added a loading state to inform users when data is being fetched and processed.
- Displays an error message if the fetch operation fails.

### Step 2: Result Ordering

- Filters out results with unrealistic total times (e.g., "00:00:00" or "23:59:59").
- Sorts the remaining results based on total time, with the fastest time first.

### Step 3: Fastest Split Times Indication

- Calculates the fastest swim, bike, and run times among all valid results.
- Displays Award icons with text labels next to athletes who achieved the fastest split times.

### Open-ended portion

- Responsive design using Tailwind CSS for better viewing on various device sizes.
- Clear, easy-to-read table layout with alternating row colors for improved readability.
- Custom Alert component for error messages.
- Use of React hooks (useState, useEffect) for efficient state management and side effects.

## Technologies Used

- React.js
- Tailwind CSS
- Vite
- lucide-react (for icons)

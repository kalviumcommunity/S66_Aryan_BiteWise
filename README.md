# BiteWise - Diet Planning Website

BiteWise is a user-friendly diet planning website designed to help users create personalized meal plans and calculate daily calorie goals. The app features a modern interface. It includes limited AI integration to enhance user experience. The project prioritizes free and open-source tools to keep costs minimal while supporting diverse dietary needs, including Indian cuisine.

## Features
- **Homepage**: Displays a stack of diet cards (using Prism UI Display Cards) showing a daily meal plan. An AI button in the navbar opens a modal where users can input prompts (e.g., "I need a 1500-calorie vegetarian meal plan"), and the AI generates a new meal plan populated into the cards.
- **Settings Page**: Offers options to customize diet preferences, calorie goals, allergy alerts, meal schedules, and view a detailed diet plan.
- **AI Integration**:
  - **Homepage AI**: Uses `distilgpt2` (Hugging Face Transformers) to generate meal plans from user prompts, with nutritional data fetched from the USDA FoodData Central API and supplemented by the Indian Nutrient Databank (INDB) for Indian foods.
  - **Calorie Goals AI**: Uses a rule-based approach (Mifflin-St Jeor equation) to calculate daily calorie goals based on activity levels and diet preferences.
- **Navbar**: A bottom navigation bar (Serenity UI Tubelight Navbar) with a frosted glass effect, including an AI button to trigger the prompt modal.
- **Design**: Matches a Figma design with a gradient background (`#6B5B95` to `#D3D3D3`), frosted glass effects (`bg-white bg-opacity-20 backdrop-blur-lg`), and rounded components.

## Tech Stack
### Frontend
- **React + TypeScript**: For building the UI and ensuring type safety.
- **Tailwind CSS**: For styling, including the gradient background and frosted glass effects.
- **Prism UI**: Display Cards for the homepage diet cards.
- **Serenity UI**: Tubelight Navbar for the bottom navigation.
- **React Router**: For client-side routing.
- **Framer Motion**: For animations (e.g., hover effects on cards and navbar).
- **Axios**: For making API requests to the backend and USDA API.

### Backend
- **Node.js + Express**: For handling AI requests and database integration.
- **Hugging Face Transformers (`distilgpt2`)**: For generating meal plans from user prompts.
- **USDA FoodData Central API**: For fetching nutritional data (calories, macros) for meals.
- **Indian Nutrient Databank (INDB)**: As a fallback for Indian food data not covered by the USDA API.
- **TypeScript**: For type safety in the backend.


## Development Schedule (March 25, 2025 - April 25, 2025)
The following schedule outlines the development plan for BiteWise over a month, with weekly goals to ensure steady progress. Each week focuses on specific components, pages, or backend tasks, culminating in a functional app by April 25, 2025.

### Week 1: March 25 - March 31, 2025
- **Goal**: Set up the project structure, install dependencies, and build the homepage UI.
- **Tasks**:
  - Initialize the frontend and backend projects (already done in the file structure setup).
  - Install all dependencies (React, TypeScript, Tailwind CSS, Prism UI, Serenity UI, Node.js, `distilgpt2`).
  - Export icons and images from Figma and place them in `frontend/src/assets`.
  - Implement the `TubelightNavbar` component with the AI button.
  - Implement the `AIModal` component for user prompts.
  - Implement the `DietCard` component using Prism UI Display Cards.
  - Create the `Home` page, integrating the navbar, AI modal, and diet cards with mock data.
  - Test the homepage UI to ensure it matches the Figma design (gradient background, frosted glass effects, etc.).

### Week 2: April 1 - April 7, 2025
- **Goal**: Set up the backend and integrate AI for the homepage.
- **Tasks**:
  - Configure the backend to run `distilgpt2` for meal plan generation (`backend/src/models/aiModel.ts`).
  - Implement the USDA FoodData Central API client (`backend/src/utils/usdaApi.ts`).
  - Download the Indian Nutrient Databank (INDB) dataset and integrate it as a fallback for Indian foods.
  - Create the `/generate-meal-plan` endpoint to process user prompts and return a meal plan with nutritional data.
  - Update the `Home` page to call the backend API when the user submits a prompt in the AI modal.
  - Test the AI integration: input a prompt (e.g., "1500-calorie vegetarian meal plan"), ensure the backend generates a meal plan, fetches nutritional data, and updates the diet cards.

### Week 3: April 8 - April 14, 2025
- **Goal**: Build the Settings page and Calorie Goals page with AI integration.
- **Tasks**:
  - Implement the `SettingsCard` component for the settings options.
  - Create the `Settings` page with cards linking to sub-pages (Diet Preferences, Calorie Goals, etc.).
  - Implement the `DietPreferenceButton` and `CalorieSlider` components.
  - Create the `CalorieGoals` page with activity level buttons, a calorie slider, and a "Calculate with AI" button.
  - Implement the rule-based calorie calculation (Mifflin-St Jeor equation) in the `CalorieGoals` page.
  - Test the Calorie Goals page: select an activity level, click "Calculate with AI," and verify the slider updates with the calculated calorie goal.

### Week 4: April 15 - April 21, 2025
- **Goal**: Complete the remaining settings pages and polish the UI.
- **Tasks**:
  - Implement the `AllergyButton` component and create the `AllergyAlerts` page.
  - Implement the `MealScheduleItem` component and create the `MealSchedule` page.
  - Implement the `DietPlanItem` component and create the `DietPlan` page.
  - Create the `DietPreferences` page with buttons for diet types (Regular, Vegetarian, etc.).
  - Add navigation between pages using the `TubelightNavbar`.
  - Fine-tune the UI: adjust spacing, font sizes, and animations to match the Figma design exactly.
  - Test all pages on multiple devices (desktop, tablet, mobile) to ensure responsiveness.

### Final Days: April 22 - April 25, 2025
- **Goal**: Test, debug, and prepare for deployment.
- **Tasks**:
  - Test the entire app end-to-end: generate a meal plan on the homepage, calculate calorie goals, and navigate through all settings pages.
  - Debug any issues with AI integration, API calls, or UI rendering.
  - Optimize performance: cache USDA API responses in the backend to reduce latency.
  - Write basic unit tests for critical components (e.g., `TubelightNavbar`, `CalorieSlider`).
  - Deploy the app to a free hosting service (e.g., Vercel for the frontend, Render for the backend).
  - Document any known issues or future improvements in the README.

## Prerequisites
- **Node.js** (v16 or higher)
- **npm** (v7 or higher)
- **Python** (v3.8 or higher, for running `distilgpt2`)
- **USDA FoodData Central API Key**

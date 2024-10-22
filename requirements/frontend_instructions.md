Here is a frontend instruction file tailored for the “My Shelf” web app:

Project Overview

“My Shelf” is a web application designed for beauty enthusiasts to manage and review their product collections. Inspired by platforms like Letterboxd and Fragrantica, “My Shelf” allows users to catalog their beauty products, track their experiences, and share reviews. Users can create a personalized profile featuring their product shelves, wishlists, and custom collections.

Feature Requirements

The app will be built using Next.js, Shadcn, Lucid, Supabase for database, Clerk for authentication, and Stripe for payments.

Product Catalog Management

	•	Sephora Integration: Start with the Sephora product catalog as the initial data source, with plans to expand to a broader catalog in the future.
	•	Product Attributes: Each product will have detailed attributes, such as name, brand, category, description, and image.

Product Tracking

	•	Mark Product Status: Users can label products with the following statuses: “I have it,” “I want it,” or “I had it.”
	•	Rating and Review: Users can rate products from 1 to 5 stars and write detailed reviews.
	•	User Log/Diary: Every interaction (status change, rating, review) is saved in the user’s personal “diary” for tracking product usage and experiences.

User Profile Integration

	•	Customizable Profile: Users can create profiles that display their “Current Shelf” (products they own), “Tried Shelf” (products they’ve used in the past), and “Wishlist” (products they want).
	•	Custom Shelves: Allow users to create custom product lists (e.g., “Summer Favorites,” “Travel Essentials”).
	•	Diary View: Provide a log of all user interactions, including product ratings, reviews, and status changes.

Dashboard & User Interface

	•	Main Dashboard: Displays an overview of the user’s shelves, wishlist, and diary logs.
	•	Search & Filter: Enable users to search for products and filter results by attributes such as brand, category, or rating.
	•	Product Page: Each product page should display detailed information, reviews, and user interactions (who has it, who wants it, etc.).

Community Features (Future Plan)

	•	Follow Other Users: Allow users to follow others and view their shelves, reviews, and custom lists.
	•	Community Recommendations: Suggest products based on popular ratings and reviews within the community.
	•	Social Sharing: Enable users to share their custom shelves or product reviews on social media.

Relevant Tools & Libraries

	•	Next.js: For server-side rendering and routing.
	•	Shadcn & Lucid: For UI components and styling.
	•	Supabase: As the backend database for storing user data and product information.
	•	Clerk: For user authentication and profile management.
	•	Stripe (Future Plan): For any potential monetization features such as premium accounts.

Current File Structure

MY-SHELF
└── my-shelf
├── app
│   ├── components
│   ├── styles
│   ├── pages
│   │   ├── index.tsx
│   │   ├── profile.tsx
│   │   ├── product.tsx
│   │   └── wishlist.tsx
├── lib
├── node_modules
├── .eslintrc.json
├── .gitignore
├── components.json
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json

Rules

	•	All new components should be placed in /components and named like example-component.tsx.
	•	All new pages should be added to /pages and linked in the main navigation.
	•	Use TailwindCSS classes for styling components.
	•	Follow the project’s coding standards: keep functions modular, use TypeScript for type safety, and maintain a consistent code style.
	•	For new features, ensure they integrate seamlessly with Supabase for data management and Clerk for authentication.

This instruction file provides a starting point for organizing the development of “My Shelf” while allowing for future scalability.
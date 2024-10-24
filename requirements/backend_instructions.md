Here’s a backend instruction file tailored for “My Shelf” using the tech stack provided:

Project Overview

“My Shelf” is a beauty product tracking and review web app that allows users to manage their collections, rate products, write reviews, and track their experiences. The backend will be developed using Next.js, Supabase, and Clerk for authentication.

Tech Stack

	•	Next.js for server-side rendering and API routes
	•	Supabase for database and file storage
	•	Clerk for user authentication

The following tables will support the app’s core functionalities.

1. users

Tracks user information, authentication, and profile details.

column_name	data_type	description
id	uuid PRIMARY KEY	Unique identifier for each user
email	text	User email address
created_at	timestamp with time zone	Account creation date
updated_at	timestamp with time zone	Last profile update
name	text	User’s display name
avatar_url	text	URL to the user’s profile picture
clerk_id	text UNIQUE NOT NULL	Clerk ID for authentication
raw_app_meta_data	jsonb	Metadata related to the user’s app information
raw_user_meta_data	jsonb	Metadata related to the user’s profile
role	character varying	User role (e.g., ‘user’, ‘admin’)
is_super_admin	boolean	Indicates if the user is a super admin
phone	text	User’s phone number
last_sign_in_at	timestamp with time zone	Last login time
banned_until	timestamp with time zone	Ban expiration date if the user is banned
is_anonymous	boolean	Indicates if the user is anonymous
is_sso_user	boolean	Indicates if the user is a single sign-on (SSO) user
deleted_at	timestamp with time zone	Account deletion date

2. products

Tracks details of beauty products in the catalog.

column_name	data_type	description
id	uuid PRIMARY KEY	Unique identifier for each product
name	text	Product name
sku	text UNIQUE	Stock Keeping Unit identifier
in_stock	boolean	Availability status
regular_price	text	Regular product price
actual_price	jsonb	Current product price
unit_price	jsonb	Price per unit
value_price	text	Value-based pricing information
currency	text	Currency for the prices
brand	jsonb	Brand information
images	jsonb	Array of image URLs
videos	text	Video URL for the product
rating	jsonb	Average rating and rating breakdown
tags	text	Product tags
loyalty_points	bigint	Loyalty points available
delivery_options	text	Delivery options available
breadcrumbs	jsonb	Breadcrumb data for navigation
promotions_eligible	boolean	Eligible for promotions
variants	jsonb	Product variants
description	text	Product description
tips	text	Usage tips
more_information	text	Additional information
ingredients	text	Ingredients list
notes	text	Product notes
recommendation_products	jsonb	Recommended products
product_sku_name	text	SKU display name
status	character varying	Product status (e.g., ‘active’, ‘discontinued’)
popularity_score	integer	Popularity score based on user interactions
created_at	timestamp with time zone	Creation date
is_in_current_shelf	boolean	Indicates if the product is currently owned

3. user_products

Tracks user interactions with products (e.g., ownership status, ratings).

column_name	data_type	description
id	uuid PRIMARY KEY	Unique identifier
user_id	uuid REFERENCES users(id) ON DELETE CASCADE	Reference to the user
product_id	uuid REFERENCES products(id) ON DELETE CASCADE	Reference to the product
status	text CHECK (status IN (‘have’, ‘want’, ‘had’))	Ownership status
rating	integer CHECK (rating BETWEEN 1 AND 5)	User’s rating for the product
review	text	User’s review of the product
added_at	timestamp with time zone	Date the product was added to the user’s shelf
updated_at	timestamp with time zone	Last update date

4. shelves

Allows users to create custom shelves or lists of products.

column_name	data_type	description
id	uuid PRIMARY KEY	Unique identifier for each shelf
user_id	uuid REFERENCES users(id) ON DELETE CASCADE	Reference to the user
name	text	Shelf name
description	text	Description of the shelf
created_at	timestamp with time zone	Creation date
updated_at	timestamp with time zone	Last update date

5. shelf_products

Associates products with custom shelves.

column_name	data_type	description
id	uuid PRIMARY KEY	Unique identifier
shelf_id	uuid REFERENCES shelves(id) ON DELETE CASCADE	Reference to the shelf
product_id	uuid REFERENCES products(id) ON DELETE CASCADE	Reference to the product
added_at	timestamp with time zone	Date the product was added to the shelf

6. user_logs

Tracks user activities such as adding products, reviews, and ratings.

column_name	data_type	description
id	uuid PRIMARY KEY	Unique identifier
user_id	uuid REFERENCES users(id) ON DELETE CASCADE	Reference to the user
activity_type	text CHECK (activity_type IN (‘add’, ‘rate’, ‘review’, ‘update_status’))	Type of activity
product_id	uuid REFERENCES products(id)	Reference to the associated product
details	jsonb	Additional details about the activity
timestamp	timestamp with time zone	Date and time of the activity

7. reviews

Stores detailed product reviews and ratings.

column_name	data_type	description
id	uuid PRIMARY KEY	Unique identifier for each review
user_id	uuid REFERENCES users(id) ON DELETE CASCADE	Reference to the user
product_id	uuid REFERENCES products(id) ON DELETE CASCADE	Reference to the product
rating	integer CHECK (rating BETWEEN 1 AND 5)	User’s rating
review_text	text	Review content
created_at	timestamp with time zone	Review creation date
updated_at	timestamp with time zone	Last update date

Requirements

	1.	User Authentication and Profile Management
	•	Use Clerk for authentication and fetch user details.
	•	Implement user sign-up and sign-in endpoints.
	•	Create API routes for updating user profile information.
	2.	Product Catalog Management
	•	Implement endpoints to fetch product details, search products, and filter by attributes.
	•	Allow users to view product reviews, ratings, and availability.
	•	Integrate third-party sources like Sephora for initial product catalog.
	3.	User Product Interactions
	•	Implement endpoints to mark products as “have,” “want,” or “had.”
	•	Create routes to allow users to rate products and write reviews.
	•	Store these interactions in the user_products and user_logs tables.
	4.	Custom Shelves
	•	Develop endpoints for creating, updating, and deleting shelves.
	•	Allow users to add products to custom shelves.
	•	Implement a feature to filter and sort shelves by different criteria.
	5.	Review Management
	•	Create endpoints to add, edit, and delete product reviews.
	•	Allow users to view reviews by others.
	6.	User Activity Logs
	•	Track user activities such as adding products, changing ownership status, and writing reviews.
	•	Store these logs in the user_logs table.
	7.	Data Security and Privacy
	•	Use authentication and authorization checks for all API routes.
	•	Ensure secure storage and retrieval of sensitive user data.
	•	Implement policies for data deletion (e.g., account deletion).
	8.	Testing and Documentation
	•	Write unit tests for all API endpoints.
	•	Document all API routes with request/response examples.

API Documentation

Use a tool like Swagger or Postman to create detailed API documentation for all endpoints.

This guide establishes a robust backend foundation for “My Shelf,” supporting essential functionalities while allowing for future expansion.
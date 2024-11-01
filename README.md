# https://agnasa06.github.io/arnav.vending_machine.github.io/
The website for the vending machine

# Classroom Vending Machine

This project is a web-based vending machine that allows students to redeem points for snacks as a reward for positive behavior in the classroom. The application includes a login page and a store page where students can select items to purchase with their points.

## Project Purpose

The primary purpose of this project is to create an interactive reward system for students, encouraging good behavior by allowing them to exchange earned points for various snacks. The vending machine is intended to be simple to use, with a straightforward login process and an intuitive store interface.

## Features

### Implemented Features

1. **Login Page**
   - Students can log in using predefined credentials.
   - If the login fails, an error message is displayed.

2. **Store Page**
   - Displays a list of snacks that students can purchase.
   - Deducts points from the student's balance when an item is selected.
   - Displays the current points balance.
   - Responsive design ensures the page is usable on various devices.

### Planned Features

1. **Dynamic Points System**
   - Integrate a backend to allow dynamic points tracking and redemption.
   - Allow teachers to add or remove points based on student behavior.

2. **User Accounts**
   - Implement a registration system to allow students to create their own accounts.
   - Store user data, including points balance, in a database.

3. **Admin Panel**
   - Create an admin panel for teachers to manage points and view student activity.

## How to Run the Project

### Clone the Repository

git clone https://github.com/agnasa06/arnav.vending_machine.github.io.git
cd arnav.vending_machine.github.io

Install Dependencies:
Ensure you have Node.js installed. Run the following command to install dependencies:

npm install

Set Up Firebase:
Create a Firebase project and obtain your configuration settings.
Replace the placeholder in the firebaseConfig object in your code with your actual Firebase project settings.

Run the Development Server:
Use the following command to start the development server:

npm run dev

Open in Browser:
Navigate to http://localhost:5173 (or the specified port) to view the application in your browser.

Description of Core Features
User Authentication: Users can log in using Google Sign-In. After logging in, their points are fetched from Firestore.
Product Selection: Users can select snacks from the available products, and the total cost is calculated dynamically.
Purchase Functionality: Users can purchase selected snacks using their points, which are deducted from their available balance.
Real-Time Updates: Changes in user points and purchases are updated in real-time through Firestore.

## Technologies Used

- **HTML/CSS:** For structuring and styling the web pages.
- **JavaScript:** For handling login validation and points deduction functionality.



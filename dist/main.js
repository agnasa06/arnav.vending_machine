"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("firebase/app");
var auth_1 = require("firebase/auth");
// Your Firebase configuration object
var firebaseConfig = {
    apiKey: "AIzaSyCnOb76ITddk6PFhMAdCs5RgYFtS9DXq3Y",
    authDomain: "vending-machine2-3f5ce.firebaseapp.com",
    projectId: "vending-machine2-3f5ce",
    storageBucket: "vending-machine2-3f5ce.appspot.com",
    messagingSenderId: "257322753923",
    appId: "1:257322753923:web:58f04bcaa77452d151a0b6",
    measurementId: "G-PS5QTFZ8HJ"
};
// Initialize Firebase app and auth
var app = (0, app_1.initializeApp)(firebaseConfig);
var auth = (0, auth_1.getAuth)(app);
var button = document.getElementById('googleSignInBtn');
// Handle sign-in with Google
button === null || button === void 0 ? void 0 : button.addEventListener('click', function () {
    (0, auth_1.signInWithPopup)(auth, new auth_1.GoogleAuthProvider())
        .then(function (result) {
        console.log('User signed in:', result.user);
        window.location.href = "store.html"; // Redirect to store page on successful sign-in
    })
        .catch(function (error) {
        console.error('Error during sign-in:', error.message);
    });
});
// Listen for authentication state changes
(0, auth_1.onAuthStateChanged)(auth, function (user) {
    if (user) {
        console.log('User authenticated:', user);
    }
    else {
        console.log('User not authenticated');
    }
});
// Define the validate function and attach it to the global `window` object
function validate() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var errorMessage = document.getElementById('error-message');
    // Define correct credentials
    var correctUsername = "user123";
    var correctPassword = "password123";
    if (username === correctUsername && password === correctPassword) {
        window.location.href = "store.html"; // Redirect to another page
    }
    else if (errorMessage) {
        errorMessage.style.display = 'block';
    }
}
// Attach the validate function to the window object
window.validate = validate;

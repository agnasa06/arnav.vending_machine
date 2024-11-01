import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyCnOb76ITddk6PFhMAdCs5RgYFtS9DXq3Y",
  authDomain: "vending-machine2-3f5ce.firebaseapp.com",
  projectId: "vending-machine2-3f5ce",
  storageBucket: "vending-machine2-3f5ce.appspot.com",
  messagingSenderId: "257322753923",
  appId: "1:257322753923:web:58f04bcaa77452d151a0b6",
  measurementId: "G-PS5QTFZ8HJ"
};

// Initialize Firebase app and auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const button = document.getElementById('googleSignInBtn');

// Handle sign-in with Google
button?.addEventListener('click', () => {
  signInWithPopup(auth, new GoogleAuthProvider())
    .then((result) => {
      console.log('User signed in:', result.user);
      window.location.href = "store.html"; // Redirect to store page on successful sign-in
    })
    .catch((error) => {
      console.error('Error during sign-in:', error.message);
    });
});

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User authenticated:', user);
  } else {
    console.log('User not authenticated');
  }
});

// Define the validate function and attach it to the global `window` object
function validate() {
  const username = (document.getElementById('username') as HTMLInputElement).value;
  const password = (document.getElementById('password') as HTMLInputElement).value;
  const errorMessage = document.getElementById('error-message');

  // Define correct credentials
  const correctUsername = "user123";
  const correctPassword = "password123";

  if (username === correctUsername && password === correctPassword) {
    window.location.href = "store.html"; // Redirect to another page
  } else if (errorMessage) {
    errorMessage.style.display = 'block';
  }
}

// Attach the validate function to the window object
(window as any).validate = validate;


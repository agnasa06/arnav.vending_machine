import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, CollectionReference, query, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, getRedirectResult, User } from 'firebase/auth';

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

declare global {
  interface Window {
    addProductToList: (productName: string) => void;
  }
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const button = document.getElementById('loginBtn');

document.addEventListener('DOMContentLoaded', () => {
  const userPointsDisplay = document.getElementById('points');
  let currentUserId: string | null = null; // Variable to hold the current user ID
  const db = getFirestore();
  const ul = document.querySelector('ul');

  let availablePoints = 0; // Initialize available points

  // Handle the redirect result as soon as Firebase Auth is initialized
  // Step 2: Check redirect result
  getRedirectResult(auth)
    .then((result) => {
      if (result?.user) {
        console.log('User signed in through redirect:', result.user);
        handleUserLogin(result.user);
      } else {
        console.log('No redirect result available.');
        console.log(result);
      }
    })
    .catch((error) => {
      console.error('Error handling redirect:', error.message);
    });

  button?.addEventListener('click', clickEvent => {
    console.log('Sign-in button clicked');
    signInWithPopup(auth, new GoogleAuthProvider());
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('User authenticated:', user);
      handleUserLogin(user); // Handle logged-in user
    } else {
      console.log('User not authenticated');
      console.log(user);
    }
  });

  async function handleUserLogin(user: User) {
    const { uid, displayName, email } = user;

    currentUserId = uid; // Store user ID

    // Reference to the user's document in Firestore
    const userDocRef = doc(db, `users`, uid);

    // Check if the user document already exists
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      // User is new, so create a new document with initial points of 40
      await setDoc(userDocRef, {
        points: 0,
        name: displayName,
        email: email,
        createdAt: new Date(),
      });
      console.log('New user document created with 0 points');
      displayPoints(0); // Display initial points
    } else {
      const userData = userDocSnap.data();
      availablePoints = userData.points || 0; // Set availablePoints from Firestore
      console.log('User points retrieved:', availablePoints);
      displayPoints(availablePoints); // Update UI with user's points
    }

    const expensesCol = collection(db, `users/${uid}/expenses`);
    createStream(expensesCol);
  }

  // Function to display points on the UI
  function displayPoints(points: number) {
    console.log('Displaying points:', points); // Log points to be displayed
    if (userPointsDisplay) {
      userPointsDisplay.textContent = `${points}`;
    } else {
      console.error('userPointsDisplay element not found'); // Error if element is not found
    }
  }

  function createStream(ref: CollectionReference) {
    return onSnapshot(ref, snapshot => {
      const expenses = snapshot.docs.map(d => d.data()); // Get the data of each document

      //Sync with UI
      expenses.forEach(expense => {
        const li = document.createElement('li');
        li.textContent = `${expense.name} - ${expense.points}`;
        ul?.appendChild(li);
      })
    });
  }

  const productLookup: Record<string, { points: number; imageUrl: string }> = {
    "Oreos": {
      points: 50,
      imageUrl: "https://t4.ftcdn.net/jpg/02/91/93/89/360_F_291938984_ADWJyrtH6NHXcP3KAXi2MZL9SfG2nyan.jpg"
    },
    "Doritos": {
      points: 50,
      imageUrl: "https://thumbs.dreamstime.com/b/doritos-4418900.jpg"
    },
    "Chips Ahoy": {
      points: 50,
      imageUrl: "https://media.istockphoto.com/id/516417444/photo/chips-ahoy.jpg?s=612x612&w=0&k=20&c=nntJdg3jqLSUwZ0Tvbz0bWrWhCRa7TDFsM6nB8sGcUs="
    },
    "Cheetos": {
      points: 50,
      imageUrl: "https://media.istockphoto.com/id/175447215/photo/cheese-puff-snacks.jpg?s=612x612&w=0&k=20&c=qQYs4AkbFFewK90BDNJSXg3Ds9GP6WIqxYwsrSYcp88="
    },
    "Cheez It": {
      points: 50,
      imageUrl: "https://mediaproxy.snopes.com/width/1200/https://media.snopes.com/2022/09/GettyImages-104737046-cheez-its.jpg"
    },
    "Pringles": {
      points: 50,
      imageUrl: "https://m.media-amazon.com/images/I/81Hiy7KtgML.jpg"
    }
  };

  const snackImageDiv = document.getElementById('snack-image');
  const pointsDisplay = document.getElementById('points');
  const totalCostDisplay = document.getElementById('totalCost');
  const purchaseButton = document.getElementById('purchaseBtn');



  function addProductToList(productName: string) {
    const product = productLookup[productName];
    if (!product) return;

    // Create ul if it doesn't already exist
    let ul = document.querySelector('.snack-list') as HTMLUListElement;
    if (!ul) {
      ul = document.createElement('ul');
      ul.classList.add('snack-list');
      snackImageDiv?.appendChild(ul);
    }

    // Create li element with product details
    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${product.imageUrl}" alt="${productName}">
      <div class="snack-details">
        <strong>${productName}</strong>
        <small>${product.points} Points</small>
      </div>
      <button class="delete-btn">X</button>
    `;

    // Add event listener for the delete button
    li.querySelector('.delete-btn')?.addEventListener('click', () => {
      ul.removeChild(li);
      calculateTotalCost();
    });

    ul.appendChild(li);
    calculateTotalCost();
  }

  window.addProductToList = addProductToList;

  function calculateTotalCost() {
    const listItems = document.querySelectorAll('.snack-list li');
    let totalCost = 0;

    listItems.forEach(item => {
      const pointsTextElement = item.querySelector('.snack-details small') as HTMLElement | null;
      if (pointsTextElement && pointsTextElement.textContent) {
        const pointsText = (item.querySelector('.snack-details small') as HTMLElement).textContent;
        const points = parseInt(pointsText.replace(' Points', ''));
        totalCost += points;
      }
    });



    totalCostDisplay!.textContent = totalCost.toString();
  }

  async function deductPoints(userId: string, pointsToDeduct: number) {
    const db = getFirestore();
    const userRef = doc(db, 'users', userId); // Reference to the user's document

    // Get the current points of the user
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const currentPoints = userDoc.data()?.points || 0;

      // Check if the user has enough points
      if (currentPoints >= pointsToDeduct) {
        const newPoints = currentPoints - pointsToDeduct;

        // Update the points in the database
        await updateDoc(userRef, { points: newPoints });
        console.log(`Deducted ${pointsToDeduct} points. New balance: ${newPoints}`);
        return newPoints; // Return new points for UI update
      } else {
        console.error('Insufficient points for this transaction.');
        return null; // Not enough points
      }
    } else {
      console.error('User does not exist.');
      return null; // User not found
    }
  }

  function purchaseItems() {
    const totalCost = parseInt(totalCostDisplay!.textContent || '0');
    if (totalCost > availablePoints) {
      purchaseButton!.textContent = "Not enough points!";
      setTimeout(() => (purchaseButton!.textContent = "Purchase"), 1000);
    } else if (totalCost === 0) {
      purchaseButton!.textContent = "No items selected!";
      setTimeout(() => (purchaseButton!.textContent = "Purchase"), 1000);
    } else {
      // Here we call the Firestore function to deduct points
      deductPoints(currentUserId!, totalCost).then(newAvailablePoints => {
        if (newAvailablePoints !== null) {
          availablePoints = newAvailablePoints; // Update available points in the UI
          pointsDisplay!.textContent = availablePoints.toString();
          purchaseButton!.textContent = "Success!";
          setTimeout(() => (purchaseButton!.textContent = "Purchase"), 1000);

          // Clear the list and reset the total cost
          document.querySelector('.snack-list')!.innerHTML = "";
          totalCostDisplay!.textContent = "0";
        } else {
          purchaseButton!.textContent = "Transaction failed!";
          setTimeout(() => (purchaseButton!.textContent = "Purchase"), 1000);
        }
      });
    }
  }

  purchaseButton?.addEventListener('click', purchaseItems);
});

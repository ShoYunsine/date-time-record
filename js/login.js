import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    setPersistence,
    browserSessionPersistence,
    inMemoryPersistence
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js";
import {
    getFirestore,
    doc,
    setDoc,
    getDoc, 
    collection,
    query,
    where,
    getDocs,
    setDoc as setSubDoc,
    deleteDoc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD2njL-ut8J-eEtp-1Pr6XzF8uEccBEngc",
    authDomain: "date-time-record.firebaseapp.com",
    projectId: "date-time-record",
    storageBucket: "date-time-record.appspot.com",
    messagingSenderId: "624915234552",
    appId: "1:624915234552:web:fd98814a56a2d434ce450d",
    measurementId: "G-EV3TFLDQ7E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth(app);
const db = getFirestore(app);
let currentUser;

setPersistence(auth, browserSessionPersistence)
    .then(() => {
        // In memory persistence will be applied to the signed in Google user
        // even though the persistence was set to 'none' and a page redirect
        // occurred.
        return signInWithEmailAndPassword(auth, email, password), signInWithPopup(auth, provider);

    })
    .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
    });

onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = auth.currentUser;
        const userDocRef = doc(db, 'users', user.uid);
        let data;
        await getDoc(userDocRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    data = docSnap.data();
                    console.log('Document data:', data);
                } else {
                    console.log('No such document!');
                }
            })
            .catch((error) => {
                console.error('Error getting document:', error);
            });
        await setDoc(userDocRef, {
            displayName: user.displayName || 'None',
            email: user.email,
            uid: user.uid,
            school: data.school || 'None'
        }, { merge: true })
            .then(() => {
                console.log('Profile updated successfully');
            })
            .catch((error) => {
                console.error('Error updating profile:', error);
            }); await setDoc(userDocRef, {
                displayName: user.displayName || 'None',
                email: user.email,
                uid: user.uid,
                school: data.school || 'None'
            }, { merge: true })
                .then(() => {
                    console.log('Profile updated successfully');
                })
                .catch((error) => {
                    console.error('Error updating profile:', error);
                });
        signUpcontainer.style.display = "none";
        logincontainer.style.display = "none";
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        signOutButton.style.display = "block";
        loginButton.style.display = "none";
        dashboard.style.display = "block";
        if (typeof on_dash != 'undefined') {
            signOutButton.style.display = "none";
            loginButton.style.display = "none";
            dashboard.style.display = "none";
            const name = document.getElementById("name")
            const email = document.getElementById("email")
            name.innerHTML = user.displayName;
            email.innerHTML = user.email;
            const schoolslct = document.getElementById("school-select");
            const school = data.school || 'None';  // Default value if 'school' is not set
            const schooltxt = document.getElementById("school");
            schooltxt.innerHTML = school;
            schoolslct.addEventListener('change', (e) => {
                selectedschool = schoolslct.value;
                setDoc(userDocRef, { school: selectedschool }, { merge: true })
                    .then(() => {
                        console.log('Profile updated successfully');
                    })
                    .catch((error) => {
                        console.error('Error updating profile:', error);
                    });
            });
            const userId = user.uid
            generateQRCode(userId);

            function downloadQRCode() {
                const canvas = document.getElementById('qrcode');
                if (canvas) {
                    const link = document.createElement('a');
                    link.href = canvas.toDataURL('image/png');
                    link.download = 'qrcode.png';
                    link.click();
                } else {
                    console.error('QR code canvas not found.');
                }
            }

            // Event listener for the download button
            document.getElementById('downloadQRCode').addEventListener('click', downloadQRCode);
        }
        if (typeof on_classes != 'undefined') {
            console.log("On Classes")
            displayUserClasses();
        }
        accountName.innerHTML = user.displayName;
        accountImg.src = user.photoURL;
        accountEmail.innerHTML = user.email;
        try {
            const { averageColor, secondColor } = await getAverageAndSecondColor(user.photoURL);
            const color = `rgb(${averageColor.r}, ${averageColor.g}, ${averageColor.b})`;
            const color2 = `rgb(${secondColor.r}, ${secondColor.g}, ${secondColor.b})`;
            bg.style.backgroundImage = `linear-gradient(45deg, ${color2}, ${color})`;
            accountDetails.style.backgroundImage = `linear-gradient(${color}, ${color2})`;
        } catch (error) {
            console.error(error);
            const { averageColor, secondColor } = await getAverageAndSecondColor("Images/gear.png");
            const color = `rgb(${averageColor.r}, ${averageColor.g}, ${averageColor.b})`;
            const color2 = `rgb(${secondColor.r}, ${secondColor.g}, ${secondColor.b})`;
            bg.style.backgroundImage = `linear-gradient(45deg, ${color2}, ${color})`;
            accountDetails.style.backgroundImage = `linear-gradient(${color}, ${color2})`;
            accountImg.src = "Images/gear.png";
        }
        // ...
    } else {
        dashboard.style.display = "none";
        signUpcontainer.style.display = "block";
        loginButton.style.display = "block";
        signOutButton.style.display = "none";
        accountName.innerHTML = "Not currently logged in";
        accountImg.src = "Images/gear.png";
        if (typeof on_dash != 'undefined') {
            dashboard.style.display = "none";
            signUpcontainer.style.display = "none";
            loginButton.style.display = "none";
            signOutButton.style.display = "none";
        }
        try {

            const { averageColor, secondColor } = await getAverageAndSecondColor("Images/gear.png");
            const color = `rgb(${averageColor.r}, ${averageColor.g}, ${averageColor.b})`;
            const color2 = `rgb(${secondColor.r}, ${secondColor.g}, ${secondColor.b})`;
            bg.style.backgroundImage = `linear-gradient(45deg, ${color2}, ${color})`;
            accountDetails.style.backgroundImage = `linear-gradient(${color}, ${color2})`;
        } catch (error) {
            console.error(error);
        }
        accountEmail.innerHTML = "·";
        // User is signed out
        // ...
    }
});

const warning = document.getElementById("warning");
const warningtxt = document.getElementById("warningtxt");
const accountName = document.getElementById("accountName");
const accountImg = document.getElementById("accountImg");
const accountEmail = document.getElementById("accountEmail");
const accountDetails = document.getElementById("accountDetails");
const logincontainer = document.getElementById("logincontainer");
const signUpcontainer = document.getElementById("signUpcontainer");
const signOutButton = document.getElementById("signOutButton");
const loginButton = document.getElementById("loginButton");
const bg = document.getElementById("bg");
const dashboard = document.getElementById("dashboard");

function checkpasswordlength(password) {
    if (password.length >= 8) {
        return true
    }
}
// Sign Up with email and password
document.getElementById('submitsignUp').addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
    const confirmpassword = document.getElementById('signUpPasswordConfirm').value;
    if (checkpasswordlength(password) == true) {
        if (confirmpassword == password) {
            warning.style.display = "none";
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed up 
                    const user = userCredential.user;

                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // ..
                });
        } else {
            warning.style.display = "flex";
            warningtxt.innerHTML = "Passwords do not match"
        }
    } else {
        warning.style.display = "flex";
        warningtxt.innerHTML = "Password need to be 8 characters long"
    }

});

document.getElementById('loginsubmit').addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
});
// Sign in with Google
document.getElementById('signUpWithGoogle').addEventListener('click', (e) => {
    e.preventDefault();
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            // ...
            signUpcontainer.style.display = "none";
            logincontainer.style.display = "none";
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
});

document.getElementById('loginWithGoogle').addEventListener('click', (e) => {
    e.preventDefault();
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            // ...
            signUpcontainer.style.display = "none";
            logincontainer.style.display = "none";
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
});

document.getElementById('account').addEventListener('click', () => {
    accountDetails.classList.toggle("show"); // Toggle the 'show' class
    signUpcontainer.style.display = "none";
    logincontainer.style.display = "none";
})

document.getElementById('loginButton').addEventListener('click', () => {
    accountDetails.classList.toggle("show");
    logincontainer.style.display = "block";
    signUpcontainer.style.display = "none";
})

signOutButton.addEventListener('click', () => {
    accountDetails.classList.toggle("show");
    signUpcontainer.style.display = "none";
    logincontainer.style.display = "none";
    loginButton.style.display = "block";
    signOutButton.style.display = "none";
    signOut(auth).then(() => {
        // Sign-out successful.
    }).catch((error) => {
        // An error happened.
    });
})

document.getElementById('signUpButton').addEventListener('click', () => {
    signUpcontainer.style.display = "block";
    logincontainer.style.display = "none";
})

document.getElementById('loginButton2').addEventListener('click', () => {
    logincontainer.style.display = "block";
    signUpcontainer.style.display = "none";
})

export async function fetchProfile(userid) {
    const userDocRef = doc(db, 'users', userid);
    try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
            const user = docSnap.data();
            console.log('Fetched profile:', user);
            return user;
        } else {
            console.log('No profile found for user ID:', userid);
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
}

export function getAverageAndSecondColor(imageUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = imageUrl;

        img.onload = function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0, img.width, img.height);

            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            const data = imageData.data;

            let colorMap = new Map();
            for (let i = 0; i < data.length; i += 4) {
                const rgb = `${data[i]},${data[i + 1]},${data[i + 2]}`;
                if (colorMap.has(rgb)) {
                    colorMap.set(rgb, colorMap.get(rgb) + 1);
                } else {
                    colorMap.set(rgb, 1);
                }
            }

            // Sort colors by frequency
            const sortedColors = [...colorMap.entries()].sort((a, b) => b[1] - a[1]);

            // Find second most common color that is not black or white
            let secondColorRgb = [255, 255, 255]; // Default to white
            for (let i = 1; i < sortedColors.length; i++) {
                const rgb = sortedColors[i][0].split(',').map(Number);
                if (!isBlackOrWhite(rgb)) {
                    secondColorRgb = rgb;
                    break;
                }
            }

            const averageColor = {
                r: Math.floor(data.reduce((acc, val, idx) => idx % 4 === 0 ? acc + val : acc, 0) / (data.length / 4)),
                g: Math.floor(data.reduce((acc, val, idx) => idx % 4 === 1 ? acc + val : acc, 0) / (data.length / 4)),
                b: Math.floor(data.reduce((acc, val, idx) => idx % 4 === 2 ? acc + val : acc, 0) / (data.length / 4))
            };

            resolve({ averageColor, secondColor: { r: secondColorRgb[0], g: secondColorRgb[1], b: secondColorRgb[2] } });
        };

        img.onerror = function () {
            reject('Failed to load image');
        };
    });
}

function isBlackOrWhite(rgb) {
    const threshold = 30; // Adjust as needed
    return rgb.every(val => val < threshold) || rgb.every(val => val > 255 - threshold);
}

function generateQRCode(userId, callback) {
    // Load the QRCode library dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js';
    script.onload = () => {
        QRCode.toCanvas(document.getElementById('qrcode'), userId, function (error) {
            if (error) {
                console.error('Error generating QR code:', error);
            } else {
                addLogoToQRCode();
                console.log('QR code successfully generated!');
            }
            if (callback) callback();
        });
    };
    document.head.appendChild(script);
}

function addLogoToQRCode() {
    const canvas = document.getElementById('qrcode');
    const ctx = canvas.getContext('2d');
    const logo = new Image();

    logo.src = 'Images/logo.png';  // Replace with the path to your logo

    logo.onload = function () {
        const logoSize = 50;  // Size of the logo
        const x = (canvas.width / 2) - (logoSize / 2);
        const y = (canvas.height / 2) - (logoSize / 2);

        ctx.drawImage(logo, x, y, logoSize, logoSize);
    };
}

async function checkIfSyntaxExists(syntax) {
    // Reference to the document with ID equal to the syntax
    const docRef = doc(db, 'classes', syntax);
    try {
        // Fetch the document snapshot
        const docSnap = await getDoc(docRef);
        // Return true if the document exists, false otherwise
        return docSnap.exists();
    } catch (error) {
        console.error("Error checking document existence:", error);
        // Return false in case of error
        return false;
    }
}

export async function generateUniqueSyntax() {
    let syntax;
    let exists = true;

    while (exists) {
        // Generate a new syntax
        syntax = generateRandomSyntax();
        // Check if the syntax already exists
        exists = await checkIfSyntaxExists(syntax);
        console.log(`Generated syntax: ${syntax}, Exists: ${exists}`);
    }

    // Return the unique syntax
    return syntax;
}

function generateRandomSyntax() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';

    // Generate a random 16-character string with hyphens
    for (let i = 0; i < 16; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
        if (i % 4 === 3 && i < 15) {
            result += '-';
        }
    }

    return result;
}

export async function addClass(className, schoolName, syntax, classcode) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        console.error('No user is authenticated.');
        return;
    }

    try {
        // Reference to the new class document
        const classRef = doc(db, 'classes', syntax);

        // Set the class document with initial data
        await setDoc(classRef, {
            name: className,
            school: schoolName,
            syntax: syntax,
            code: classcode
        });

        // Reference to the members subcollection
        const membersRef = collection(classRef, 'members');

        // Set the user as an admin in the members subcollection
        await setDoc(doc(membersRef, user.uid), {
            role: 'admin',
        });

        const userClassesRef = collection(db, 'users', user.uid, 'classes');

        // Add the class syntax to the user's classes subcollection
        await setDoc(doc(userClassesRef, syntax), {
            syntax: syntax
            
        });
        window.location.href = `class.html?syntax=${syntax}`;
        console.log("Class added successfully with admin:", user.uid);
    } catch (error) {
        console.error("Error adding class:", error);
    }
}

async function deleteCollection(collectionPath) {
    const collectionRef = collection(db, collectionPath);
    const querySnapshot = await getDocs(collectionRef);

    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
}

export async function removeClass(syntax) {
    const auth = getAuth();
    const user = auth.currentUser;
    // Reference to the specific class document in the 'classes' collection
    const classDocRef = doc(db, 'classes', syntax);
    const subcollectionNames = ['members'];
    const members = await fetchMembers(syntax);
    for (const member of members) {
        try {
            const userRef = doc(db, 'users', member.id, 'classes', syntax);
            try {
                // Check if the class exists before trying to delete
                const docSnap = await getDoc(userRef);
                if (docSnap.exists()) {
                    console.log("Document path:", userRef.path);
                    await deleteDoc(userRef);
                    console.log("Class removed from Firestore:", syntax);
                } else {
                    console.error("Class not found in Firestore:", syntax);
                }
            } catch (error) {
                console.error("Error deleting document from Firestore:", error);
            }
        } catch (error) {
            console.error(`Failed to fetch profile for member with ID ${member.id}:`, error);
        }
    }
    // Delete each subcollection
    for (const subcollection of subcollectionNames) {
        const subcollectionPath = `classes/${syntax}/${subcollection}`;
        await deleteCollection(subcollectionPath);
    }
    try {
        // Delete the document
        await deleteDoc(classDocRef);
        console.log("Class removed successfully:", syntax);
    } catch (error) {
        console.error("Error removing class:", error);
    }
}

export async function kickfromClass(syntax, id) {
    const classRef = doc(db, 'classes', syntax);
    const memberRef = doc(db, 'users', id, 'classes', syntax);
    const memberClassRef = doc(classRef, 'members', id); // Corrected line
    try {
        const docSnap = await getDoc(memberRef);
        if (docSnap.exists()) {
            console.log("Document path:", memberRef.path);
            await deleteDoc(memberRef);
            console.log("User removed from class:", syntax);
        } else {
            console.error("User not found in class:", syntax);
        }
    } catch (error) {
        console.error("Error deleting user from class:", error);
    }
    try {
        const docSnap = await getDoc(memberClassRef);
        if (docSnap.exists()) {
            console.log("Document path:", memberClassRef.path);
            await deleteDoc(memberClassRef);
            console.log("User removed from class:", syntax);
        } else {
            console.error("User not found in class:", syntax);
        }
    } catch (error) {
        console.error("Error deleting user from class:", error);
    }
};

export async function leaveClass(syntax) {
    const auth = getAuth();
    const user = auth.currentUser;
    const userRef = doc(db, 'users', user.uid, 'classes', syntax);
    try {
        // Check if the class exists before trying to delete
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            console.log("Document path:", userRef.path);
            await deleteDoc(userRef);
            console.log("Class removed from Firestore:", syntax);
        } else {
            console.error("Class not found in Firestore:", syntax);
        }
    } catch (error) {
        console.error("Error deleting document from Firestore:", error);
    }
    const classRef = doc(db, 'classes', syntax);
    const memberRef = doc(classRef, 'members', user.uid);
    try {
        // Check if the class exists before trying to delete
        const docSnap = await getDoc(memberRef);
        if (docSnap.exists()) {
            console.log("Document path:", userRef.path);
            await deleteDoc(memberRef);
            console.log("Class removed from Firestore:", syntax);
        } else {
            console.error("Class not found in Firestore:", syntax);
        }
    } catch (error) {
        console.error("Error deleting document from Firestore:", error);
    }

}

async function getUserClasses() {
    const user = auth.currentUser;

    if (!user) {
        console.error('No user is currently signed in.');
        return [];
    }

    try {
        // Reference to the user's classes subcollection
        const userClassesRef = collection(db, 'users', user.uid, 'classes');
        const userClassesSnapshot = await getDocs(userClassesRef);

        const classList = [];
        for (const docu of userClassesSnapshot.docs) {
            const classSyntax = docu.id;

            // Get class details
            const classRef = doc(db, 'classes', classSyntax);
            const classDoc = await getDoc(classRef);

            if (classDoc.exists()) {
                classList.push({
                    id: classSyntax,
                    ...classDoc.data()
                });
            }
        }

        return classList;
    } catch (error) {
        console.error('Error fetching user classes:', error);
        return [];
    }
}

export async function displayUserClasses() {
    const user = auth.currentUser;
    const userClasses = await getUserClasses();
    const classListElement = document.getElementById('classList');

    if (!classListElement) {
        console.error('Element with ID "classList" not found.');
        return;
    }

    classListElement.innerHTML = ''; // Clear existing content

    // Add each class to the list
    for (const classItem of userClasses) {
        try {
            const currentmember = await fetchMember(classItem.syntax, user.uid);

            const listItem = document.createElement('li');
            listItem.classList.add('list-item');
            listItem.innerHTML = `
                <div>
                    <h3>${classItem.name}</h3> <!-- Use classItem.name -->
                    <p>School: ${classItem.school}</p> <!-- Use classItem.school -->
                    <p id="uid">${classItem.id}</p> <!-- Use classItem.id -->
                </div>
                ${currentmember.role === 'admin' ? '<button class="remove-btn">Remove</button>' : ''}
                ${currentmember.role === 'student' ? '<button class="leave-btn">Leave</button>' : ''}
            `;
            classListElement.appendChild(listItem);
        } catch (error) {
            console.error(`Error fetching member data for class ${classItem.syntax}:`, error);
        }
    }
}

export async function generateClassCode(syntax) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code;
    let isUnique = false;

    while (!isUnique) {
        // Generate a random 5-character code
        code = '';
        for (let i = 0; i < 5; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        // Check if the code is unique
        isUnique = await checkIfClassCodeUnique(code);
    }

    return code;
}

// Function to check if the class code is unique
async function checkIfClassCodeUnique(code) {
    const classesRef = collection(db, 'classes');
    const q = query(classesRef, where('code', '==', code)); // Replace 'code' with the field name used for class codes

    try {
        const querySnapshot = await getDocs(q);
        // If any document is returned, the code is not unique
        return querySnapshot.empty;
    } catch (error) {
        console.error("Error checking class code uniqueness:", error);
        return false;
    }
}

export async function fetchClass(syntax) {
    // Correctly create a reference to the class document
    const classRef = doc(db, 'classes', syntax);
    try {
        const docSnap = await getDoc(classRef);
        if (docSnap.exists()) {
            const classdata = docSnap.data();
            console.log('Fetched classdata:', classdata);
            return classdata; // Return the class data
        } else {
            console.log('No class found for syntax:', syntax);
            return null; // Return null if no document is found
        }
    } catch (error) {
        console.error('Error fetching class:', error);
        return null; // Return null if there's an error
    }
}

export async function fetchMembers(syntax) {
    const classRef = doc(db, 'classes', syntax);
    const membersRef = collection(classRef, 'members');

    try {
        const querySnapshot = await getDocs(membersRef);
        const members = [];
        querySnapshot.forEach((doc) => {
            members.push({ id: doc.id, ...doc.data() });
        });

        // Sort members by role, admins first
        members.sort((a, b) => {
            if (a.role === 'admin' && b.role !== 'admin') return -1;
            if (a.role !== 'admin' && b.role === 'admin') return 1;
            return 0;
        });

        console.log('Fetched members:', members);
        return members;
    } catch (error) {
        console.error('Error fetching members:', error);
        return [];
    }
}

export async function fetchMember(syntax, id) {
    const classRef = doc(db, 'classes', syntax);
    const memberRef = doc(classRef, 'members', id); // Corrected line

    try {
        const docSnap = await getDoc(memberRef);
        if (docSnap.exists()) {
            const memberData = docSnap.data();
            console.log('Fetched member data:', memberData);
            return memberData; // Return the member data
        } else {
            console.log('No member found for syntax:', syntax);
            return null; // Return null if no document is found
        }
    } catch (error) {
        console.error('Error fetching member:', error);
        return null; // Return null if there's an error
    }
}

export async function getCurrentUser() {
    const user = auth.currentUser;
    return user;
}

async function findClassByCode(classCode) {
    const classesRef = collection(db, 'classes');
    const q = query(classesRef, where('code', '==', classCode));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null; // No class found with the given code
    }

    return querySnapshot.docs[0].data(); // Return the first matching class
}

export async function joinClassByCode(classCode) {
    const user = auth.currentUser;
    try {
        const classData = await findClassByCode(classCode);

        if (!classData) {
            alert('Class code is invalid.');
            return;
        }

        const syntax = classData.syntax; // Assuming class ID is stored in classData
        const classRef = doc(db, 'classes', syntax)
        // Add user to class members
        const userClassesRef = collection(db, 'users', user.uid, 'classes');
        const memberDocRef = collection(classRef, 'members');

        // Adds class to members classes
        await setDoc(doc(userClassesRef, syntax), {
            syntax: syntax
        });
        window.location.href = `class.html?syntax=${syntax}`;
        // Optionally, update the list of member IDs in the class document
        await setDoc(doc(memberDocRef, user.uid), {
            role: 'student',
        });

    } catch (error) {
        console.error('Error joining class:', error);
    }
    
}

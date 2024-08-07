import 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js';
import { fetchProfile, generateUniqueSyntax, addClass, removeClass, generateClassCode, joinClassByCode, leaveClass } from './login.js';

const video = document.getElementById('camera');
const canvas = document.createElement('canvas');
const canvasContext = canvas.getContext('2d');

function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(stream => {
            video.srcObject = stream;
            video.setAttribute('playsinline', true);
            video.play();
            requestAnimationFrame(scanQRCode);
        })
        .catch(err => {
            console.error('Error accessing camera:', err);
        });
}

function scanQRCode() {
    if (video.videoWidth > 0 && video.videoHeight > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code) {
            const userid = code.data
            const user = fetchProfile(userid)
        } else {
        }
    }
    requestAnimationFrame(scanQRCode);
}

document.getElementById('toggleScanner').addEventListener('click', function () {
    const scannerContainer = document.getElementById('qrscanner-container');
    if (scannerContainer.style.display === 'none') {
        scannerContainer.style.display = 'block';
        this.textContent = 'Hide QR Scanner';
    } else {
        scannerContainer.style.display = 'none';
        this.textContent = 'Show QR Scanner';
    }
});

document.getElementById('classjoinForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    var classCode = document.getElementById('classCode').value;
    await joinClassByCode(classCode);
});

document.getElementById('classaddForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    var className = document.getElementById('className').value;
    var school = document.getElementById('school-name').value;

    if (className.trim() === '' || school === '') {
        alert('Please enter a class name and select a school.');
        return;
    }

    try {
        // Generate a unique syntax
        const uid = await generateUniqueSyntax();
        const classcode = await generateClassCode();
        var classList = document.getElementById('classList');
        var listItem = document.createElement('li');

        classList.appendChild(listItem);
        await addClass(className, school, uid, classcode);
        // Clear the input field and reset dropdown
        document.getElementById('className').value = '';
        document.getElementById('school-name').selectedIndex = 0;
        listItem.classList.add('list-item');
        listItem.innerHTML = `
            <div>
                <h3>${className}</h3>
                <p>School: ${school}</p>
                <p id="uid">${uid}</p>
            </div>
            <button class="remove-btn">Remove</button>
        `;
    } catch (error) {
        console.error('Error generating unique syntax:', error);
    }
});

document.getElementById('classList').addEventListener('click', async function (event) {
    if (event.target.classList.contains('remove-btn')) {
        // Get the list item that contains the remove button
        var listItem = event.target.closest('li');

        // Get the unique syntax from the list item
        var syntax = listItem.querySelector('#uid').textContent;

        // Remove the class from Firestore
        try {
            await removeClass(syntax);
            console.log("Class removed successfully:", syntax);
        } catch (error) {
            console.error("Error removing class:", error);
        }

        // Remove the item from the DOM
        listItem.remove();
    } else {
        if (event.target.classList.contains('leave-btn')) {
            // Get the list item that contains the remove button
            var listItem = event.target.closest('li');

            // Get the unique syntax from the list item
            var syntax = listItem.querySelector('#uid').textContent;

            // Remove the class from Firestore
            try {
                await leaveClass(syntax);
                console.log("Class removed successfully:", syntax);
            } catch (error) {
                console.error("Error removing class:", error);
            }

            // Remove the item from the DOM
            listItem.remove();
        } else {
            // Get the list item that was clicked
            var listItem = event.target.closest('li');

            // Get the unique syntax from the list item
            var syntax = listItem.querySelector('#uid').textContent;

            // Redirect to the new webpage with the syntax as a query parameter
            window.location.href = `class.html?syntax=${syntax}`;
        }
    }
});



const canvas = document.querySelector('.mm-canvas');
const nodeSelect = document.querySelector('.node-select');

const apiKey = '46834432-8a53092628e33a278a1baf5c7';

// when any part of the canvas is clicked, we will determing
// the position of the click and add the node to that location
canvas.addEventListener('click', (event) => {
    if (event.target === canvas) {
        const { x, y } = getClickPosition(event);
        const node = createNode(x, y, nodeSelect.value);
        canvas.appendChild(node);
    }
});

// function for handling image search
// uses pixabay API and gets the first 20 images
async function searchForImage(query) {
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&per_page=20`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.hits;
    } catch (e) {
        console.error("Error fetching image: ", e);
        return [];
    }
}

// get the position of where the user is clicking currenty.
// This is used to determing where the node is placed
function getClickPosition(event) {
    // my best attempt at getting the node to appear dead center of the click
    return {
        x: event.clientX - 100,
        y: event.clientY - 50,
    };
}

// creates a node on the mind map
// NOTE: The node itself looks a little clunky. needs some work still
function createNode(x, y, nodeType) {
    const node = document.createElement('div');
    const nodeInput = document.createElement('input'); // text input where users can identify the node
    const removeNodeBtn = document.createElement('button'); // button to remove the node

    node.className = 'node rounded-full p-4 absolute flex flex-col items-center text-center';
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
    node.innerText = nodeType; // set the text to one of the three node types

    nodeInput.className = 'border-2 border-black rounded-lg text-center'

    removeNodeBtn.className = 'bg-red-500 px-2 text-white';
    removeNodeBtn.innerText = "remove";
    removeNodeBtn.addEventListener('click', () => canvas.removeChild(node)); // remove the node when the button is clicked

    setNodeBorder(node, nodeType); // set color of the node based on type
    node.appendChild(nodeInput);
    node.appendChild(removeNodeBtn);

    // if the node is an 'asset node' the user can add an image to that node
    if (nodeType === 'asset') {
        const imgBtn = document.createElement('button');
        imgBtn.innerText = 'add image';
        // method for handling image adding
        imgBtn.addEventListener('click', async () => {
            const query = prompt('Enter your search query:');
            if (query) {
                const images = await searchForImage(query);
                if (images.length > 0) {
                    const popup = createImagePopup(images, node); // show the image selection popup
                    canvas.appendChild(popup);
                    nodeInput.style.display = 'none'; // hide the input field
                } else {
                    alert('No images found.'); // image search returns no results
                }
            }
        });
        node.appendChild(imgBtn);
    }
    return node;
}

// set the color of the node based of what type it is
function setNodeBorder(node, nodeType) {
    switch (nodeType) {
        case 'value':
            node.style.border = '2px solid red';
            break;
        case 'role':
            node.style.border = '2px solid blue';
            break;
        default:
            node.style.border = '2px solid green';
    }
}

// create the popup that allows the user to choose an image
function createImagePopup(images, node) { 
    const popup = document.createElement('div');
    popup.innerHTML = `
    <div class="bg-gray-300 p-2 rounded-xl w-1/2 flex flex-col justify-center m-auto items-center" style="z-index: 9999; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
        <div class="grid grid-cols-5 gap-4">
            ${images.map((image, index) => { // go through each image using map and add it to the list of selectable images
                // each image is a buiton that once clicked, adds the image to the node
                return `<button class='add-img' data-url="${image.previewURL}"><img src="${image.previewURL}" alt="Image ${index + 1}" class="mb-2"></button>`;
            }).join('')}
        </div>
        <button class="close-popup mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Close
        </button>
    </div>
    `;
    // handle closing the image popup if the 'Close' button is clicked
    popup.querySelector('.close-popup').addEventListener('click', () => {
        canvas.removeChild(popup);
        nodeInput.style.display = 'block';
    });
    // for each image, if the image is clicked then we get that image's info
    // and pass it over to the function responsible for handling adding it to the node
    popup.querySelectorAll('.add-img').forEach(imgBtn => {
        imgBtn.addEventListener('click', () => {
            const imageURL = imgBtn.getAttribute('data-url');
            addImageToNode(node, imageURL); 
            canvas.removeChild(popup);
            nodeInput.style.display = 'block';
        });
    });
    return popup;
}

// add the selected image to the bottom of the node
function addImageToNode(node, imageURL) {
    const img = document.createElement('img');
    img.src = imageURL;
    img.className = 'w-24 h-24 object-cover rounded-md';
    node.appendChild(img);
}

// select the audio element and the play button
const audioPlayer = document.getElementById('audio-player');
const playAudioButton = document.getElementById('play-audio');

// add event listener to the play button
playAudioButton.addEventListener('click', () => {
    // play the audio
    audioPlayer.play().catch(error => {
        console.error("Error playing audio: ", error);
    });
});

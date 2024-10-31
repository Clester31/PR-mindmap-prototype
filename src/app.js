const canvas = document.querySelector('.mm-canvas');
const nodeSelect = document.querySelector('.node-select');

const apiKey = '46834432-8a53092628e33a278a1baf5c7';

canvas.addEventListener('click', (event) => {
    if (event.target === canvas) {
        const { x, y } = getClickPosition(event);
        const node = createNode(x, y, nodeSelect.value);
        canvas.appendChild(node);
    }
});

async function searchForImage(query) {
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&per_page=10`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.hits;
    } catch (e) {
        console.error("Error fetching image: ", e);
        return [];
    }
}

function getClickPosition(event) {
    return {
        x: event.clientX - 100,
        y: event.clientY - 50,
    };
}

function createNode(x, y, nodeType) {
    const node = document.createElement('div');
    const nodeInput = document.createElement('input');
    const removeNodeBtn = document.createElement('button');

    node.className = 'node rounded-full p-4 absolute flex flex-col items-center text-center';
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
    node.innerText = nodeType;

    nodeInput.className = 'border-2 border-black rounded-lg text-center'

    removeNodeBtn.className = 'bg-red-500 px-2 text-white';
    removeNodeBtn.innerText = "remove";
    removeNodeBtn.addEventListener('click', () => canvas.removeChild(node));

    setNodeBorder(node, nodeType);
    node.appendChild(nodeInput);
    node.appendChild(removeNodeBtn);

    if (nodeType === 'asset') {
        const imgBtn = document.createElement('button');
        imgBtn.innerText = 'add image';
        imgBtn.addEventListener('click', async () => {
            const query = prompt('Enter your search query:');
            if (query) {
                const images = await searchForImage(query);
                if (images.length > 0) {
                    const popup = createImagePopup(images, node); 
                    canvas.appendChild(popup);
                    nodeInput.style.display = 'none'; 
                } else {
                    alert('No images found.');
                }
            }
        });
        node.appendChild(imgBtn);
    }

    return node;
}

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

function createImagePopup(images, node) { 
    const popup = document.createElement('div');
    popup.innerHTML = `
    <div class="bg-gray-300 p-2 rounded-xl w-1/2 flex flex-col justify-center m-auto items-center" style="z-index: 9999; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
        <div class="grid grid-cols-5 gap-4">
            ${images.map((image, index) => {
                return `<button class='add-img' data-url="${image.previewURL}"><img src="${image.previewURL}" alt="Image ${index + 1}" class="mb-2"></button>`;
            }).join('')}
        </div>
        <button class="close-popup mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Close
        </button>
    </div>
    `;
    popup.querySelector('.close-popup').addEventListener('click', () => {
        canvas.removeChild(popup);
        nodeInput.style.display = 'block';
    });
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

function addImageToNode(node, imageURL) {
    const img = document.createElement('img');
    img.src = imageURL;
    img.className = 'w-16 h-16 object-cover';
    node.appendChild(img);
}

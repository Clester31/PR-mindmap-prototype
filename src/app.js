const canvas = document.querySelector('.mm-canvas');
const node_select = document.querySelector('.node-select');
import { searchForImage } from "./googleImageSearch.js";

canvas.addEventListener('click', (event) => {
    if (event.target === canvas) {
        const x = event.clientX - 100;
        const y = event.clientY - 50;

        const node = document.createElement('div');
        const nodeInput = document.createElement('input');
        node.className = 'node rounded-full p-4 absolute flex flex-col items-center text-center';
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
        node.innerText = node_select.value;

        if(node_select.value === 'value') {
            node.style.border = '2px solid red'
        } else if(node_select.value === 'role') {
            node.style.border = '2px solid blue'
        } else {
            node.style.border = '2px solid green'
        }

        if(node_select.value === 'asset') {
            const imgBtn = document.createElement('button');
            imgBtn.innerText = 'add image';
            imgBtn.addEventListener('click', () => {
                searchForImage();
            })
            node.appendChild(imgBtn);
        }

        nodeInput.className = 'border-2 border-black'

        node.appendChild(nodeInput);
        canvas.appendChild(node);
    }
})

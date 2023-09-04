const listItems = document.querySelectorAll('.list-item');
const itemListArray = Array.from(listItems);
let draggedItem = null;

listItems.forEach(item => {
  item.addEventListener('dragstart', () => {
    draggedItem = item;
    item.classList.add('dragging');
  });

  item.addEventListener('dragend', () => {
    item.classList.remove('dragging');
    if (draggedItem) {
      draggedItem.style.display = 'flex';
      draggedItem = null;
    }
  });

  item.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  item.addEventListener('dragenter', (e) => {
    if (draggedItem !== null && draggedItem !== item) {
      const rect = item.getBoundingClientRect();
      const y = e.clientY - rect.top;
      if (y < rect.height / 2) {
        item.parentNode.insertBefore(draggedItem, item);
      } else {
        item.parentNode.insertBefore(draggedItem, item.nextSibling);
      }

      // Update the order in the array
      itemListArray.splice(itemListArray.indexOf(draggedItem), 1);
      itemListArray.splice(itemListArray.indexOf(item), 0, draggedItem);
    }
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const saveButton = document.getElementById('save-button');
  const loadButton = document.getElementById('load-button');
  const fileInput = document.getElementById('file-input');

  // Function to save the order of the list items
  function saveListOrder() {
    const order = itemListArray.map(item => item.getAttribute('data-id'));

    console.log('Order to be saved:', order); // Add this line for logging

    const jsonData = JSON.stringify(order, null, 2);

    // Create a Blob with the JSON data and trigger a download
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'list_order.json';
    a.click();

    // Clean up the URL.createObjectURL
    URL.revokeObjectURL(url);
  }

  // Function to load and reorder the list items
  function loadListOrder(order) {
    const reorderedArray = [];

    order.forEach(dataId => {
      const item = itemListArray.find(item => item.getAttribute('data-id') === dataId);
      if (item) {
        reorderedArray.push(item);
      }
    });

    // Reorder the items in the DOM
    reorderedArray.forEach(item => {
      item.parentNode.appendChild(item);
    });

    // Update itemListArray with the new order
    itemListArray.length = 0;
    itemListArray.push(...reorderedArray);
  }

  // Event listener for the Save button
  saveButton.addEventListener('click', saveListOrder);

  // Event listener for the Load button
  loadButton.addEventListener('click', () => {
    fileInput.click(); // Trigger the file input click event
  });

  // Event listener for the file input change event
  fileInput.addEventListener('change', event => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      try {
        const jsonData = event.target.result;
        const order = JSON.parse(jsonData);
        loadListOrder(order);
      } catch (error) {
        console.error('Error loading JSON data:', error);
      }
    };

    reader.readAsText(file);
  });
});

const sortableList = document.getElementById('sortable-list');

new Sortable(sortableList, {
  animation: 200,
});

document.addEventListener('DOMContentLoaded', function () {
  const listContainer = document.getElementById('sortable-list');
  const saveButton = document.getElementById('save-button');
  const loadButton = document.getElementById('load-button');
  const fileInput = document.getElementById('file-input');

  // Initialize the sortable list using the Sortable library
  const sortable = new Sortable(listContainer, {
    animation: 150,
  });

  // Function to save the order of the list items
  function saveListOrder() {
    const listItems = listContainer.querySelectorAll('.list-item');
    const order = Array.from(listItems).map(item => item.dataset.id);

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

  // Function to load and update the order of the list items
  function loadListOrder(order) {
    const listItems = Array.from(listContainer.querySelectorAll('.list-item'));

    order.forEach((itemId, index) => {
      const listItem = listItems.find(item => item.dataset.id === itemId);
      if (listItem) {
        listContainer.appendChild(listItem);
      }
    });
  }

  // Event listener for the Save button
  saveButton.addEventListener('click', saveListOrder);

  // Event listener for the Load button
  loadButton.addEventListener('click', function () {
    fileInput.click();
  });

  // Event listener for the file input change
  fileInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        try {
          const order = JSON.parse(event.target.result);
          loadListOrder(order);
        } catch (error) {
          console.error('Error parsing JSON file:', error);
        }
      };
      reader.readAsText(file);
    }
  });
});
document.addEventListener('DOMContentLoaded', function () {
  const listContainer = document.getElementById('sortable-list');
  const saveButton = document.getElementById('save-button');
  const loadButton = document.getElementById('load-button');

  // Initialize the sortable list using the Sortable library
  const sortable = new Sortable(listContainer, {
    animation: 150,
  });

  // Function to save the order of the list items to cookies
  function saveListOrder() {
    const listItems = listContainer.querySelectorAll('.list-item');
    const order = Array.from(listItems).map(item => item.dataset.id);

    // Convert the order array to a string
    const orderString = JSON.stringify(order);

    // Save the order string in a cookie named 'listOrder'
    document.cookie = `listOrder=${orderString}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;

    console.log('Saved order to cookies:', order);
  }

  // Function to load and update the order of the list items from cookies
  function loadListOrderFromCookies() {
    const cookies = document.cookie.split(';');
    const orderCookie = cookies.find(cookie => cookie.trim().startsWith('listOrder='));

    if (orderCookie) {
      const orderString = orderCookie.split('=')[1];
      const order = JSON.parse(orderString);

      console.log('Loaded order from cookies:', order);

      loadListOrder(order);
    } else {
      console.log('No saved order found in cookies.');
    }
  }

  // Function to update the order of the list items
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
  saveButton.addEventListener('click', () => {
    saveListOrder();
  });

  // Event listener for the Load button
  loadButton.addEventListener('click', () => {
    loadListOrderFromCookies();
  });
});

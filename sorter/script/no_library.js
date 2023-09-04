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

  // Function to save the order of the list items to cookies
  function saveListOrderToCookies() {
    const order = itemListArray.map(item => item.getAttribute('data-id'));

    console.log('Order to be saved:', order);

    // Convert the order array to a string
    const orderString = JSON.stringify(order);

    // Save the order string in a cookie named 'listOrder'
    document.cookie = `listOrder=${orderString}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
  }

  // Function to load and reorder the list items from cookies
  function loadListOrderFromCookies() {
    const cookies = document.cookie.split(';');
    const orderCookie = cookies.find(cookie => cookie.trim().startsWith('listOrder='));

    if (orderCookie) {
      const orderString = orderCookie.split('=')[1];
      const order = JSON.parse(orderString);
      loadListOrder(order);
    }
  }

  // Function to update the order of the list items
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
  saveButton.addEventListener('click', saveListOrderToCookies);

  // Event listener for the Load button
  loadButton.addEventListener('click', loadListOrderFromCookies);
});

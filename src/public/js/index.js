// Archivo para conectarse con el servidor, desde el lado del cliente
const socket = io();

// Cuando se añade un nuevo producto, actualizar la lista en tiempo real
socket.on('productAdded', (product) => {
    const productsList = document.getElementById('products-list');
    const productItem = `
      <li id="product-${product.id}">
        <h3>${product.title}</h3>
        <p>Descripcion: ${product.description}</p>
        <p>Precio: $${product.price}</p>
        <p>Stock: ${product.stock}</p>
        <button class="btn btn-danger" onclick="deleteProduct('${product.id}')">Eliminar</button>
      </li>`;
    productsList.insertAdjacentHTML('beforeend', productItem);
});

// Cuando se elimina un producto, removerlo de la lista en tiempo real
socket.on('productDeleted', (productId) => {
    const productElement = document.getElementById(`product-${productId}`);
    if (productElement) {
        productElement.remove();
    }
});

// Manejar la creación de productos desde el formulario
document.getElementById('addProductForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const stock = document.getElementById('stock').value;
    
    // Enviar el nuevo producto al servidor vía WebSocket
    socket.emit('createProduct', { title, description, price, stock });
    
    // Limpiar el formulario
    e.target.reset();
  });
  
  // Función para eliminar producto usando WebSocket
  function deleteProduct(productId) {
    socket.emit('deleteProduct', productId);
  }
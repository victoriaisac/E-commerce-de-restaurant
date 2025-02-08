//CARRITO 

const carrito = document.querySelector(".listaDeProductos");//div vacio donde almaceno los elementos del carrito
const listaProductos = document.querySelector(".contenedorProducto");
const contenedorProductos = document.querySelector(".buy-card .listaDeProductos");
const botonCarrito = document.querySelector("#botonCarrito");
const botones = document.querySelectorAll(".agregarCarrito");
let productosCarrito = []
const cuentaCarrito = document.querySelector("#cuentaCarrito");
const totalCompra = document.createElement("div");

Eventos()

//Obtengo los botones de pedir y el contenido del contenedor
botones.forEach(clickeaProducto => {
    clickeaProducto.addEventListener("click", ProductoClickeado);

});


function ProductoClickeado(event) {

    const buton = event.target;
    const productoSeleccionado = event.target.parentElement;
    
    LeerInfo(productoSeleccionado)
    

};

//funcion para almacenar los eventos que estan dentro del carrito
function Eventos () {

    carrito.addEventListener("click", eliminarProducto);
    
        document.addEventListener("DOMContentLoaded", () =>{
            productosCarrito = JSON.parse(localStorage.getItem("pedido")) || [];
            agregarCarrito() 
        })

    botonCarrito.addEventListener("click", finalizarCompra)
    }
    
//Elimina producto

function eliminarProducto(e) {
if (e.target.classList.contains("borrarProducto")) {
    const IdProducto = e.target.getAttribute("data-id");
    
    productosCarrito = productosCarrito.filter(producto => producto.id !== IdProducto)

    agregarCarrito()
}   
}

function LeerInfo (producto) {

    //transformar precio a numero
        const precioTexto = producto.querySelector(".precio").textContent.replace('$', '');
        const precioNumero = parseFloat(precioTexto);

        if (isNaN(precioNumero)) {
        console.error("no es numero",precioTexto);
        return
        }

    //Obtengo el contenido de "productoSeleccionado" y lo almaceno en un objeto
        const infoProductos = {
            nombre: producto.querySelector(".nombreProducto").textContent,
            precio: precioNumero,
            id: producto.querySelector(".agregarCarrito").getAttribute("data-id"),
            cantidad: 1
        }
    
    //Actualizar cantidad
    const productoAgregado = productosCarrito.some(producto => producto.id === infoProductos.id)

    if (productoAgregado) {
        const prod = productosCarrito.map(producto =>{
            if (producto.id === infoProductos.id) {
                producto.cantidad++;
                return producto;
            } else{
                return producto;
            } 
        });
        } else {
        productosCarrito = [...productosCarrito,infoProductos]
    };

    
    agregarCarrito()
    
};

function agregarCarrito() {
    borrarDuplicado()

    let totalCompraFinal = 0;

    productosCarrito.forEach(producto =>{

    //calcular total por producto y sumarlo al total
        const precioValido = typeof producto.precio === 'number' ? producto.precio : parseFloat(producto.precio);
        const totalProducto = producto.precio * producto.cantidad
        totalCompraFinal += totalProducto

        const item = document.createElement("div");
        item.innerHTML= ` <p> ${producto.nombre} </p>
        <p> $${producto.precio} </p>
        <p> ${producto.cantidad} </p>
        <p>Total: $${totalProducto}</p>
        <p><span class="borrarProducto" data-id="${producto.id}">X</span></p>
        `
        contenedorProductos.appendChild(item);
        
    })

    totalCompra.innerHTML= `<h3>Total: $${totalCompraFinal}</h3>`;
    contenedorProductos.appendChild(totalCompra)

    cuentaCarrito.textContent = productosCarrito.reduce((total, producto) => total + producto.cantidad, 0);

    guardarLocalStorage()
};

function guardarLocalStorage() {
    localStorage.setItem("pedido", JSON.stringify(productosCarrito))
}

function borrarDuplicado() {
    while (contenedorProductos.firstChild) {
        contenedorProductos.removeChild(contenedorProductos.firstChild)
    }
};

//FORMULARIO

function finalizarCompra(event) {

    event.preventDefault(); 
    window.location.href = "formulario.html";

    guardarLocalStorage()
}



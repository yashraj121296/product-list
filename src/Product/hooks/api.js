async function useGetProduct() {
    return fetch("http://localhost:8080/products", {mode: 'cors'})
        .then(data => data.json())
        .catch(error => console.log(error))
}


function useDeleteProduct(name) {
    fetch(`http://localhost:8080/products/${name}`, {method: "DELETE"}).then(() => {
    }).catch(response => console.log(response))
}

function useAddProduct(products) {
    console.log(products)
    fetch("http://localhost:8080/products", {
        method: "POST",
        body: JSON.stringify(products),
        headers: {"Content-Type":"application/json"}
    }).then(() => {
    }).catch(response => console.log(response))
}

module.exports = {useDeleteProduct, useGetProduct, useAddProduct}

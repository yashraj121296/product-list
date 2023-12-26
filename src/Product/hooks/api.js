async function useGetProduct() {
    return fetch("http://localhost:8080/products", {mode: 'cors'})
        .then(data => data.json())
        .catch(error => console.log(error))
}


function useDeleteProduct(name) {
    fetch(`http://localhost:8080/products/${name}`, {method: "DELETE"}).then(() => {
    }).catch(response => console.log(response))
}


module.exports = {useDeleteProduct, useGetProduct}

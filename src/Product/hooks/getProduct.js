export default async function useGetProduct() {
    // const response = await fetch('http://localhost:8080/products', {mode: 'cors'});
    // const data = await response.json();
    // console.log({data})
    return fetch("http://localhost:8080/products", {mode:'cors'})
        .then(data => data.json())
        .catch(error => console.log(error))
}

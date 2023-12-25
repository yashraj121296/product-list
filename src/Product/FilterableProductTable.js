import './Style.css'
import {useEffect, useState} from "react";
import useGetProduct from "./hooks/getProduct";
import {MdDelete} from "react-icons/md";

function ProductCategoryRow({category}) {
    return <tr>
        <th align={"left"}>
            {category}
        </th>
    </tr>
}

function ProductRow({product, products, updateProducts}) {

    //TODO: move to main component i.e FilterableProductTable
    function deleteProduct(name) {
        updateProducts(products.filter(products => products.name !== name))
    }

    return <>
        <tr>
            <td>
                {product.stocked ? product.name : <div style={{color: "red"}}>{product.name}</div>} </td>
            <td align={"center"}>
                {product.price}
            </td>
            <td>
                <MdDelete color={"red"} onClick={() => deleteProduct(product.name)}></MdDelete>
            </td>
        </tr>

    </>
}


function ProductTable({products, searchText, onlyShowInStock, updateProducts}) {

    const categories = new Set()
    // eslint-disable-next-line array-callback-return
    products.map(it => {
        categories.add(it.category)
    })

    products = searchText === "" ? products : products.filter((products) => products.name.includes(searchText))
    products = onlyShowInStock === "false" ? products : products.filter((products) => products.stocked === true)

    return <>
        <tr>
            <th>Name</th>
            <th>Price</th>
        </tr>
        {
            Array.from(categories).map((category) =>
                <>
                    <ProductCategoryRow category={category}></ProductCategoryRow>
                    {
                        products.map(product =>
                            (product.category === category ? <ProductRow product={product} products={products}
                                                                         updateProducts={updateProducts}></ProductRow> : null)
                        )
                    }
                </>
            )
        }
    </>;
}

function InStockCheckBox({onlyShowInStock, setOnlyShowInStock}) {
    return <div>
        <input id="onlyShowInStock" value={onlyShowInStock} onChange={event => {
            event.target.value === "false" ? setOnlyShowInStock("true") : setOnlyShowInStock("false")
        }}
               type={"checkbox"}/>
        <label htmlFor="onlyShowInStock">Only show product in stock</label>
    </div>;
}


function SearchBar({searchText, setSearchText, onlyShowInStock, setOnlyShowInStock}) {
    return <>
        <div>
            <input value={searchText} onChange={event => setSearchText(event.target.value)} placeholder={'search'}/>
        </div>
        <InStockCheckBox onlyShowInStock={onlyShowInStock} setOnlyShowInStock={setOnlyShowInStock}/>
    </>
}


function FilterableProductTable() {

    const [searchText, setSearchText] = useState("")
    const [onlyShowInStock, setOnlyShowInStock] = useState("false")
    const [products, updateProducts] = useState([])

    //TODO: Add dependency array
    useEffect(() => {
        async function FetchData() {
            updateProducts(await useGetProduct())
        }

        FetchData()
    }, [])

    return <>
        <SearchBar searchText={searchText} setSearchText={setSearchText} onlyShowInStock={onlyShowInStock}
                   setOnlyShowInStock={setOnlyShowInStock}></SearchBar>
        <ProductTable products={products} searchText={searchText} onlyShowInStock={onlyShowInStock}
                      updateProducts={updateProducts}></ProductTable>
    </>
}


export default FilterableProductTable

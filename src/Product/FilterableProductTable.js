import './Style.css'
import {useEffect, useState} from "react";
import {useAddProduct, useDeleteProduct, useGetProduct} from "./hooks/api";
import {MdDelete} from "react-icons/md";
import {RiPlayListAddFill} from "react-icons/ri";
import ReactModal from 'react-modal';
import Switch from "react-switch";


function NewProductForm({updateOpenNewForm}) {
    const [inStock, updateInStock] = useState(false)

    function HandleSubmit(e) {
        e.preventDefault();
        useAddProduct([{
            name: e.target.elements.name.value,
            price: parseFloat(e.target.elements.price.value),
            category: e.target.elements.category.value,
            stocked: inStock
        }])
        updateOpenNewForm(false);
    }

    return <form onSubmit={HandleSubmit}>
        <tr>
            <td><label>Product name </label></td>
            <td><input autoComplete={"off"} required={true} type={"text"} name={"name"} placeholder={"name"}/></td>
        </tr>
        <tr>
            <td><label>Product price </label></td>
            <td><input required={true} type={"number"} name={"price"} placeholder={"price"}/></td>
        </tr>
        <tr>
            <td><label>Product category </label></td>
            <td><select name={"category"}>
                <option value="Fruits">Fruits</option>
                <option value="Vegetables">Vegetables</option>
            </select></td>
        </tr>
        <tr>
            <label> <span>Is Stocked</span><br/>
                <Switch height={25} checked={inStock} name={"stocked"} onChange={(event) => updateInStock(event)}/>
            </label>
        </tr>
        <div align={"center"}>
            <button type={"submit"}>Submit</button>
            <button onClick={() => updateOpenNewForm(false)} style={{marginLeft: 20}}>Close</button>
        </div>
    </form>;
}

function ProductCategoryRow({category}) {

    const [openNewForm, updateOpenNewForm] = useState(false)

    return <tr>
        <th align={"left"} className={".category-header"}>
            {category}
            <RiPlayListAddFill className={"add-icon"} onClick={() => {
                updateOpenNewForm(true)
            }}></RiPlayListAddFill>
            <ReactModal style={{
                overlay: {
                    position: 'fixed',
                    top: 100,
                    left: 100,
                    right: 100,
                    bottom: 100,
                    backgroundColor: 'rgba(255, 255, 255, 0.75)'
                },
                content: {
                    position: 'absolute',
                    top: '50px',
                    left: '100px',
                    right: '40px',
                    bottom: '40px',
                    border: '1px solid #ccc',
                    background: '#fff',
                    overflow: 'auto',
                    WebkitOverflowScrolling: 'touch',
                    borderRadius: '0px',
                    outline: 'none',
                    padding: '20px'
                }
            }} isOpen={openNewForm}>
                <NewProductForm category={category} updateOpenNewForm={updateOpenNewForm}/>
            </ReactModal>
        </th>

    </tr>
}

function ProductRow({product, products, updateProducts}) {

    //TODO: move to main component i.e FilterableProductTable
    function DeleteProduct(name) {
        updateProducts(products.filter(products => products.name !== name))
        useDeleteProduct(name);
    }

    return <>
        <tr>
            <td>
                {product.stocked ? product.name : <div style={{color: "red"}}>{product.name}</div>} </td>
            <td align={"center"}>
                {product.price}
            </td>
            <td>
                <MdDelete color={"red"} onClick={() => DeleteProduct(product.name)}></MdDelete>
            </td>
        </tr>

    </>
}


function ProductTable({products, searchText, onlyShowInStock, updateProducts}) {

    if (!products) {
        return <div>No Products available</div>
    }
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

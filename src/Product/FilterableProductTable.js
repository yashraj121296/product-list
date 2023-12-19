import './Style.css'
import {useState} from "react";

function ProductCategoryRow({category}) {
    return <tr>
        <th align={"left"}>
            {category}
        </th>
    </tr>
}


function ProductRow({product}) {
    console.log(product.name)
    return <>
        <tr>
            <td>
                {product.stocked ? product.name : <div style={{color: "red"}}>{product.name}</div>}            </td>
            <td>
                {product.price}
            </td>
        </tr>

    </>
}

ProductRow.propTypes = {};

function ProductTable({products,searchText}) {

    const categories = new Set()
    // eslint-disable-next-line array-callback-return
    products.map(it => {categories.add(it.category)})

    products = searchText===""? products :products.filter((products)=>products.name.includes(searchText))

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
                            (product.category === category ? <ProductRow product={product}></ProductRow> : null)
                        )
                    }
                </>
            )
        }
    </>;
}

function SearchBar({searchText,setSearchText}) {
    return <>
        <div><input value={searchText} onChange={event => setSearchText(event.target.value)} placeholder={'search'}/></div>
        <div><input type={"checkbox"}/>Only show product in stock</div>
    </>
}



function FilterableProductTable({products}) {

    const [searchText,setSearchText] = useState("")

    return <>
        <SearchBar searchText={searchText} setSearchText={setSearchText} ></SearchBar>
        <ProductTable products={products} searchText={searchText} ></ProductTable>
    </>
}


export default FilterableProductTable

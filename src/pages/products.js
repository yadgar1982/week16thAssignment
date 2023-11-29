import React, { useEffect, useState } from "react";
import "./products.css";



export function Products(){
    const [content, setContent]= useState(<ProductList showForm={showForm}/>);
    function showList(){
        setContent(<ProductList showForm={showForm}/>);
    }
    //this function will show the product form 
    function showForm(product){
        setContent(<ProductForm  product = {product} showList = {showList}/>);
    }
    return(
        <div className="pro">
            <div className="container my-9">
                {content}
            </div>
        </div>
    
    );
}
//this function will get data from the json server
function ProductList(props){
    const [products, setProducts] = useState([]);

    function fetchProducts(){
        fetch("http://localhost:3000/products")
        .then ((response)=> {
            if(!response.ok){
                throw new Error("Unexpected Server Response");
            }
            return response.json()
        })
        .then ((data)=> {
            console.log(data);
            setProducts(data);
        })
        .catch((error)=> console.log("Error:",error));
    }
    useEffect(()=>fetchProducts(),[]);
// this function will delete data from the server
    function deleteProduct(id){
        fetch('http://localhost:3000/products/'+ id, {
            method:"DELETE"
            
        })

            .then ((response)=> response.json())
            .then ((data)=> fetchProducts());
            alert("Your Data has been deleted successfully!")
    }

    
    return(
        <div className="pro">
            <table className="table table-warning table-stripped">
                <tr>
                    <h5 className="text-center mb-3 my-2" style={{float:"left"}}>List of Products</h5>

                </tr>
                <tr>
                    <button onClick={()=> props.showForm({})} type="button" className="btn btn-primary me-3 my-3" >Create</button>
                    <button onClick={()=> fetchProducts()} type="button" className="btn btn-outline-success me-2">Refresh</button>

                </tr>
                <tr>
                <table className="table table-success table-stripped">
                    <thead>
                        <tr className="tr">
                            <th>Id</th>
                            <th>Name</th>
                            <th>Brand</th>
                            <th>Price</th>
                            <th>Description</th>
                            <th>Product Date</th>
                            <th>Actions</th>
                        

                        </tr>
                    </thead>
                    <tbody>
                        {
                            // here we will copy the file on the page from the server through the fetch function. 
                            products.map((product, index)=>{
                                return(
                                    <tr key = {index}>
                                        <td>{product.id}</td>
                                        <td>{product.name}</td>
                                        <td>{product.brand}</td>
                                        <td>{product.price}</td>
                                        <td>{product.description}</td>
                                        <td>{product.productDate}</td>
                    
                                        <td style = {{width: "10px", whiteSpace: "nowrap"}}>
                                            <button onClick={()=>props.showForm(product)} type="button" className="btn btn-primary btn-sm me-2">Edit</button>
                                            <button onClick={()=> deleteProduct(product.id)}type="button" className="btn btn-danger btn-sm ">Delete</button>
                                        </td>
                                    </tr>

                                );
                            })
                        }
                    </tbody>
                </table>

                </tr>
            </table>

        </div>

    );
};

function ProductForm(props){
    const [errorMessage,setErrorMessage]=useState("");
   function handleSubmit(event){
        event.preventDefault();
        //read Data from form
        const formData = new FormData (event.target);

        //convert form Data to object:
        const product = Object.fromEntries(formData.entries());

        //form validation here 
        if(!product.name ||!product.brand || !product.price ||!product.description) {
            console.log("please fill all fields!");
            alert("Please fill all the fields, some fields are empty")
            // setErrorMessage(
            //     <div className="alert alert-danger" role="alert" >
            
            //     Please Fill All the Fields!
            //     </div>
                
            // )
            return;
        }

        
        if(props.product.id){
            //here we will update the data and I have used Patch method instead of put method to shorten the process.
            fetch("http://localhost:3000/products/" + props.product.id,{
                method:"PATCH",
                headers:{
                    "content-type":"application/json",
    
                },
                body: JSON.stringify(product)
            })
                .then((response)=> {
                    if(!response.ok){
                        throw new Error ("Network response was not OK");
    
                    }
                    return response.json()
                })
                .then((data)=> props.showList())
                .catch((error)=>{
                    console.error("Error:", error);
                 
                    
                });
    
        }
        else{

            // Create A new product
            
        
            product.productDate =  new Date().toISOString().slice(0,10);
            fetch("http://localhost:3000/products",{
                method:"POST",
                headers:{
                    "content-type":"application/json",

                },
                body: JSON.stringify(product)
            })
                .then((response)=> {
                    if(!response.ok){
                        throw new Error ("Network response was not OK");

                    }
                    return response.json()
                })
                .then((data)=> props.showList())
                .catch((error)=>{
                    console.error("Error:",error);
                });
        }
    }
    
    return(
        <div className="container">
            <div className="row mb-2">
            <div className="col d-flex">{errorMessage}</div>
        
            <div className="row mb-2">
                <div className="col-8">
                    {/* // this form is made for data entry of products */}
                                
                    <form  className="card"onSubmit={(event)=> handleSubmit(event)}>
                                        <div><h5 className="text-center mb-2  " style={{float:"left"}}>{props.product.id ? "Edit Product" : "Add New Product"}</h5></div>
                                        <div><hr style={{color:"transparent"}}></hr></div>
                                        { props.product.id &&  
                                        <div className="row mb-3 my-2">
                                            <label className="col-sm-2 col-form-label my-2">ID</label>
                                        <div className="col-sm-4">
                                                <input readOnly className="form-control-plaintext"
                                                name="id"
                                                defaultValue={props.product.id}/>
                                        </div>
                                        </div>}
                                        <div className="row mb-2">
                                            <label className="col-sm-4 col-form-label mb-3"><h7>Name</h7></label>
                                            <div className="col-sm-7">
                                                <input className="form-control"
                                                name="name"
                                                defaultValue={props.product.name}/>
                                            </div>
                                        </div>
                                        <div className="row mb-2 ">
                                            <label className="col-sm-4 col-form-label"><h7>Price</h7></label>
                                            <div className="col-sm-7">
                                                <input className="form-control"
                                                name="price"
                                                defaultValue={props.product.price}/>
                                            </div>

                                        </div>
                                        <div className="row mb-2 ">
                                            <label className="col-sm-4 col-form-label"><h7>Brand</h7></label>
                                            <div className="col-sm-7 my-2" >
                                                <select className="form-select" 
                                                name="brand"
                                                defaultValue={props.product.brand}>
                                                    <option value="">Select Your Product</option>
                                                    <option value="food">food</option>
                                                    <option value="electronics">electronics</option>
                                                    <option value="health">health</option>
                                                    <option value="Others">Other Products</option>
                                                </select>
                                            </div>

                                        </div>
                                        <div className="row mb-2 ">
                                            <label className="col-sm-4 col-form-label "><h7>Description</h7></label>
                                            <div className="col-sm-7 my-2">
                                                <textarea className="form-control"
                                                rows={6}
                                                cols={5}
                                                name="description"
                                                defaultValue={props.product.description}/>
                                            </div>
                                            

                                        </div>
                                    
                                        <div className="row mb-2">
                                            <div className="offset-sm-4 col-sm-4 d-grid">
                                                <button type="submit" className="btn btn-success mb-3 "> {props.product.id ? "Edit" : "Save"}</button>
                                            </div>
                                            <div className="col-sm-2 col-sm-2 d-grid">
                                                <button  onClick={()=> props.showList()} type="button" className="btn btn-danger mb-3 ">Cancel</button>
                                            </div>
                                            
                                        </div>
                                        
                                    </form>
                </div>
                <div className="col-4">
                    <img src="https://th.bing.com/th/id/OIP.8dkN2QMk2Yo9Uz4n0TC7fQHaHi?rs=1&pid=ImgDetMain"  alt="..."/>
                            
                </div>
            </div>
            
        </div>
         
                
           
        
        </div>
        
        
        );
};
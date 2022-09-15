import "./ProductListing.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../App";
import { Box } from "@mui/system";
import { Badge, Button, Grid, Stack, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';
import ProductCard from "./ProductCard";


const ProductListing = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const [search, setSearch] = useState("");
    const [cart, setCart] = useState([]);

    const [filters, setFilters] = useState({
        color: [],
        type: [],
        gender: ["Men", "Women"],
        priceRange: ["0-250", "250-450", "450"]
    });
    const [selectedFilters, setSelectedFilters] = useState({
        color: [],
        type: [],
        gender: [],
        priceRange: [""]
    });
    const [productPage, setProductPage] = useState(true);
    // state declarations-------end-------------

    const getProductsFromAPI = async () => {
        try {
            const res = await axios.get(config.endpoint);
            setProducts(res.data);
            setFilteredProducts(res.data);
        } catch (error) {
            console.log(error)
        }
    }

    const updateFilters = () => {
        let tempColors = [], tempType = [];
        products.forEach(product => {
            if (!tempColors.includes(product.color)) {
                tempColors.push(product.color);
            }
            if (!tempType.includes(product.type)) {
                tempType.push(product.type);
            }
        });

        setFilters({ ...filters, color: tempColors, type: tempType })
    }

    const handleFilters = (e) => {
        const { name, value } = e.target;
        let temp;
        if (name === "priceRange") {
            if (selectedFilters[name][0] === value) {
                temp = [""];
            } else
                temp = [value];
        } else {
            if (!selectedFilters[name].includes(value)) {
                temp = [...selectedFilters[name], value];
            } else {
                temp = [...selectedFilters[name]]
                let index = temp.indexOf(value);
                temp.splice(index, 1);
            }
        }
        console.log(temp);
        setSelectedFilters({ ...selectedFilters, [name]: temp });

    }

    const updateFilteredProducts = () => {
        let { color, type, gender, priceRange } = selectedFilters;
        let price = priceRange[0].split("-");
        let temp = products.filter(product => {
            return (
                (color.length === 0 || color.includes(product.color))
                && (type.length === 0 || type.includes(product.type))
                && (gender.length === 0 || gender.includes(product.gender))
                && (price.length === 1 || (product.price >= price[0] && product.price <= price[1]))
                && (price.length !== 1 || price[0].length === 0 || product.price === price[0])
            )
        });
        setFilteredProducts(temp);

    }

    const addToCart = async (product, qty) => {
        let { id, name, imageURL, price, quantity } = product;
        if (qty > quantity) {
            enqueueSnackbar("Maximum quantity reached", { variant: "error" });
        } else if (qty === 0) {
            deleteCartItem(id);
        } else {
            console.log(cart);
            let cartValue = [...cart];
            let removeItem = cartValue.find((pd) => {
                if (pd.id === id)
                    return true;
            });
            if (removeItem !== undefined) {
                let prodIndex = cartValue.indexOf(removeItem);
                cartValue.splice(prodIndex, 1);
            }
            let temp = [...cartValue, { "id": id, "name": name, "imageURL": imageURL, "qty": qty, "price": price }]
            setCart(temp);
        }
    }
    const getCartQty = (id) => {
        let qty = 0;
        if (cart.length) {
            cart.forEach(element => {
                if (element.id === id) {
                    qty = element.qty;
                }
            });
        }
        return qty;
    }

    const deleteCartItem = (prodId) => {
        let cartValue = [...cart];
        let ind = cartValue.findIndex((pd) => pd.id === prodId)
        cartValue.splice(ind, 1);
        setCart(cartValue);
    }

    const performSearch = (value) => {
        let filtered = products.filter((x) => {
            console.log(value)
            console.log(x.color.toLowerCase())
            return (
                (x.name.toLowerCase().includes(value)
                    || x.type.toLowerCase().includes(value)
                    || x.color.toLowerCase().includes(value))
            )
        });
        setFilteredProducts(filtered);
    }

    const [debounceTimeout, setDebounceTimeout] = useState(0);
    const debounceSearch = (event, debounceTimeout) => {
        let value = event.target.value;

        if (debounceTimeout) clearTimeout(debounceTimeout);
        setDebounceTimeout(setTimeout(() => performSearch(value), 500));
    };

    useEffect(() => {
        getProductsFromAPI();
    }, []);

    useEffect(() => {
        updateFilters();
    }, [products]);

    useEffect(() => {
        updateFilteredProducts();
    }, [selectedFilters]);

    return (
        <div>
            {productPage ? (
                <div>
                    <div className="header">
                        <div onClick={() => setProductPage(true)} className="header-title">TeeRex Store</div>
                        <div className="header-actions">
                            <a href="/" className="hidden">Products<div className="line"></div></a>
                            <Button color="inherit" onClick={() => setProductPage(false)}>
                                <Badge badgeContent={cart.length} >
                                    <ShoppingCartIcon fontSize="large" />
                                </Badge>
                            </Button>
                        </div>
                    </div>
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100vw", padding: "1rem 2rem" }} >
                        <Stack
                            style={{ boxShadow: '1px 2px 9px grey', }}
                            className="filter-desktop"
                            flexDirection="column"
                            gap="20px"
                            justifyContent="flex-start"
                        >
                            <div >
                                <b>Color</b>
                                {filters.color.map(function (x) {
                                    return (
                                        <div style={{ padding: "5px" }}>
                                            <input style={{ margin: "0 10px 0 0" }} type={"checkbox"} key={x} name="color" value={x} onChange={handleFilters} checked={selectedFilters.color.includes(x)} />{x}
                                        </div>)
                                })}
                            </div>
                            <div>
                                <b>Gender</b>
                                {filters.gender.map(function (x) {
                                    return (
                                        <div style={{ padding: "5px" }}>
                                            <input style={{ margin: "0 10px 0 0" }} type={"checkbox"} key={x} name="gender" value={x} onChange={handleFilters} checked={selectedFilters.gender.includes(x)} />{x}
                                        </div>)
                                })}
                            </div>
                            <div>
                                <b>Price</b>
                                {filters.priceRange.map(function (x) {
                                    return (
                                        <div style={{ padding: "5px" }}>
                                            <input style={{ margin: "0 10px 0 0" }} type={"checkbox"} key={x} name="priceRange" value={x} onChange={handleFilters} checked={selectedFilters.priceRange.includes(x)} />{x}
                                        </div>)
                                })}
                            </div>
                            <div>
                                <b>Type</b>
                                {filters.type.map(function (x) {
                                    return (
                                        <div style={{ padding: "5px" }}>
                                            <input style={{ margin: "0 10px 0 0" }} type={"checkbox"} key={x} name="type" value={x} onChange={handleFilters} checked={selectedFilters.type.includes(x)} />{x}
                                        </div>)
                                })}
                            </div>
                        </Stack>
                        <Box
                            className="product-desktop">
                            <Stack spacing={2} direction="row" position="center">
                                <form className="search-form">
                                    <input
                                        type="text"
                                        className="search-input"
                                        placeholder="Search for products..."
                                        value={search}
                                        onChange={(event) => {
                                            setSearch(event.target.value);
                                            debounceSearch(event, debounceTimeout);
                                        }}
                                    />
                                    <button type="submit" className="search-button">
                                        <SearchIcon />
                                    </button>
                                    <Button className="filter-mobile" variant="contained" color="inherit" >
                                        <FilterAltIcon />
                                    </Button>
                                </form>


                            </Stack>
                            <Box sx={{ width: "100%", margin: "4rem 0 1rem 0" }}>
                                {filteredProducts.length ? <Grid
                                    container
                                    spacing={2}

                                >
                                    {filteredProducts.map(function (pd) {
                                        return (
                                            <Grid item lg={3} sm={6} xs={12} key={pd.id} >
                                                <ProductCard
                                                    product={pd}
                                                    cartQty={getCartQty(pd.id)}
                                                    handleAddToCart={addToCart}
                                                />
                                            </Grid>
                                        );
                                    })}
                                </Grid> : <div style={{ height: "70vh" }} className="product-desktop">No products found...</div>}
                            </Box>
                        </Box>
                    </Box>
                </div>) : (
                <div>
                    <div className="header">
                        <div className="header-title" onClick={() => setProductPage(true)}>TeeRex Store</div>
                        <div className="header-actions">
                           
                            <a href="#" onClick={() => setProductPage(true)}>Products</a>
                            <a href="#" className="hidden">Shopping cart<div className="line"></div></a>
                        </div>
                    </div>
                    <Box sx={{ margin: "2rem 0" }} >
                        <h2 style={{ margin: "1rem 4rem" }}>Shopping Cart</h2>
                        {cart.length > 0 ? (
                            cart.map((pdt) => {
                                //console.log(pdt);
                                return (
                                    <Box key={pdt.id} sx={{ margin: "2rem 0", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }} >
                                        <Box display="flex" alignItems="center" padding="1rem" >
                                            <Box className="image-container">
                                                <img
                                                    src={pdt.imageURL}
                                                    alt={pdt.name}
                                                    width="100%"
                                                    height="100%"
                                                />
                                            </Box>
                                            <Box padding={"1rem"}>
                                                <Typography variant="h6">{pdt.name}</Typography>
                                                <Typography variant="subtitle">Rs {pdt.price}</Typography>
                                            </Box>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
                                                <Button variant="outlined" disabled>Qty: {pdt.qty}</Button>
                                                <Button color="inherit" variant="outlined" onClick={() => deleteCartItem(pdt.id)}>Delete</Button>
                                            </Box>
                                        </Box>
                                    </Box>)
                            })
                        ) : <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100vw" }}>
                            <Stack justifyContent="center" gap="80px">
                                <Typography variant="h5" sx={{ textAlign: "center" }}>Cart Is Empty 🙁🙁</Typography>
                                <img src="https://raw.githubusercontent.com/codersgyan/realtime-pizza-app-node-express-mongo/master/public/img/empty-cart.png" alt="cart" style={{ width: "500px" }} />
                            </Stack>
                        </Box>}

                    </Box>
                </div>
            )}
        </div>
    )
}
export default ProductListing;
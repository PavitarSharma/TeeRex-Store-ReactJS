import { AddOutlined, RemoveOutlined } from "@mui/icons-material";
import { Box, Card, CardActions, CardMedia, IconButton, Stack, Typography } from "@mui/material";
import "./ProductCard.css"
const ProductCard = ({ product, cartQty, handleAddToCart }) => {

    return (
        <Card className="card" style={{ boxShadow: '1px 2px 9px grey', }}>
            <CardMedia
                component="img"
                image={product.imageURL}
                width={"100%"}
                height={"100%"}
            />
            <Typography variant="h6" className="product-name">{product.name}</Typography>
            <CardActions className="card-actions">
                <Typography variant="subtitle1">
                    Rs {product.price}
                </Typography>
                {cartQty === 0 ? (
                    <button
                        className="card-button"
                        onClick={() => handleAddToCart(product, 1)}
                    >
                        ADD TO CART
                    </button>) : (
                    <Stack direction="row" alignItems="center" justifyContent={"center"} width="100%">
                        <IconButton size="small" color="inherit" onClick={() => handleAddToCart(product, cartQty - 1)} >
                            <RemoveOutlined />
                        </IconButton>
                        <Box padding="0.5rem">
                            {cartQty}
                        </Box>
                        <IconButton size="small" color="inherit" onClick={() => handleAddToCart(product, cartQty + 1)}>
                            <AddOutlined />
                        </IconButton>
                    </Stack>
                )}
            </CardActions>
        </Card>

    );
}

export default ProductCard;


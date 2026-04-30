from fastapi import APIRouter, status

router = APIRouter(prefix="/products", tags=["products"])


@router.get("/")
def list_products():
    return [{"id": "product-1", "name": "Widget"}]


@router.get("/{product_id}")
def get_product(product_id: str):
    return {"id": product_id, "name": "Widget"}


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_product(payload: dict):
    return {"id": "product-2", **payload}


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: str):
    return None

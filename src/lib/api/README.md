# Offset Reporting API Documentation

This documentation outlines the available endpoints and functionality of the Offset Reporting API. The API provides programmatic access to data for commerce transactions, enabling informed decision-making based on comprehensive data analysis.

## Authentication

All API requests require authentication using the following headers:

```http
Content-Type: application/json
X-Auth-Token: YOUR_API_TOKEN
```

To obtain an API token, please contact developer@offsetpartners.com.

## Base URL

```
https://api.securecheckout.com/v1/reporting/
```

## Available Endpoints

### Addresses
- `GET /addresses/{id}` - Get a specific address
- `GET /addresses/{limit}/{page}` - Get paginated list of addresses

### Categories
- `GET /categories/{id}` - Get a specific category
- `GET /categories` - Get list of available categories
- `GET /categories/{id}/products` - Get products in a category

### Club Members
- `GET /club-members` - Get all club memberships
- `GET /club-members/{id}` - Get specific club member

### Clubs
- `GET /clubs/{id}` - Get a specific club
- `GET /clubs` - Get list of clubs

### Customers
- `GET /customers/{id}` - Get a specific customer
- `GET /customers/last-update/{start}/{end}/{limit}/{page}` - Get customers by last update time
- `GET /customers/created/{start}/{end}/{limit}/{page}` - Get customers by signup date
- `GET /customers/groups/{id}` - Get customers in a group

### Groups
- `GET /groups` - Get all groups
- `GET /groups/{id}` - Get a specific group

### Inventory
- `GET /inventory` - Get current inventory levels
- `GET /inventory/transactions/{start}/{end}` - Get inventory movements by date
- `GET /inventory/allocated` - Get unshipped inventory

### Orders
- `GET /orders/{id}` - Get a specific order
- `GET /orders/{id}/packages` - Get order packages
- `GET /orders/created/{start}/{end}` - Get orders by creation date
- `GET /orders/last-update/{start}/{end}/{limit}/{page}` - Get orders by last update time
- `GET /orders/type/{order_type}/{start}/{end}` - Get orders by type

### Order Accounting
- `GET /orders/nav/{start}/{end}` - Get orders for accounting

### Order Inventory
- `GET /orders/product-transactions/{start}/{end}` - Get product transactions by creation date

### Order Payments
- `GET /orders/payment-transactions/{start}/{end}` - Get payment transactions by creation date

### Products
- `GET /products/{sku}` - Get a product by SKU
- `GET /products/archived` - Get list of archived products
- `GET /products` - Get list of available products

### Wishes
- `GET /wishes` - Get list of active wishes
export const Messages = {
  AUTH: {
    LOGIN_SUCCESS: "Login successful.",
    LOGOUT_SUCCESS: "Logout successful.",
    REGISTER_SUCCESS: "Account created successfully.",
    REGISTER_FAILURE: "Account creation failed.",
    PASSWORD_RESET_MAIL_SENT: "Password reset link sent to your email.",
    PASSWORD_RESET_SUCCESS: "Password has been reset successfully.",
    TOKEN_REFRESH_SUCCESS: "Token refreshed successfully.",
    EMAIL_ALREADY_EXISTS: "Email already exists .",

    ERROR_INVALID_CREDENTIALS: "Invalid email or password.",
    ERROR_UNAUTHORIZED: "Unauthorized access.",
    ERROR_FORBIDDEN: "You do not have permission to perform this action.",
    ERROR_ACCOUNT_NOT_FOUND: "Account not found.",
    ERROR_ACCOUNT_DISABLED: "Your account is disabled. Contact support.",
    ERROR_TOKEN_EXPIRED: "Session expired, please login again.",
    INVALID_ROLE: "Invalid role specified.",
    CANNOT_ASSIGN_ROLE: "Cannot assign role during registration.",
  },

  USER: {
    PROFILE_FETCH_SUCCESS: "Profile retrieved successfully.",
    PROFILE_UPDATE_SUCCESS: "Profile updated successfully.",
    ADDRESS_ADDED: "Address added successfully.",
    ADDRESS_UPDATED: "Address updated successfully.",
    ADDRESS_DELETED: "Address deleted successfully.",

    ERROR_USER_NOT_FOUND: "User not found.",
    ERROR_EMAIL_EXISTS: "A user with this email already exists.",
  },

  PRODUCT: {
    PRODUCT_FETCH_SUCCESS: "Product retrieved successfully.",
    PRODUCTS_FETCH_SUCCESS: "Products fetched successfully.",
    PRODUCT_CREATED: "Product created successfully.",
    PRODUCT_UPDATED: "Product updated successfully.",
    PRODUCT_DELETED: "Product deleted successfully.",

    ERROR_PRODUCT_NOT_FOUND: "Product not found.",
    ERROR_PRODUCT_EXISTS: "A product with this name already exists.",
  },

  PRODUCT_REVIEW: {
    PRODUCT_REVIEW_SUCCESS: "Review added successfully. ",
    PRODUCT_REVIEW_ERROR: "Couldn't add review.",
    PRODUCT_REVIEW_DELETED: "Review deleted successfully.",
    PRODUCT_REVIEW_UPDATED: "Review updated successfully. ",
  },

  CATEGORY: {
    CATEGORY_FETCH_SUCCESS: "Category retrieved successfully.",
    CATEGORIES_FETCH_SUCCESS: "Categories fetched successfully.",
    CATEGORY_CREATED: "Category created successfully.",
    CATEGORY_UPDATED: "Category updated successfully.",
    CATEGORY_DELETED: "Category deleted successfully.",

    ERROR_CATEGORY_NOT_FOUND: "Category not found.",
    ERROR_CATEGORY_EXISTS: "A category with this name already exists.",
    ERROR_CATAGORY_CREATION: "Category creation failed .",
    ERROR_CATEGORY_FETCH: "Category fetch failed .",
  },

  CART: {
    ADDED_TO_CART: "Item added to cart.",
    UPDATED_CART: "Cart updated successfully.",
    REMOVED_FROM_CART: "Item removed from cart.",
    CART_CLEARED: "Cart cleared successfully.",
    CART_FETCH_SUCCESS: "Cart data retrieved successfully.",

    ERROR_CART_EMPTY: "Your cart is empty.",
    ERROR_STOCK_NOT_AVAILABLE: "Stock not available for this item.",
  },

  ORDER: {
    ORDER_PLACED: "Order placed successfully.",
    ORDER_UPDATED: "Order updated successfully.",
    ORDER_CANCELLED: "Order cancelled successfully.",
    ORDERS_FETCH_SUCCESS: "Orders fetched successfully.",
    ORDER_DETAILS_SUCCESS: "Order details retrieved successfully.",

    ERROR_ORDER_NOT_FOUND: "Order not found.",
    ERROR_ORDER_FAILED: "Order processing failed.",
  },

  PAYMENT: {
    PAYMENT_SUCCESS: "Payment completed successfully.",
    PAYMENT_FAILED: "Payment failed. Try again.",
    REFUND_SUCCESS: "Refund processed successfully.",

    ERROR_PAYMENT_NOT_FOUND: "Payment data not found.",
    ERROR_PAYMENT_GATEWAY: "Payment gateway error.",
  },

  ADMIN: {
    ADMIN_LOGIN_SUCCESS: "Admin login successful.",
    DASHBOARD_DATA_SUCCESS: "Dashboard data retrieved successfully.",

    ERROR_ADMIN_FORBIDDEN: "This action is allowed for admins only.",
  },

  VALIDATION: {
    REQUIRED_FIELDS_MISSING: "Required fields are missing.",
    INVALID_EMAIL: "Invalid email format.",
    INVALID_PHONE: "Invalid phone number.",
    INVALID_ID: "Invalid ID format.",
    INVALID_PASSWORD: "Password must have minimum 6 characters.",
  },

  SYSTEM: {
    SERVER_ERROR: "Internal server error. Please try again later.",
    DB_ERROR: "Database error occurred.",
    NOT_FOUND: "Resource not found.",
    BAD_REQUEST: "Bad request.",
    MAINTENANCE: "Server is under maintenance.",
  },

  ADDRESS: {
    ADDRESS_CREATED: "Address created successfully.",
    ADDRESS_UPDATED: "Address updated successfully.",
    ADDRESS_DELETED: "Address deleted successfully.",
    ERROR_ADDRESS_CREATION: "Address creation failed .",
    ADDRESS_FETCH_SUCCESS: "Address fetched successfully.",
    ERROR_ADDRESS_FETCH: "Address fetch failed .",
  },
};

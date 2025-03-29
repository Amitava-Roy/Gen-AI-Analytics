# **Gen AI Analytics - Mini Data Query Simulation Engine**

## **Overview**

This project is a lightweight backend service that simulates an AI-powered data query system. It processes **natural language queries** and converts them into **SQLite queries** to fetch mock sales data.

## **Temporary Database**

- The project uses **SQLite3** as an **in-memory database**.
- **Data is lost** when the server reloads.
- You need to **sign up** again and then **log in** to generate a new authentication token.

## **Authentication**

- Users must sign up and log in to receive a **Bearer Token**.
- All queries must include the **Authorization header** with the token.

## **Endpoints**

### **1. User Authentication**

#### `POST /users/signUp`

- Registers a new user.
- Example request in Postman:
  - **Method:** `POST`
  - **URL:** `http://localhost:3000/users/signUp`
  - **Headers:** `Content-Type: application/json`
  - **Body (raw JSON):**
    ```json
    {
      "username": "testuser",
      "password": "securepassword"
    }
    ```

#### `POST /users/login`

- Logs in an existing user and returns a **Bearer Token**.
- Example request in Postman:
  - **Method:** `POST`
  - **URL:** `http://localhost:3000/users/login`
  - **Headers:** `Content-Type: application/json`
  - **Body (raw JSON):**
    ```json
    {
      "username": "testuser",
      "password": "securepassword"
    }
    ```
- Example response:
  ```json
  {
    "token": "your-auth-token"
  }
  ```

### **2. Query Processing** _(Requires Authorization)_

#### `POST /query`

- Accepts a **natural language query** and converts it into an **SQLite query**.
- Example request in Postman:
  - **Method:** `POST`
  - **URL:** `http://localhost:3000/query`
  - **Headers:**
    - `Authorization: Bearer <token>`
    - `Content-Type: application/json`
  - **Body (raw JSON):**
    ```json
    {
      "query": "What is the total sales?"
    }
    ```

### **3. Query Explanation** _(Requires Authorization)_

#### `POST /explain`

- Returns a **breakdown of how the query is processed**.
- Example request in Postman:
  - **Method:** `POST`
  - **URL:** `http://localhost:3000/explain`
  - **Headers:**
    - `Authorization: Bearer <token>`
    - `Content-Type: application/json`
  - **Body (raw JSON):**
    ```json
    {
      "query": "What is the total sales?"
    }
    ```

### **4. Query Validation** _(Requires Authorization)_

#### `POST /validate`

- Checks if the given query is **feasible and correct**.
- Example request in Postman:
  - **Method:** `POST`
  - **URL:** `http://localhost:3000/validate`
  - **Headers:**
    - `Authorization: Bearer <token>`
    - `Content-Type: application/json`
  - **Body (raw JSON):**
    ```json
    {
      "query": "What is the total sales?"
    }
    ```

## **Example Mock Data**

The application uses **sales data** as mock data stored in SQLite:

```sql
CREATE TABLE sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    price INTEGER,
    date TEXT
);
```

## **How Queries Work**

- Queries are mapped from **natural language** to **SQLite syntax**.
- Example:
  ```json
  {
    "query": "What is the total sales today?"
  }
  ```
  Converts to:
  ```sql
  SELECT SUM(price) FROM sales WHERE date = '2025-03-28';
  ```

## **Valid Queries**

- Total sales
- Average sales
- Maximum/minimum sales
- Number of sales transactions
- Sales for specific time periods (today, last month, specific year)
- Check the **codebase** for all supported queries.

## **Setup Instructions**

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd <project-folder>
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run the server:
   ```sh
   npm start
   ```

---

🚀 **Enjoy querying your mock AI analytics engine!**

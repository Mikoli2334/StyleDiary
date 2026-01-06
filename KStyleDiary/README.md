
# KStyle Diary – Full Stack Web Application

KStyle Diary is a full-stack web application that allows users to create and manage fashion looks, assign cosmetic products to them, and share selected looks publicly.  
The project demonstrates CRUD operations, authentication, authorization, many-to-many relationships, pagination, and internationalization.

---

## Tech Stack
- ASP.NET Core Web API
- Entity Framework Core (Code First)
- SQLite
- Swagger (OpenAPI)

## Database

### Database type
SQLite is used as the database.

### Connection string
The database connection string is stored in `appsettings.json`:


{
  "ConnectionStrings": {
    "Default": "Data Source=KStyleDiary.db"
  }
}
## Changing database location

To change the database location, update the value of `"Default"` in
`appsettings.json`.

Examples:
- `Data Source=./db/KStyleDiary.db`
- `Data Source=/absolute/path/KStyleDiary.db`

---

## Database structure

The application uses three connected tables:

- **Looks**
- **Products**
- **LookProducts**

`LookProducts` represents a many-to-many relationship and contains
additional fields:
- `UsageNote`
- `Rating`

---

## Database scripts

Database scripts are located in the `Data/db` directory:

- `create-db.sql` — creates all database tables
- `sample-data.sql` — inserts sample product data

---

## Migrations

The project uses **EF Core Code First**.

Initial migration:
- `20251225170334_InitialCreate`

The database can be created either:
- automatically via EF Core migrations, or
- manually using `create-db.sql`

---

## How to run the project

1. Restore NuGet packages
2. Run the application (`dotnet run` or via IDE)
3. Open Swagger UI:
   - `/swagger`

---

## API functionality

Implemented REST endpoints include:

- Create, update, delete products
- Create, update, delete looks
- Add products to a look
- Remove products from a look
- Get lists of products and looks
- Get detailed look view with related products

---

## Validation

Data validation is implemented on the backend using:

- **DataAnnotations**
- Automatic model validation via `[ApiController]`

Invalid input data returns **HTTP 400** responses.

---

## Sample data

After the database is created, sample data can be inserted by executing:

- `Data/db/sample-data.sql`


## Technologies

### Frontend
- React
- Vite
- React Router
- i18next (internationalization)
- Fetch API

### Backend
- ASP.NET Core Web API
- Entity Framework Core

### Database
- SQLite

---

## Application Features

### General
- Single Page Application (SPA)
- Client-side and server-side validation
- Pagination of lists
- Internationalization (English / Polish)

### Authentication & Authorization
- User registration
- User login
- Role-based access control

### User Roles
- **Guest**
    - View public looks
- **User**
    - Create, edit, delete own looks
    - Add/remove products to/from own looks
    - Decide if a look is public or private
- **Admin**
    - Create, edit, delete products

### Data Model
- **Users**
- **Looks**
- **Products**
- **LookProducts** (many-to-many relationship with additional fields: `UsageNote`, `Rating`)

---

## Database Structure

- At least 3 tables
- Many-to-many relationship between Looks and Products
- Different data types (string, number, boolean, datetime)

Database scripts included:
- `create_db.sql` – database schema
- `sample_data.sql` – example data

---

## How to Run the Project

### Backend (ASP.NET Core)

1. Open the backend project in Visual Studio or Rider
2. Update database connection string (if needed) in:

```json
appsettings.json
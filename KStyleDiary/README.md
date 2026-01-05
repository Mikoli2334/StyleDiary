# KStyleDiary

University project for the subject **Internet Technologies**.  
Level 1 implementation.

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


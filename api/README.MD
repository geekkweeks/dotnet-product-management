1. Clone the Repository: If you haven't already, clone the repository to your local machine.
   git clone <repository-url>
   cd product_app/api

2. (steps 2- 3 are Optional - if you already installed redis on your local machine) Install Docker: Ensure Docker is installed on your machine. You can download and install Docker from Docker's official website.

3. Run Redis in Docker: Pull the Redis Docker image and run a Redis container.
   docker pull redis
   docker run -d --name redis-container -p 6379:6379 redis

4. Set Up the Database: Ensure you have SQLite installed. The project uses SQLite as the database, and the connection string is already configured in appsettings.json.

5. Restore NuGet Packages: Restore the NuGet packages for the solution
   dotnet restore

6. Apply Migrations: Apply the Entity Framework Core migrations to set up the database schema.
   dotnet ef database update --project src/Entities --startup-project src/ProductManagement.Api

7. Run the Application: Run the application using the .NET CLI.
   dotnet run --project src/ProductManagement.Api

8. Access the Application: Once the application is running, you can access it in your browser at the URL specified in the launchSettings.json file, typically http://localhost:5172 or https://localhost:7262

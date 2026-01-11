# Design & Supply Microservices Platform

This project is a microservices-based application connecting Designers and Suppliers. It allows designers to post requests and suppliers to submit quotes, managing the entire workflow from design to shipment.

---

## 🚀 Startup Guidelines

Follow these steps to run the application locally:

1.  **Select Startup Item:** Set the startup project to `docker-compose` in your IDE.
2.  **Run:** Click on the **Docker Compose run button**.
3.  **Build:** Wait for the entire system to build.
4.  **API Gateway:** Once the build is ready, the **ApiGateway Swagger** documentation will automatically open in a web browser tab.
5.  **Access Frontend:** In the address bar of that same tab (or a new one), type `http://localhost:3000/` to access the frontend application.
6.  **Verify:** You can start by adding a design using the **"Add new design"** button.

---

## 👥 User Functionalities

### 🎨 Designers

- **Post Designs:** Create design requests containing a title, category, description, and attached files (Image or PDF).
- **Browse Designs:** View a list or feed of their posted designs.
- **Review Quotes:** View quotes submitted by suppliers for specific designs.
- **Place Orders:** Accept a supplier’s quote. This action automatically converts the quote into an **active order**.
- **Track Status:** Monitor the order status to see when the supplier has shipped the items.

### 🏭 Suppliers

- **Browse Requests:** View design requests posted by designers.
- **Submit Quotes:** Send quotes for design requests, including the price and a description.
- **View Quotes:** View the history of all quotes submitted.
- **View Orders:** Identify which quotes have been accepted and converted into placed orders within the "View Quotes" section.
- **Update Shipment:** Mark an order as **"Shipped"** once the items have been dispatched to the designer.

---

## 🛠️ Technical Stack

### Frontend

- **Library:** React
- **UI Library:** Material UI
- **HTTP Client:** Axios

### Backend

- **Framework:** ASP.NET Core 8.0 Web API (C#)
- **Architecture:** Microservices
- **Services Implemented:**
  - **API Gateway:** YARP (Yet Another Reverse Proxy)
  - **Design Service**
  - **Quote Service**
  - **Order Service**
  - **Communication Service:** (Conceptual/Planned for negotiations)

### Data and Storage

- **Database:** In-memory storage using data structures (non-persistent).
- **File Storage:** Local File System (Images and PDFs are saved to/served from `wwwroot` folder).

### Infrastructure and DevOps

- **Containerization:** Docker
- **Orchestration:** Docker Compose
- **IDE Support:** Visual Studio and VS Code
- **Documentation:** Swagger (Built-in with ASP.NET Core for API testing).

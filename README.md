# Customer Relationship Management (CRM) System with Node.js and Express.js

## Prerequisites:
Node.js
Express
MongoDB
React
JavaScript

## Functionalities:
User Authentication and Authorization
Companies that want to use the CRM Portal can register on the application and access the functionalities by signing in.
JWT, JsonWebToken and bcryptjs are some packages used for implementing smooth authorization.
Context API helps to maintain the state of the user that has logged in.

## Adding Customers:
The company can easily add new customers and details about them.
A form is created with the post method to implement this functionality. Status can be selected from a drop down.
The page navigates to the all customers page when a customer is created.

## Customer Management:
Implementing functionalities to manage customer data such as name, email, phone number, and address. 
Allow users to add, view, update, and delete customer records.

# Lab 2

<code>[Посилання на коміт](https://github.com/PudchenkoAlexei/CRM/commit/3c6c8d3432909390c1a6431a749ab2278d3c9e64)</code>

стиль коду - Airbnb

# Lab 3 (ці діаграми є розширеною версією застосунку а не того що зараз реалізовано)

CRM architecture diagram

```mermaid
flowchart TB
    subgraph Client["Client Layer"]
        WebApp["Web Application"]
        MobileApp["Mobile App"]
        Desktop["Desktop App"]
    end

    subgraph API["API Gateway Layer"]
        Gateway["API Gateway"]
        RateLimit["Rate Limiter"]
        Logger["Request Logger"]
        subgraph Security["Security Layer"]
            JWT["JWT Authentication"]
            CORS["CORS Handler"]
            Validator["Request Validator"]
            Authorization["Role-based Authorization"]
        end
    end

    subgraph Core["Core Services Layer"]
        subgraph CustomerModule["Customer Management Module"]
            CustomerService["Customer Service"]
            CustomerController["Customer Controller"]
            CustomerEvents["Customer Event Handler"]
            LeadTracking["Lead Tracking"]
        end
        
        subgraph UserModule["User Management Module"]
            UserService["User Service"]
            UserController["User Controller"]
            AuthService["Auth Service"]
            CompanyProfile["Company Profile"]
        end
        
        subgraph AnalyticsModule["Analytics Module"]
            AnalyticsService["Analytics Service"]
            ReportGenerator["Report Generator"]
            Dashboard["Dashboard Analytics"]
            Forecasting["Sales Forecasting"]
        end
        
        subgraph CommunicationModule["Communication Module"]
            EmailService["Email Service"]
            NotificationService["Notification Service"]
            SMSService["SMS Service"]
            Templates["Message Templates"]
        end

        subgraph WorkflowModule["Workflow Module"]
            TaskManager["Task Manager"]
            Calendar["Calendar"]
            Reminders["Reminders"]
            Pipeline["Sales Pipeline"]
        end
    end

    subgraph Data["Data Layer"]
        subgraph Cache["Caching Layer"]
            Redis["Redis Cache"]
            MemCache["Memory Cache"]
        end
        
        subgraph DB["Database Layer"]
            MongoDB["MongoDB Primary"]
            MongoReplica["MongoDB Replica"]
        end
        
        subgraph Storage["Document Storage"]
            S3["AWS S3"]
            LocalStorage["Local Storage"]
        end
    end

    subgraph External["External Services"]
        EmailProvider["Email Provider"]
        SMSProvider["SMS Gateway"]
        CloudStorage["Cloud Storage"]
        Analytics["Analytics Platform"]
        Calendar3rd["Calendar Integration"]
    end

    %% Client to API connections
    WebApp --> Gateway
    MobileApp --> Gateway
    Desktop --> Gateway
    
    %% API Layer connections
    Gateway --> RateLimit
    Gateway --> Logger
    Gateway --> Security
    
    %% Security to Core connections
    Security --> CustomerModule
    Security --> UserModule
    Security --> AnalyticsModule
    Security --> WorkflowModule
    
    %% Core Module interconnections
    CustomerModule --> CommunicationModule
    CustomerModule --> AnalyticsModule
    CustomerModule --> WorkflowModule
    UserModule --> CommunicationModule
    WorkflowModule --> CommunicationModule
    
    %% Core to Data connections
    CustomerModule --> Cache
    CustomerModule --> DB
    UserModule --> DB
    AnalyticsModule --> DB
    AnalyticsModule --> Cache
    WorkflowModule --> DB
    
    %% External service connections
    CommunicationModule --> EmailProvider
    CommunicationModule --> SMSProvider
    Storage --> CloudStorage
    AnalyticsModule --> Analytics
    WorkflowModule --> Calendar3rd

    %% Styling
    classDef module fill:#f9f,stroke:#333,stroke-width:2px
    classDef service fill:#bbf,stroke:#333,stroke-width:2px
    classDef database fill:#dfd,stroke:#333,stroke-width:2px
    
    class CustomerModule,UserModule,AnalyticsModule,CommunicationModule,WorkflowModule module
    class Gateway,RateLimit,Logger,JWT,CORS,Validator,Authorization service
    class MongoDB,MongoReplica,Redis,MemCache database
```

CRM System ER Diagram

```mermaid
erDiagram
    COMPANY ||--o{ USER : has
    COMPANY ||--o{ CUSTOMER : manages
    USER ||--o{ CUSTOMER : manages
    USER ||--o{ TASK : owns
    CUSTOMER ||--o{ TASK : has
    CUSTOMER ||--o{ COMMUNICATION : receives
    USER ||--o{ COMMUNICATION : sends
    TASK ||--o{ REMINDER : contains
    CUSTOMER ||--o{ PIPELINE_STAGE : belongs_to
    COMPANY ||--o{ TEMPLATE : owns
    TEMPLATE ||--o{ COMMUNICATION : uses
    
    COMPANY {
        string _id PK "ObjectId"
        string name "required"
        string email "required"
        string phone "required"
        string address
        string subscription_plan
        datetime created_at
        datetime updated_at
    }
    
    USER {
        string _id PK "ObjectId"
        string company_id FK "ref: Company"
        string username "unique, required"
        string email "required"
        string password "required"
        string role "required"
        string phone
        boolean is_active
        datetime last_login
        datetime created_at
        datetime updated_at
    }
    
    CUSTOMER {
        string _id PK "ObjectId"
        string company_id FK "ref: Company"
        string assigned_to FK "ref: User"
        string name "required"
        string email "required"
        string phone "required"
        string status "default: lead"
        string source
        number lead_score
        datetime last_contact
        string notes
        datetime created_at
        datetime updated_at
    }

    TASK {
        string _id PK "ObjectId"
        string user_id FK "ref: User"
        string customer_id FK "ref: Customer"
        string title "required"
        string description
        string priority
        string status
        datetime due_date
        datetime completed_at
        datetime created_at
        datetime updated_at
    }

    COMMUNICATION {
        string _id PK "ObjectId"
        string customer_id FK "ref: Customer"
        string user_id FK "ref: User"
        string template_id FK "ref: Template"
        string type "email|sms|notification"
        string status
        string content "required"
        datetime sent_at
        datetime created_at
    }

    TEMPLATE {
        string _id PK "ObjectId"
        string company_id FK "ref: Company"
        string name "required"
        string type "email|sms"
        string subject
        string content "required"
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    REMINDER {
        string _id PK "ObjectId"
        string task_id FK "ref: Task"
        string type "required"
        datetime remind_at "required"
        boolean is_sent
        datetime created_at
    }

    PIPELINE_STAGE {
        string _id PK "ObjectId"
        string customer_id FK "ref: Customer"
        string stage_name "required"
        number stage_order
        string status
        datetime moved_at
        string notes
        datetime created_at
        datetime updated_at
    }
```
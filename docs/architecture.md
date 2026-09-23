# SellSpace Application Architecture

## 1. System Overview

SellSpace is a web marketplace built with:

- Next.js — frontend
- Laravel — backend/API
- PostgreSQL — database

Architecture:

Browser
↓ HTTPS
Next.js
↓ HTTP/HTTPS + JSON API
Laravel
↓ SQL
PostgreSQL

## 2. Component Responsibilities

### Next.js

Responsible for:

- User interface
- Client-side interactions
- Page rendering
- Form presentation
- Calling the Laravel API

Next.js does not connect directly to PostgreSQL.

### Laravel

Responsible for:

- API endpoints
- Authentication
- Authorization
- Validation
- Business logic
- Database access
- Application security

Laravel is the backend authority.

### PostgreSQL

Responsible for:

- Persistent application data
- Data integrity
- Relationships
- Constraints
- Transactions

The database is accessed through Laravel.

## 3. Main Application Domains

SellSpace is divided conceptually into:

- Identity & Access
- Marketplace
- Catalog
- Shopping
- Orders
- Payments
- Reviews
- Notifications
- Administration

These domains will be implemented incrementally.

## 4. Authentication and Authorization

Authentication determines who the user is.

Authorization determines what the authenticated user is allowed to do.

Authentication and authorization are handled by the backend.

The frontend may adapt its UI according to the authenticated user's state and permissions, but frontend checks are not considered a security boundary.

## 5. Data Flow

A typical request follows:

Browser
↓
Next.js
↓
Laravel API
↓
Authentication / Authorization
↓
Business Logic
↓
PostgreSQL
↓
Laravel
↓
Next.js
↓
Browser

## 6. Security Boundary

The primary application trust boundary is the Laravel backend.

Clients must not be trusted to enforce security rules.

Sensitive operations must be validated and authorized by Laravel.

## 7. Environments

SellSpace will use separate environments:

- Development
- Staging
- Production

Environment-specific configuration must be supplied through environment variables.

Secrets must not be committed to Git.

## 8. API Direction

The frontend communicates with the backend through HTTP/HTTPS APIs.

The frontend does not access the PostgreSQL database directly.

API contracts will be versioned when appropriate, for example:

/api/v1/...

## 9. Implementation Strategy

The architecture is intentionally established at a high level.

Detailed domain architecture, database models, permissions, and business rules will be defined as the corresponding features are implemented.

The next major feature is:

Users / Authentication / Roles / Authorization / Security
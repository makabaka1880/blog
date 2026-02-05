---
title: Building Teacharlie Backend
description: This article is not about cryptography, it's just a guide to applying various best practice security APIs
collection: teacharlie
author: [0]
createTime: 2025-08-12
updateTime: 2025-08-12
---

## Introduction
As an extremely bored high school student-to-be, the summer after the high school entrance exam felt a bit boring; so I decided to go to a hackathon to bully the kids (just kidding

In short, our project backend needs a user system, but I've never written one :(

So after a week of hard work, I managed to learn about various authentication and authorization concepts like JWT, OAuth2, Session, etc., and gained some understanding of how to design a user system.

Next is the implementation.

## Database

We adopted PostgreSQL as our backend database, mainly because of its superior performance, powerful features, and good community support. At the same time, PostgreSQL also provides rich data types and extension features that can meet our project's needs. For the HTTP Server-Side, we used Server-Side Swift (old Apple user (sad) and paired it with the Vapor framework and Fluent as ORM.

First is the most basic part of the user system, a **user table**.

```sql
CREATE EXTENSION IF NOT EXISTS pscrypto;

CREATE TABLE users (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
);
```

Next are some attributes that users generally have

```sql
CREATE EXTENSION IF NOT EXISTS pscrypto;

CREATE TABLE users (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,  -- Username
    email TEXT NOT NULL UNIQUE,  -- Email
);
```

Then comes a very important point, user **authentication**

We usually use a **password** to verify a user's identity, and the most natural method is to store it directly in the database

```sql
CREATE EXTENSION IF NOT EXISTS pscrypto;

CREATE TABLE users (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL, -- here
);
```

But now there's a problem: passwords are stored in the database in plaintext, and if leaked, the consequences would be disastrous, especially for the administrator's password; what to do?

```sql
CREATE EXTENSION IF NOT EXISTS pscrypto;

CREATE TABLE users (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_encrypted TEXT NOT NULL,
);
```

Let's look back at the password verification process:
1. User enters password
2. Frontend sends back the password to be compared
3. Backend determines if it's the original password

We'll find one thing: passwords only need to satisfy one verification condition, but in fact this doesn't necessarily require *the original password to equal the password sent by the frontend*!

So how can we take advantage of this? Let's open a cryptography textbook and see a very important concept: hashing algorithms.

Hashing algorithms are core to ensuring secure password storage and verification. They are one-way functions that convert input (such as a password) into a fixed-length output (hash value). Most importantly, the hashing process is irreversible, meaning the original password cannot be recovered from the hash value. Therefore, we can use hashing to ensure that even if the database is leaked, attackers cannot obtain users' plaintext passwords.

- **User enters password:** The user enters their password when logging in.
- **Frontend sends password hash:** The frontend sends the password hash to the backend, rather than sending the plaintext password. The frontend can first process the password using a client-side hashing algorithm to ensure that the password plaintext is not exposed during network transmission.
- **Backend verifies password:** After receiving the password hash, the backend compares the hash entered by the user with the hash stored in the database. If the hashes match, the password is correct and authentication is successful.

So we've passed the password hurdle

```sql
-- Add some other stuff
CREATE TYPE status AS ENUM ('ok', 'banned', 'down');
CREATE TYPE user_role AS ENUM ('user', 'admin', 'moderator');

CREATE OR REPLACE FUNCTION gen_identifier(
    prefix TEXT DEFAULT 'user_',
    table_name TEXT DEFAULT 'users',
    column_name TEXT DEFAULT 'username'
)
RETURNS TEXT AS $$
DECLARE
    chars TEXT[] := ARRAY['0','1','2','3','4','5','6','7','8','9',
                          'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
                          'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    base TEXT := '';
    new_identifier TEXT;
    identifier_exists BOOLEAN;
    query TEXT;
    i INTEGER;
BEGIN
    LOOP
        -- Reset base for each attempt
        base := '';
        -- Generate an 11-character random string
        FOR i IN 0..10 LOOP
            base := base || chars[1 + FLOOR(RANDOM() * array_length(chars, 1))::INTEGER];
        END LOOP;

        new_identifier := prefix || base;

        -- Check for uniqueness using dynamic SQL
        query := format('SELECT EXISTS(SELECT 1 FROM %I WHERE %I = %L)', table_name, column_name, new_identifier);
        EXECUTE query INTO identifier_exists;

        IF NOT identifier_exists THEN
            RETURN new_identifier;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE DEFAULT gen_identifier('user_', 'users', 'username'),
    pass_hask TEXT NOT NULL,
    user_role user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status status NOT NULL DEFAULT 'ok',
    avatar_url TEXT
);
```


## Implementation

Our application layer uses Swift Vapor. First, let's write an ORM:

```swift

import Vapor
import Fluent

final class User: Model, Content, @unchecked Sendable {
    static let schema = "users"

    // Fields
    @ID(key: .id)
    var id: UUID?

    @Field(key: "email")
    var email: String

    @Field(key: "username")
    var username: String

    @Field(key: "pass_hask")
    var passHash: String

    @Enum(key: "user_role")
    var userRole: UserRole

    @Enum(key: "user_status")
    var userStatus: UserStatus

    @Field(key: "created_at")
    var createdAt: Date

    @Field(key: "avatar_url")
    var avatarUrl: String?

    @OptionalChild(for: \.$user)
    var userData: UserData?

    init() {}

    init(
        id: UUID? = nil,
        email: String,
        username: String,
        passHash: String,
        userRole: UserRole = .user,
        userStatus: UserStatus = .ok,
        createdAt: Date = Date(),
        avatarUrl: String? = nil
    ) {
        self.id = id
        self.email = email
        self.username = username
        self.passHash = passHash
        self.userRole = userRole
        self.userStatus = userStatus
        self.createdAt = createdAt
        self.avatarUrl = avatarUrl
    }
}
```

Then let's implement the comparison mechanism, we chose the Bcrypt algorithm

```swift
import Vapor

class EncryptionManager {
    static func hashPassword(_ pass: String) throws -> String {
        return try Bcrypt.hash(pass)
    }

    static func verifyPassword(_ plaintext: String, hash: String) throws -> Bool {
        return try Bcrypt.verify(plaintext, created: hash)
    }
}
```
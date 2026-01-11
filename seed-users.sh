#!/bin/bash
# Seed script to add sample users to the database

echo "👥 Seeding sample users..."
echo ""

# Sample users
curl -X POST http://localhost:5050/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Robbie Szekely",
    "email": "robbie@example.com",
    "department": "Engineering",
    "isActive": true
  }'

echo ""

curl -X POST http://localhost:5050/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "department": "Product",
    "isActive": true
  }'

echo ""

curl -X POST http://localhost:5050/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "department": "Design",
    "isActive": true
  }'

echo ""

curl -X POST http://localhost:5050/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bob Johnson",
    "email": "bob@example.com",
    "department": "Marketing",
    "isActive": true
  }'

echo ""
echo ""
echo "✅ Sample users created!"
echo ""
echo "Fetching all users:"
curl -s http://localhost:5050/users/active | json_pp || curl -s http://localhost:5050/users/active
echo ""

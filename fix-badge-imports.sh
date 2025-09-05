#!/bin/bash

# Fix all Badge imports to use the UI index
find src -name "*.tsx" -type f -exec sed -i 's|from "@/components/ui/badge"|from "@/components/ui"|g' {} +
find src -name "*.ts" -type f -exec sed -i 's|from "@/components/ui/badge"|from "@/components/ui"|g' {} +

echo "Fixed all Badge imports to use UI index"
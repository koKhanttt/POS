# Seeders

This directory contains data seeding scripts for the POS system.

## Admin Seeder

To seed the default admin user, run:

```bash
npm run seed:admin
```

This will create an admin user with:
- Username: Admin
- Email: admin@pos.com
- Password: admin123
- Role: superadmin

The seeder checks if an admin already exists to prevent duplicates.
-----------------------------Type Script Errors or Linting--------------------------
## 1 Checks TypeScript errors without building
    npx tsc --noEmit


---

--------------------PRISMA ORM TROUBLESHOOTING---------------------------

## 2 Run this when you edit schema.prisma file and create a new migration file

    npx prisma migrate dev --name your_migration_name

## 3 For production/deployed database run

    npx prisma migrate dev

    -----------or------------

    npx prisma migrate deploy

    -------check status------

    npx prisma migrate status

## 4 After schema changes, also regenerate the Prisma client if needed

    npx prisma generate

## 5 Remove old prisma cache

    Remove-Item -Recurse -Force .next

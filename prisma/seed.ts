import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();
const permissions = [
  { key: "bookings:read", name: "Read bookings" },
  { key: "bookings:write", name: "Manage bookings" },
  { key: "bookings:delete", name: "Delete bookings" },
  { key: "pricing:read", name: "Read pricing" },
  { key: "pricing:write", name: "Manage pricing" },
  { key: "users:read", name: "Read users" },
  { key: "users:write", name: "Manage users" },
  { key: "reports:read", name: "Read reports" },
  { key: "settings:read", name: "Read settings" },
  { key: "settings:write", name: "Manage settings" },
];

async function main() {
  const createdPermissions = await Promise.all(
    permissions.map((p) => prisma.permission.upsert({ where: { key: p.key }, update: {}, create: p })),
  );

  const role = await prisma.role.upsert({
    where: { name: "main-admin" },
    update: {},
    create: { name: "main-admin" },
  });

  await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });
  await prisma.rolePermission.createMany({
    data: createdPermissions.map((p) => ({ roleId: role.id, permissionId: p.id })),
    skipDuplicates: true,
  });

  const adminEmail = process.env.MAIN_ADMIN_ID ?? "admin@comparemyprking.co.uk";
  const adminPassword = process.env.MAIN_ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail.toLowerCase() },
    update: { roleId: role.id, passwordHash },
    create: { email: adminEmail.toLowerCase(), name: "Main Admin", passwordHash, roleId: role.id },
  });
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());

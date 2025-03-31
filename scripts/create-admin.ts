import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@example.com';
  const password = 'admin123'; // Change this to your desired password
  const name = 'Admin User';

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name,
        password: hashedPassword,
        role: 'admin',
      },
    });

    console.log('Admin user created/updated successfully:', user);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // 1️⃣ Create Users
    const user1 = await prisma.user.create({
        data: {
            username: "Akash",
            email: "akash@gmail.com",
            mobileNumber: "911234567890",
        },
    });

    const user2 = await prisma.user.create({
        data: {
            username: "Aditi",
            email: "aditi@gmail.com",
            mobileNumber: "919876543210",
        },
    });

    console.log("✅ Users Created:", { user1, user2 });

    // 2️⃣ Create a Chat Message
    const message = await prisma.chat.create({
        data: {
            fromId: user1.id, // Alice → Sender
            toId: user2.id, // Bob → Receiver
            message: "Hey Aditi, how are you?",
            readStatus: "UNREAD",
        },
    });

    console.log("✅ Chat Message Created:", message);
}

main()
    .catch((e) => {
        console.error("Error seeding database:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

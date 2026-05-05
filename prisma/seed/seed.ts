import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      id: "2754278e-a42e-47ce-9a34-9b9390722d6c",
      name: "Beatriz",
      imageUrl: "https://i.imgur.com/DjUm8uy.png",
      username: "bea_tech_73",
      createdAt: "2026-04-15T20:46:51.840Z",
      password: "senha123",
    },
    {
      id: "1b6ce562-b10e-4e74-a93a-02db5248c07c",
      name: "Rodrigo",
      imageUrl: "https://i.imgur.com/BVFh3UO.png",
      username: "rodrigo_sql_73",
      createdAt: "2026-04-15T20:44:27.336Z",
      password: "senha123",
    },
    {
      id: "fc822af7-9882-4689-b6e3-0d91440dc8d2",
      name: "Tiago",
      imageUrl: "https://imgur.com/JZM84Hy.png",
      username: "tiago_java_50",
      createdAt: "2026-04-15T20:43:23.537Z",
      password: "senha123",
    },
    {
      id: "3dbd9304-29f9-4d9f-ba82-3a41b003c1c8",
      name: "Fernanda",
      imageUrl: "https://imgur.com/iwountE.png",
      username: "fer_backend_94",
      createdAt: "2026-04-15T20:45:29.140Z",
      password: "senha123",
    },
    {
      id: "910d6a6b-fe54-4b2d-81da-58ccbf90adce",
      name: "andrea",
      imageUrl: "https://imgur.com/8gPCzkb.png",
      username: "angel",
      createdAt: "2026-04-28T00:36:23.632Z",
      password: "senha123",
    },
    {
      id: "fb9d1e4b-bad6-4188-8b19-5aab75f11cfb",
      name: "Edinalva de Jesus Loureiro Pessoa",
      imageUrl: null,
      username: "Edinalva",
      createdAt: "2026-04-30T16:11:59.100Z",
      password: "senha123",
    },
    {
      id: "f168452f-cfe8-4c30-b2b9-ac1955f9de6b",
      name: "Emerson Pessoa da Silva",
      imageUrl: "https://github.com/emersonpessoa01.png",
      username: "emersonpessoa",
      createdAt: "2026-04-13T21:22:48.112Z",
      password: "senha123",
    },
    {
      id: "adf92bb5-5f12-4f95-a690-8ef9ceed2a96",
      name: "growdev",
      imageUrl: null,
      username: "growdev",
      createdAt: "2026-05-05T14:03:41.058Z",
      password: "senha123",
    },
  ];

  console.log("Iniciando seed de usuários com hash de senha...");

  for (const user of users) {
    // Gerando o hash da senha para que o login funcione
    const hashedPassword = await bcrypt.hash(user.password, 10);

    await prisma.user.upsert({
      where: {
        username: user.username,
      },
      update: {
        password: hashedPassword, // Atualiza para hash caso já exista
      },
      create: {
        id: user.id,
        name: user.name,
        imageUrl: user.imageUrl,
        username: user.username,
        password: hashedPassword,
        createdAt: new Date(user.createdAt),
      },
    });
  }
}

main()
  .then(async () => {
    console.log("🌱 Seed finalizado com sucesso!");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Erro durante o seed:");
    console.error(e);
    await prisma.$disconnect();
    throw e;
  });

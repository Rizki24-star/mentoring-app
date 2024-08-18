// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.tag.createMany({
    data: [
      { name: "JavaScript" },
      { name: "TypeScript" },
      { name: "Python" },
      { name: "Java" },
      { name: "C#" },
      { name: "C++" },
      { name: "Ruby" },
      { name: "PHP" },
      { name: "Swift" },
      { name: "Kotlin" },
      { name: "Go" },
      { name: "Rust" },
      { name: "Scala" },
      { name: "Elixir" },
      { name: "Dart" },
      { name: "R" },
      { name: "MATLAB" },
      { name: "SQL" },
      { name: "GraphQL" },
      { name: "HTML" },
      { name: "CSS" },
      { name: "Sass" },
      { name: "Less" },
      { name: "Node.js" },
      { name: "React" },
      { name: "Angular" },
      { name: "Vue.js" },
      { name: "Svelte" },
      { name: "Next.js" },
      { name: "Nuxt.js" },
      { name: "Gatsby" },
      { name: "Express" },
      { name: "Django" },
      { name: "Flask" },
      { name: "Spring Boot" },
      { name: "Laravel" },
      { name: "Rails" },
      { name: "ASP.NET" },
      { name: "Electron" },
      { name: "Cordova" },
      { name: "Ionic" },
      { name: "React Native" },
      { name: "Flutter" },
      { name: "TensorFlow" },
      { name: "PyTorch" },
      { name: "Keras" },
      { name: "Docker" },
      { name: "Kubernetes" },
      { name: "Terraform" },
      { name: "Ansible" },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

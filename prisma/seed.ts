import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Delete existing data
  await prisma.feature.deleteMany();
  await prisma.tier.deleteMany();
  await prisma.subBundle.deleteMany();
  await prisma.bundle.deleteMany();

  // Create the Defense Security Suite bundle
  const defenseSuite = await prisma.bundle.create({
    data: {
      name: "DEFENSE SECURITY SUITE",
      description: "Multi-Domain Threat Detection & Response for Land, Air, and Sea",
      subBundles: {
        create: [
          {
            name: "BorderShield Ground Security Package",
            tiers: {
              create: [
                {
                  name: "Core",
                  price: "$599/month",
                  features: {
                    create: [
                      { name: "Intruder Detection" },
                      { name: "Fence Jumping / Crawling Recognition" },
                      { name: "Loitering & Vehicle Detection" },
                      { name: "Night Vision & Thermal AI Support" }
                    ]
                  }
                },
                {
                  name: "Plus",
                  price: "$999/month",
                  features: {
                    create: [
                      { name: "All Core features" },
                      { name: "Weapon Detection" },
                      { name: "Face Recognition (Blacklist)" },
                      { name: "Vandalism Detection" },
                      { name: "Gunshot & Fence Tampering Detection (Audio)" },
                      { name: "Security Guard Presence Tracking" }
                    ]
                  }
                },
                {
                  name: "Max",
                  price: "$1,999/month",
                  features: {
                    create: [
                      { name: "All Plus & Core features" },
                      { name: "Multi-Sensor Fusion (Visual + IR + Audio)" },
                      { name: "Predictive Intrusion Mapping" },
                      { name: "Panic Phrase Detection" },
                      { name: "Command Dashboard Integration" },
                      { name: "Tarmac & Road Defect Detection" }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
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

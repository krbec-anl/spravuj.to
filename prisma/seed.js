import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PROPERTIES = [
  {
    name: 'Tyršova 1872', city: 'Žatec', address: 'Tyršova 1872, Žatec',
    ownership: 'own', owner: null, totalUnits: 6, monthlyIncome: 42000,
    units: [
      { label: '1A', size: 55, rent: 7500, status: 'occupied', tenantName: 'Jan Novák', leaseTo: '2027-03-15' },
      { label: '1B', size: 38, rent: 5500, status: 'occupied', tenantName: 'Marie Svobodová', leaseTo: '2026-08-31' },
      { label: '2A', size: 72, rent: 9000, status: 'occupied', tenantName: 'Petr Dvořák', leaseTo: '2026-12-31' },
      { label: '2B', size: 56, rent: 7500, status: 'vacant', tenantName: null, leaseTo: null },
      { label: '3A', size: 48, rent: 6500, status: 'occupied', tenantName: 'Jana Černá', leaseTo: '2027-06-30' },
      { label: '3B', size: 36, rent: 5000, status: 'occupied', tenantName: 'Tomáš Procházka', leaseTo: '2026-05-15' },
    ],
  },
  {
    name: 'Důlce 2331/15', city: 'Žatec', address: 'Důlce 2331/15, Žatec',
    ownership: 'own', owner: null, totalUnits: 4, monthlyIncome: 28000,
    units: [
      { label: '1', size: 52, rent: 7000, status: 'occupied', tenantName: 'Eva Veselá', leaseTo: '2027-01-31' },
      { label: '2', size: 45, rent: 6500, status: 'occupied', tenantName: 'Martin Kučera', leaseTo: '2026-09-30' },
      { label: '3', size: 68, rent: 8500, status: 'occupied', tenantName: 'Lucie Pokorná', leaseTo: '2027-04-15' },
      { label: '4', size: 34, rent: 5000, status: 'vacant', tenantName: null, leaseTo: null },
    ],
  },
  {
    name: 'Liškova 907/13', city: 'Most', address: 'Liškova 907/13, Most',
    ownership: 'own', owner: null, totalUnits: 8, monthlyIncome: 58000,
    units: [
      { label: '1A', size: 54, rent: 7000, status: 'occupied', tenantName: 'Jiří Hájek', leaseTo: '2026-11-30' },
      { label: '1B', size: 32, rent: 4500, status: 'occupied', tenantName: 'Alena Králová', leaseTo: '2027-02-28' },
      { label: '2A', size: 75, rent: 9500, status: 'occupied', tenantName: 'Michal Marek', leaseTo: '2026-06-30' },
      { label: '2B', size: 48, rent: 6500, status: 'occupied', tenantName: 'Petra Jelínková', leaseTo: '2027-08-15' },
      { label: '3A', size: 55, rent: 7500, status: 'vacant', tenantName: null, leaseTo: null },
      { label: '3B', size: 38, rent: 5500, status: 'occupied', tenantName: 'Ondřej Fiala', leaseTo: '2026-10-31' },
      { label: '4A', size: 53, rent: 7000, status: 'occupied', tenantName: 'Barbora Benešová', leaseTo: '2027-05-31' },
      { label: '4B', size: 65, rent: 8500, status: 'occupied', tenantName: 'Pavel Šťastný', leaseTo: '2026-04-15' },
    ],
  },
  {
    name: 'Pod Širokým vrchem 124', city: 'Most', address: 'Pod Širokým vrchem 124, Most',
    ownership: 'own', owner: null, totalUnits: 5, monthlyIncome: 35500,
    units: [
      { label: '1', size: 58, rent: 7500, status: 'occupied', tenantName: 'Kateřina Doležalová', leaseTo: '2027-07-31' },
      { label: '2', size: 46, rent: 6500, status: 'occupied', tenantName: 'David Horák', leaseTo: '2026-03-31' },
      { label: '3', size: 70, rent: 9000, status: 'occupied', tenantName: 'Monika Němcová', leaseTo: '2027-01-15' },
      { label: '4', size: 35, rent: 5000, status: 'occupied', tenantName: 'Lukáš Staněk', leaseTo: '2026-06-15' },
      { label: '5', size: 55, rent: 7500, status: 'vacant', tenantName: null, leaseTo: null },
    ],
  },
  {
    name: 'Komenského 45', city: 'Ústí nad Labem', address: 'Komenského 45, Ústí nad Labem',
    ownership: 'foreign', owner: 'Ing. Novák', totalUnits: 8, monthlyIncome: 62000,
    units: [
      { label: '1A', size: 56, rent: 7500, status: 'occupied', tenantName: 'Simona Kopecká', leaseTo: '2027-03-31' },
      { label: '1B', size: 44, rent: 6500, status: 'occupied', tenantName: 'Roman Vlček', leaseTo: '2026-07-15' },
      { label: '2A', size: 74, rent: 9500, status: 'occupied', tenantName: 'Tereza Malá', leaseTo: '2026-12-31' },
      { label: '2B', size: 36, rent: 5000, status: 'occupied', tenantName: 'Jakub Urban', leaseTo: '2027-06-30' },
      { label: '3A', size: 55, rent: 7500, status: 'vacant', tenantName: null, leaseTo: null },
      { label: '3B', size: 47, rent: 6500, status: 'occupied', tenantName: 'Markéta Sedláčková', leaseTo: '2026-09-30' },
      { label: '4A', size: 62, rent: 8500, status: 'occupied', tenantName: 'Filip Blažek', leaseTo: '2027-04-30' },
      { label: '4B', size: 30, rent: 4500, status: 'occupied', tenantName: 'Veronika Kratochvílová', leaseTo: '2026-11-15' },
    ],
  },
  {
    name: 'Masarykova 12', city: 'Most', address: 'Masarykova 12, Most',
    ownership: 'foreign', owner: 'Bc. Dvořáková', totalUnits: 9, monthlyIncome: 64500,
    units: [
      { label: '1A', size: 54, rent: 7000, status: 'occupied', tenantName: 'Radek Kolář', leaseTo: '2027-02-28' },
      { label: '1B', size: 37, rent: 5500, status: 'occupied', tenantName: 'Helena Žáková', leaseTo: '2026-05-31' },
      { label: '1C', size: 46, rent: 6500, status: 'occupied', tenantName: 'Vladimír Pospíšil', leaseTo: '2026-10-15' },
      { label: '2A', size: 72, rent: 9000, status: 'occupied', tenantName: 'Daniela Tichá', leaseTo: '2027-07-31' },
      { label: '2B', size: 55, rent: 7500, status: 'occupied', tenantName: 'Adam Konečný', leaseTo: '2026-08-15' },
      { label: '2C', size: 31, rent: 4500, status: 'vacant', tenantName: null, leaseTo: null },
      { label: '3A', size: 48, rent: 6500, status: 'occupied', tenantName: 'Ivana Vaňková', leaseTo: '2027-01-31' },
      { label: '3B', size: 64, rent: 8500, status: 'occupied', tenantName: 'Marek Šimůnek', leaseTo: '2026-04-30' },
      { label: '3C', size: 52, rent: 7000, status: 'occupied', tenantName: 'Zuzana Holubová', leaseTo: '2027-09-15' },
    ],
  },
];

const REV_TYPES = [
  { name: 'Komín', frequency: '1×rok', supplier: 'Enetep' },
  { name: 'Hromosvod', frequency: '1×4roky', supplier: 'Enetep' },
  { name: 'Elektro spotř.', frequency: '1×rok', supplier: 'p.Šavel' },
  { name: 'Hasicí přístr.', frequency: '1×rok', supplier: 'p.Kulhavý' },
  { name: 'Plyn', frequency: null, supplier: 'Enetep' },
  { name: 'Kotle', frequency: null, supplier: 'Enetep' },
  { name: 'Regály', frequency: '1×rok', supplier: 'FL' },
  { name: 'Proj. dok.', frequency: null, supplier: null },
  { name: 'Proj.dok. elektro', frequency: null, supplier: null },
  { name: 'Elektro budovy', frequency: '1×5let', supplier: null },
  { name: 'PBŘ', frequency: null, supplier: null },
];

const TICKETS = [
  { title: 'Prasklá trubka v koupelně', description: 'Nájemník hlásí únik vody pod vanou. Nutná okamžitá oprava.', status: 'in_progress', priority: 'high', assignee: 'Instalatér Novotný', propertyId: 1 },
  { title: 'Nefunguje zvonek', description: 'Zvonek u vchodových dveří nereaguje na stisk.', status: 'open', priority: 'low', assignee: null, propertyId: 3 },
  { title: 'Výměna oken - reklamace', description: 'Netěsnost nově instalovaných oken, foukání v pravém horním rohu.', status: 'in_progress', priority: 'normal', assignee: 'Okna Ústí s.r.o.', propertyId: 5 },
  { title: 'Plíseň v koupelně', description: 'Rozsáhlý výskyt plísně za vanou a na stropě koupelny.', status: 'open', priority: 'high', assignee: null, propertyId: 2 },
  { title: 'Porucha kotle', description: 'Kotel se samovolně vypíná. Vyměněn termostat.', status: 'resolved', priority: 'high', assignee: 'Topenář Krátký', propertyId: 6 },
  { title: 'Zatéká střechou', description: 'Při silném dešti zatéká do podkrovního bytu.', status: 'in_progress', priority: 'high', assignee: 'Klempíř Baxa', propertyId: 4 },
];

async function main() {
  console.log('Cleaning existing data...');
  await prisma.ticket.deleteMany();
  await prisma.revisionDoc.deleteMany();
  await prisma.revisionCell.deleteMany();
  await prisma.revisionType.deleteMany();
  await prisma.obligation.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.person.deleteMany();
  await prisma.property.deleteMany();

  console.log('Seeding properties and units...');
  for (const prop of PROPERTIES) {
    const { units, ...propData } = prop;
    const created = await prisma.property.create({
      data: {
        ...propData,
        units: {
          create: units.map(u => ({
            label: u.label,
            size: u.size,
            rent: u.rent,
            status: u.status,
            tenantName: u.tenantName,
            leaseTo: u.leaseTo ? new Date(u.leaseTo) : null,
          })),
        },
      },
    });
    console.log(`  Created property: ${created.name} (id: ${created.id})`);
  }

  console.log('Seeding revision types...');
  for (const rt of REV_TYPES) {
    await prisma.revisionType.create({ data: rt });
  }
  console.log(`  Created ${REV_TYPES.length} revision types`);

  console.log('Seeding tickets...');
  for (const ticket of TICKETS) {
    await prisma.ticket.create({ data: ticket });
  }
  console.log(`  Created ${TICKETS.length} tickets`);

  console.log('Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

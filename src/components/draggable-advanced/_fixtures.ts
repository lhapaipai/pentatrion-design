import { ColumnMap, Person } from "./types";

const avatarMap: Record<string, string> = {
  Alexander: "/people/Alexander.svg",
  Aliza: "/people/Aliza.svg",
  Alvin: "/people/Alvin.svg",
  Angie: "/people/Angie.svg",
  Arjun: "/people/Arjun.svg",
  Blair: "/people/Blair.svg",
  Claudia: "/people/Claudia.svg",
  Colin: "/people/Colin.svg",
  Ed: "/people/Ed.svg",
  Effie: "/people/Effie.svg",
  Eliot: "/people/Eliot.svg",
  Fabian: "/people/Fabian.svg",
  Gael: "/people/Gael.svg",
  Gerard: "/people/Gerard.svg",
  Hasan: "/people/Hasan.svg",
  Helena: "/people/Helena.svg",
  Ivan: "/people/Ivan.svg",
  Katina: "/people/Katina.svg",
  Lara: "/people/Lara.svg",
  Leo: "/people/Leo.svg",
  Lydia: "/people/Lydia.svg",
  Maribel: "/people/Maribel.svg",
  Milo: "/people/Milo.svg",
  Myra: "/people/Myra.svg",
  Narul: "/people/Narul.svg",
  Norah: "/people/Norah.svg",
  Oliver: "/people/Oliver.svg",
  Rahul: "/people/Rahul.svg",
  Renato: "/people/Renato.svg",
  Steve: "/people/Steve.svg",
  Tanya: "/people/Tanya.svg",
  Tori: "/people/Tori.svg",
  Vania: "/people/Vania.svg",
};

let sharedLookupIndex: number = 0;

const names: string[] = Object.keys(avatarMap);

const roles: string[] = [
  "Engineer",
  "Senior Engineer",
  "Principal Engineer",
  "Engineering Manager",
  "Designer",
  "Senior Designer",
  "Lead Designer",
  "Design Manager",
  "Content Designer",
  "Product Manager",
  "Program Manager",
];

export function getPerson(): Person {
  sharedLookupIndex++;
  return getPersonFromPosition({ position: sharedLookupIndex });
}

export function getPersonFromPosition({ position }: { position: number }): Person {
  // use the next name
  const name = names[position % names.length];
  // use the next role
  const role = roles[position % roles.length];
  return {
    userId: `id:${position}`,
    name,
    role,
    avatarUrl: avatarMap[name],
  };
}

export function getPeople({ amount }: { amount: number }): Person[] {
  return Array.from({ length: amount }, () => getPerson());
}

export function getBasicData() {
  const columnMap: ColumnMap = {
    confluence: {
      title: "Confluence",
      columnId: "confluence",
      items: getPeople({ amount: 10 }),
    },
    jira: {
      title: "Jira",
      columnId: "jira",
      items: getPeople({ amount: 10 }),
    },
    trello: {
      title: "Trello",
      columnId: "trello",
      items: getPeople({ amount: 10 }),
    },
  };

  const orderedColumnIds = ["confluence", "jira", "trello"];

  return {
    columnMap,
    orderedColumnIds,
  };
}

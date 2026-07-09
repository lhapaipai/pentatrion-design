import { SelectOption } from "./types";

export const departments = [
  { value: "38", label: "Isère" },
  { value: "74", label: "Haute-Savoie" },
  { value: "73", label: "Savoie" },
];

export const townsByDepartment = {
  "38": [
    { value: "grenoble", label: "Grenoble" },
    { value: "meylan", label: "Meylan" },
    { value: "voreppe", label: "Voreppe" },
  ],
  "73": [
    { value: "chambery", label: "Chambéry" },
    { value: "albertville", label: "Albertville" },
  ],
  "74": [
    { value: "annecy", label: "Annecy" },
    { value: "annemasse", label: "Annemasse" },
    { value: "avoriaz", label: "Avoriaz" },
  ],
};

export const options: SelectOption[] = [
  { value: "abbeville", label: "Abbeville" },
  { value: "agde", label: "Agde" },
  { value: "agen", label: "Agen" },
  { value: "aixenprovence", label: "Aix-en-Provence" },
  { value: "ajaccio", label: "Ajaccio" },
  { value: "albi", label: "Albi" },
  { value: "alencon", label: "Alençon" },
  { value: "amiens", label: "Amiens" },
  { value: "angers", label: "Angers" },
  { value: "angouleme", label: "Angoulême" },
  { value: "annonay", label: "Annonay" },
  { value: "antibes", label: "Antibes" },
  { value: "arcachon", label: "Arcachon" },
  { value: "arles", label: "Arles" },
  { value: "arras", label: "Arras" },
  { value: "asnieres-sur-seine", label: "Asnières-sur-Seine" },
  { value: "aubagne", label: "Aubagne" },
  { value: "aubervilliers", label: "Aubervilliers" },
  { value: "aulnay-sous-bois", label: "Aulnay-sous-Bois" },
  { value: "avignon", label: "Avignon" },
  { value: "avranches", label: "Avranches" },
  { value: "avoriaz", label: "Avoriaz" },
  { value: "avray", label: "Avray" },
];

export const colleges: College[] = [
  {
    name: "Engineering",
    shortname: "COE",
    color: "#5521B5",
    image: "/colleges/coe.png",
    programs: [
      {
        name: "Bachelor of Science in Civil Engineering",
        shortname: "BSCE",
      },
      {
        name: "Bachelor of Science in Mechanical Engineering",
        shortname: "BSME",
      },
      {
        name: "Bachelor of Science in Electrical Engineering",
        shortname: "BSEE",
      },
      {
        name: "Bachelor of Science in Electronics Engineering",
        shortname: "BSEE",
      },
    ],
  },
  {
    name: "Education",
    shortname: "CED",
    color: "#808080",
    image: "/colleges/ced.png",
    programs: [
      {
        name: "Bachelor in Elementary Education",
        shortname: "BED",
      },
      {
        name: "Bachelor in Secondary Education - Major in English",
        shortname: "BME",
      },
      {
        name: "Bachelor in Secondary Education - Major in Filipino",
        shortname: "BMF",
      },
      {
        name: "Bachelor in Secondary Education - Major in Math",
        shortname: "BMM",
      },
    ],
  },
  {
    name: "Computer Studies",
    shortname: "CCS",
    color: "#16a34a",
    image: "/colleges/ccs.png",
    programs: [
      {
        name: "Bachelor of Science in Information Technology",
        shortname: "BSIT",
      },
      {
        name: "Bachelor of Science in Computer Science",
        shortname: "BSCS",
      },
    ],
  },
  {
    name: "Arts & Sciences",
    shortname: "CAS",
    color: "#E3A008",
    image: "/colleges/cas.png",
    programs: [],
  },
  {
    name: "Business Administration",
    shortname: "CBA",
    color: "#723B13",
    image: "/colleges/cba.png",
    programs: [],
  },
  {
    name: "Criminology",
    shortname: "COC",
    color: "#751A3D",
    image: "/colleges/coc.png",
    programs: [
      {
        name: "Bachelor Of Science In Criminology",
        shortname: "BSCRIM",
      },
    ],
  },
];

export interface Program {
  name: string;
  shortname: string;
}

export interface College {
  name: string;
  shortname: string;
  color: string;
  image: string;
  programs: Program[];
}

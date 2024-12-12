export enum CircularEconomyOption {
  DURABILITY = "durability",
  REPAIRABILITY = "repairability",
  MAINTAINABILITY = "maintainability",
  UPGRADABILITY = "upgradability",
  RECYCLABILITY = "recyclability",
}

export const circularEconomySelects = [
  {
    key: CircularEconomyOption.DURABILITY,
    label: "Kestävyys & laadukkuus",
  },
  {
    key: CircularEconomyOption.REPAIRABILITY,
    label: "Korjattavuus",
  },
  {
    key: CircularEconomyOption.MAINTAINABILITY,
    label: "Huollettavuus",
  },
  {
    key: CircularEconomyOption.UPGRADABILITY,
    label: "Päivitettävyys",
  },
  {
    key: CircularEconomyOption.RECYCLABILITY,
    label: "Säilyttää arvon (kierrätettävyys)",
  },
] as const;

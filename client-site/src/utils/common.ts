import { airportData } from "./airport";

export const classNames = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(" ");
};

export const extractIATACode = (airportString: string): string | null => {
  const match = airportString.match(/\(([^)]+)\)/);
  return match ? match[1] : null;
};

export const getAirportNameByIATA = (iata: string) => {
  const airport = airportData.find((airport) => airport.IATA === iata);
  return airport ? airport.Name : "Unknown Airport";
};

export function truncateString(str: string, maxLength: number): string {
  if (!str) {
    return "";
  }
  if (str?.length <= maxLength) {
    return str;
  }
  return str?.slice(0, maxLength - 3) + "...";
}

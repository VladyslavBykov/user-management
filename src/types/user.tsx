import { Office } from "./office";
import { Publisher } from "./publisher";

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  office: Office;
  publisher: Publisher | null;
};

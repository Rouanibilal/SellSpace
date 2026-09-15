import { UserRole } from "./roles";

export type User = {
    id: string;
    role: UserRole;
};
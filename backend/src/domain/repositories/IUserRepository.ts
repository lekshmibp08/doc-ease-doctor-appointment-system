import { IUser } from '../entities/User'


export type IUserRepository = {
    findByEmail: (email: string) => Promise<IUser | null>;
    create: (user: IUser) => Promise<IUser>;
    getAllUsers: () => Promise<IUser[]>;
    getUsersWithPagination: (skip: number, limit: number, query: any) => Promise<IUser[]>;
    countUsers: (query: any) => Promise<number>;
    findUserById: (id: string) => Promise<IUser | null>;
    updateUser: (id: string, updates: any) => Promise<IUser | null>;

  };
  
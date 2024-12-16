import { User } from '../entities/User'


export type IUserRepository = {
    findByEmail: (email: string) => Promise<User | null>;
    create: (user: User) => Promise<User>;
    getAllUsers: () => Promise<User[]>;
    getUsersWithPagination: (skip: number, limit: number, query: any) => Promise<User[]>;
    countUsers: (query: any) => Promise<number>;
    findUserById: (id: string) => Promise<User | null>;
    updateUser: (id: string, updates: any) => Promise<User | null>;

  };
  
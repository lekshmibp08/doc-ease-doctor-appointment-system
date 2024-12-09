import { User } from '../entities/User'


export type IUserRepository = {
    findByEmail: (email: string) => Promise<User | null>;
    create: (user: User) => Promise<User>;
    getAllUsers: () => Promise<User[]>
  };
  
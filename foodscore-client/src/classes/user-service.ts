// dir: classes/user-service.ts //
import { User } from "../interfaces/user";
export class UserService {
    async getProfile(id?: number): Promise<User> {}

    async saveProfile(name: string, email: string): Promise<void> {}

    async saveAvatar(avatar: string): Promise<string> {}

    async savePassword(password: string): Promise<void> {}
}

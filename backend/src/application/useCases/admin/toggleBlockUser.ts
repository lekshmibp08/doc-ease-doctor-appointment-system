import { IUserRepository } from "../../../domain/repositories/IUserRepository"; 

export const toggleBlockUser = async (userRepository: IUserRepository, id: string) => {
    const user = await userRepository.findUserById(id);

    if (!user) {
        throw new Error('User not found'); 
    }

    const updatedStatus = !user.isBlocked;

    await userRepository.updateUser(id, { isBlocked: updatedStatus})

    return {
        isBlocked: updatedStatus,
        message: `User has been ${updatedStatus ? 'Blocked' : 'Unblocked'} successfully`,
    };
}
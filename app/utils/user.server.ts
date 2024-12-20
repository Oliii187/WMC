import bcrypt from 'bcryptjs'
import type { RegisterForm } from './types.server'
import { prisma } from './prisma.server'
import { Profile } from "@prisma/client";

export const createUser = async (user: RegisterForm) => {
  const passwordHash = await bcrypt.hash(user.password, 10)
  const newUser = await prisma.user.create({
    data: {
      email: user.email,
      password: passwordHash,
      profile: {
        create: {
          firstName: user.firstName,
          lastName: user.lastName,
        },
      },
    },
  })
  return { id: newUser.id, email: user.email }
}
export const updateUser = async (userId: string, profile: Partial<Profile>) => {

  await prisma.user.update({

    where: {

      id: Number(userId),

    },

    data: {

      profile: {

        update: profile,

      },

    },

  });

}


export const getOtherUsers = async (userId: string) => {
  return prisma.user.findMany({
    where: {
      id: { not: +userId },
    },
    orderBy: {
      profile: {
        firstName: 'asc',
      },
    },
    include:{
      profile:true
    }
  })
}


export async function getUserById(userId: number) {
  return await prisma.user.findUnique({
      where: { id: +userId },
      include: { profile: true }, // Sicherstellen, dass das Profil enthalten ist, wenn du darauf zugreifst
  });
}

export const deleteUser = async (userId: number) => {
  // Delete dependent records first
  await prisma.profile.deleteMany({ where: { userId } }); // Delete profile
  await prisma.kudo.deleteMany({ where: { OR: [{ authorId: userId }, { recipientId: userId }] } }); // Delete kudos
  // Finally, delete the user
  await prisma.user.delete({ where: { id: userId } });
};
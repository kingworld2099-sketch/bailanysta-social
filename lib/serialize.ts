import type { User } from "@prisma/client";

export function publicUser(user: User) {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    city: user.city,
    occupation: user.occupation,
    bio: user.bio,
    contact: user.contact,
    vibe: user.vibe,
    vibeUpdatedAt: user.vibeUpdatedAt,
    createdAt: user.createdAt,
  };
}

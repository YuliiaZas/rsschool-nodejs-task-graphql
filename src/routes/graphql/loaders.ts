import { MemberType, Post, PrismaClient, Profile, User } from "@prisma/client";
import DataLoader from "dataloader";

export function createLoaders(prisma: PrismaClient) {
  return {
    userSubscribedTo: new DataLoader<string, User[]>(
      ids => genUserSubscribedTo(prisma, ids),
      { cacheKeyFn: id => id }
    ),
    subscribedToUser: new DataLoader<string, User[]>(
      ids => genSubscribedToUser(prisma, ids),
      { cacheKeyFn: id => id }
    ),
    memberType: new DataLoader<string, MemberType[]>(
      ids => genMemberType(prisma, ids),
      { cacheKeyFn: id => id }
    ),
    post: new DataLoader<string, Post[]>(
      ids => genPost(prisma, ids),
      { cacheKeyFn: id => id }
    ),
    profile: new DataLoader<string, Profile | undefined>(
      ids => genProfile(prisma, ids),
      { cacheKeyFn: id => id }
    ),
  };
}

async function genUserSubscribedTo(
  prisma: PrismaClient, ids: readonly string[]
): Promise<User[][]> {
  const rows = await prisma.subscribersOnAuthors.findMany({
    where: { subscriberId: { in: ids as string[] } },
    include: { author: true },
  });

  return getCorrespondedArrays<User, typeof rows[0]>(
    ids,
    rows,
    row => row.subscriberId,
    row => row.author
  );
}

async function genSubscribedToUser(
  prisma: PrismaClient, ids: readonly string[]
): Promise<User[][]> {
  const rows = await prisma.subscribersOnAuthors.findMany({
    where: { authorId: { in: ids as string[] } },
    include: { subscriber: true },
  });

  return getCorrespondedArrays<User, typeof rows[0]>(
    ids,
    rows,
    row => row.authorId,
    row => row.subscriber
  );
}

async function genMemberType(
  prisma: PrismaClient, ids: readonly string[]
): Promise<MemberType[][]> {
  const rows = await prisma.memberType.findMany({
    where: { id: { in: ids as string[] } },
  });

  return getCorrespondedArrays<MemberType>(ids, rows);
}

async function genPost(
  prisma: PrismaClient, ids: readonly string[]
): Promise<Post[][]> {
  const rows = await prisma.post.findMany({
    where: { authorId: { in: ids as string[] } },
  });

  return getCorrespondedArrays<Post>(ids, rows, rows => rows.authorId);
}

async function genProfile(
  prisma: PrismaClient, ids: readonly string[]
): Promise<(Profile | undefined)[]> {
  const rows = await prisma.profile.findMany({
    where: { userId: { in: ids as string[] } },
  });

  const map = new Map<string, Profile>();
  for (const row of rows) {
    map.set(row.userId, row);
  }

  return ids.map((id) => map.get(id));
}

const getCorrespondedArrays = <T, R = T>(
  ids: readonly string[],
  rows: R[],
  keyFn: (row: R) => string = row => (row as {id: string}).id,
  valueFn: (row: R) => T = row => row as unknown as T
) => {
  const map = new Map<string, T[]>();
  for (const id of ids) map.set(id, []);
  for (const row of rows) {
    map.get(keyFn(row))?.push(valueFn(row));
  }

  return ids.map(id => map.get(id) ?? []);
}

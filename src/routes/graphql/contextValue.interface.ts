import { MemberType, Post, PrismaClient, Profile, User } from "@prisma/client";
import type DataLoader from "dataloader";

export interface ContextValue {
  prisma: PrismaClient;
  loaders:  {
    userSubscribedTo: DataLoader<string, User[]>;
    subscribedToUser: DataLoader<string, User[]>;
    memberType: DataLoader<string, MemberType[]>;
    post: DataLoader<string, Post[]>;
    profile: DataLoader<string, Profile | undefined>;
  }
};

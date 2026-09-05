import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function UsernameRedirectPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
    select: { id: true },
  });

  if (!user) notFound();

  redirect(`/profile/${user.id}`);
}

// app/routes/avatar.tsx

import { ActionFunction, json } from "@remix-run/node";

import { requireUserId } from "~/utils/auth.server";

import { uploadProfilePicture } from "~/utils/upload.server";

import { prisma } from "~/utils/prisma.server";

import { ImageUploader } from "~/components/image-uploader";

export const action: ActionFunction = async ({ request }) => {
  // 1

  const userId = await requireUserId(request);

  // 2
  

  const formData = await request.formData();
  const file = formData.get("profilePicture") as File;
  const imageUrl = await uploadProfilePicture(file);

  // 3

  await prisma.profile.update({
    data: {
      profilePicture: imageUrl,
    },

    where: {
      userId: userId,
    },
  });

  // 4
console.log("imageUrl",imageUrl);
  return json({ imageUrl });
};

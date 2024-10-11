// app/routes/home/kudo.$userId.tsx

import { json, LoaderFunction, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getUserById } from '~/utils/user.server'
import { Portal } from '~/components/portal'
import { Modal } from '~/components/modal';

export const loader: LoaderFunction = async ({ request, params }) => {
  const { userId } = params

  if (typeof userId !== 'string') {
    return redirect('/home')
  }

  const recipient = await getUserById(userId)
  return json({ recipient })
}


export default function KudoModal() {
  // 3
  const data = useLoaderData()
  //@ts-ignore
  return (
        <Portal wrapperId="kudo-modal">
        <Modal isOpen={true} className="w-2/3 p-10">
        <h2> User: {recipient.profile.firstName} {recipient.profile.lastName} </h2>
        </Modal>
        </Portal>
      )
}
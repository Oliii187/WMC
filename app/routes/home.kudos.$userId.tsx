// app/routes/home/kudo.$userId.tsx

import { json, LoaderFunction, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getUserById } from '~/utils/user.server'
import { Portal } from '~/components/portal'
import { Modal } from '~/components/modal';
import { getUser } from '~/utils/auth.server'

export const loader: LoaderFunction = async ({ request, params }) => {
  const { userId } = params

  const user = await getUser(request)
  if (typeof userId !== 'string') {
    return redirect('/home')
  }

  const recipient = await getUserById(userId)
  return json({ recipient, user })
}

export default function KudoModal() {
  const data = useLoaderData()

  //@ts-ignore
  if (!data.recipient) {
    return <h2>User not found</h2>
  }

  return (
        <Portal wrapperId="kudo-modal">
        <Modal isOpen={true} className="w-2/3 p-10">
          <h2> User: {data.recipient.profile.firstName} {data.recipient.profile.lastName} </h2>
        </Modal>
        </Portal>
      )
  
}

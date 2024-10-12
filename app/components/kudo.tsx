import { UserCircle } from '~/components/user-circle'

import { User, Kudo as IKudo } from '@prisma/client'

import { colorMap, backgroundColorMap, emojiMap } from '~/utils/constants'


export function Kudo({ profile, kudo }: { profile: User; kudo: Partial<IKudo> }) {


    return (

        <div

            className={`flex ${
                // @ts-ignore
                backgroundColorMap[kudo.style?.backgroundColor || 'RED']

                } p-4 rounded-xl w-full gap-x-2 relative`}

        >

            <div>
                {/* @ts-ignore */}
                <UserCircle profile={profile} className="h-16 w-16" />
            </div>


            <div className="flex flex-col">

                <p className={`${// @ts-ignore
                    colorMap[kudo.style?.textColor || 'WHITE']} font-bold text-lg whitespace-pre-wrap break-all`}>
                         {/* @ts-ignore */}

                    {profile.firstName} {profile.lastName}

                </p>

                <p className={`${// @ts-ignore
                    colorMap[kudo.style?.textColor || 'WHITE']} whitespace-pre-wrap break-all`}>{kudo.message}</p>

            </div>

            <div
                className="absolute bottom-4 right-4 bg-white rounded-full h-10 w-10 flex items-center justify-center text-2xl">

                {// @ts-ignore
                    emojiMap[kudo.style?.emoji || 'THUMBSUP']}

            </div>

        </div>

    )

}
// app/routes/home.tsx

import { json, LoaderFunction } from '@remix-run/node'
import { requireUserId } from '~/utils/auth.server'
import { Layout } from '~/components/layout'
import { UserPanel } from '~/components/user-panel'
import { getOtherUsers } from '~/utils/user.server'
import { useLoaderData, Outlet } from '@remix-run/react'

import { getFilteredKudos,getRecentKudos } from '~/utils/kudos.server'
import { Kudo } from '~/components/kudo'
import { Kudo as IKudo, Profile, Prisma } from '@prisma/client'
import { SearchBar } from '~/components/search-bar'
import { RecentBar } from '~/components/recent-bar'


interface KudoWithProfile extends IKudo {
  author: {
    profile: Profile
  }
}

const toLowerCase = (str: string) => str.toLowerCase();

;





export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const users = await getOtherUsers(userId);

  const url = new URL(request.url)
  const sort = url.searchParams.get('sort')
  const filter = url.searchParams.get('filter')

  let sortOptions: Prisma.KudoOrderByWithRelationInput = {}
  if (sort) {
    if (sort === 'date') {
      sortOptions = { createdAt: 'desc' }
    }
    if (sort === 'sender') {
      sortOptions = { author: { profile: { firstName: 'asc' } } }
    }
    if (sort === 'emoji') {
      //@ts-ignore
      sortOptions = { style: { emoji: 'asc' } }
    }
  }

  // 3
  let textFilter: Prisma.KudoWhereInput = {}
  if (filter) {
    textFilter = {
      OR: [
        //@ts-ignore
        { message: { mode: 'insensitive', contains: filter } },
        {
          author: {
            OR: [
              { profile: { is: { firstName: { 
                //@ts-ignore
                mode: 'insensitive', contains: filter } } } },
              { profile: { is: { lastName: { 
                //@ts-ignore
                mode: 'insensitive', contains: filter } } } },
            ],
          },
        },
      ],
    }
  }
  

  const kudos = await getFilteredKudos(userId, sortOptions, textFilter)
  const recentKudos = await getRecentKudos()
  kudos.forEach(kudo => {
    console.log('Kudo ID:', kudo.id);
    console.log('Kudo Style:', kudo.style); // Hier den Stil genauer ansehen
    //@ts-ignore
    console.log('Kudo Emoji', kudo.emoji);
    {console.log(kudo.style)}

});

console.log(recentKudos);


  return json({ users, kudos, recentKudos });
};



export default function Home() {
  //@ts-ignore
  const { users, kudos,recentKudos } = useLoaderData();
  
  
  return (
      <Layout>
          <Outlet />
          <div className="h-full flex">
              <UserPanel users={users} />
              <div className="flex-1 flex flex-col">
              <SearchBar />
                  <div className="flex-1 flex">
                      <div className="w-full p-10 flex flex-col gap-y-4">
                          {kudos.map((kudo: KudoWithProfile) => (
                              //@ts-ignore
                              <Kudo key={kudo.id} kudo={kudo} profile={kudo.author.profile} />
                          ))}
                      </div>
                      <RecentBar kudos={recentKudos} />
                  </div>
              </div>
          </div>
      </Layout>
  );
}

import getSongs from '@/actions/getSongs';
import Header from '@/components/Header'
import ListItem from '@/components/ListItem'
import PageContent from './components/PageContent';
import RightSidebar from '@/components/RightSidebar';


export const revalidate = 0

export default async function Home() {
  const songs = await getSongs();

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className='mb-2'>
          <h1 className='text-white text-3xl font-semibold'>
            こんにちは
          </h1>
          <div className=' grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4'>
            <ListItem image='/images/liked.png' name='お気に入りの曲' href='liked' />
          </div>
        </div>
      </Header>

      <div className='mt-2 mb-7 px-6'>
        <div className='flex justify-between items-center'>
          <h1 className='text-white text-2xl font-semibold'>
            最新曲
          </h1>
        </div>
        <div className='flex flex-col md:flex-row'>
          <div className='w-full md:w-auto md:mr-4'>
            <PageContent songs={songs} />
          </div>
          <div className='hidden md:block w-96 flex-shrink-0'>
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}

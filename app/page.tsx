'use client'

import { ManualHeader } from '@components'
import { MoralisProvider } from 'react-moralis'

const Home = () => {
    return (
        <MoralisProvider initializeOnMount={false}>
            <main className='flex min-h-screen flex-col items-center justify-between p-24'>
                <ManualHeader />
            </main>
        </MoralisProvider>
    )
}

export default Home

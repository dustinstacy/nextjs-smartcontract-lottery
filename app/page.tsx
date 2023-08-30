'use client'

import { Header } from '@components'
import LotteryEntrance from '@components/LotteryEntrance'
import { MoralisProvider } from 'react-moralis'
import { NotificationProvider } from 'web3uikit'

const Home = () => {
    return (
        <MoralisProvider initializeOnMount={false}>
            <NotificationProvider>
                <main className='flex min-h-screen flex-col items-center justify-between p-24'>
                    <Header />
                    <LotteryEntrance />
                </main>
            </NotificationProvider>
        </MoralisProvider>
    )
}

export default Home

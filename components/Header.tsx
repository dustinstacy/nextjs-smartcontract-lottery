import React from 'react'
import { ConnectButton } from 'web3uikit'

const Header = () => {
    return (
        <div className='flex w-screen justify-around items-center'>
            <h1 className='text-3xl'>Decentralized Lottery</h1>
            <ConnectButton moralisAuth={false} />
        </div>
    )
}

export default Header

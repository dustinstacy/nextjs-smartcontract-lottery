'use client'

import React, { useEffect } from 'react'
import { useMoralis } from 'react-moralis'

const ManualHeader = () => {
    const { enableWeb3, deactivateWeb3, account, isWeb3Enabled, isWeb3EnableLoading, Moralis } =
        useMoralis()

    useEffect(() => {
        if (isWeb3Enabled) return
        if (window.localStorage.getItem('connected')) {
            enableWeb3()
        }
    }, [isWeb3Enabled])

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            if (account == null) {
                window.localStorage.removeItem('connected')
                deactivateWeb3()
            }
        })
    }, [])

    const handleClick = async () => {
        await enableWeb3()
        window.localStorage.setItem('connected', 'injected')
    }

    return (
        <div>
            {account ? (
                <div>
                    Connected to {account.slice(0, 6)}...{account.slice(account.length - 4)}
                </div>
            ) : (
                <button onClick={handleClick} disabled={isWeb3EnableLoading}>
                    Connect
                </button>
            )}
        </div>
    )
}

export default ManualHeader

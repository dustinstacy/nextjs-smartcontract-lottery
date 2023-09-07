import React, { useEffect, useState } from 'react'
import { useMoralis, useWeb3Contract } from 'react-moralis'
import { ethers, ContractTransaction } from 'ethers'
import { useNotification } from 'web3uikit'
import { abi, contractAddresses } from '@constants'

interface ContractAddresses {
    [chainId: number]: string[]
}

const LotteryEntrance = () => {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const dispatch = useNotification()
    const [entranceFee, setEntranceFee] = useState('0')
    const [numEntrants, setNumEntrants] = useState('0')
    const [recentWinner, setRecentWinner] = useState('0')

    const chainId = parseInt(chainIdHex as string)
    const lotteryAddresses: ContractAddresses = contractAddresses
    const lotteryAddress = lotteryAddresses[chainId] ? lotteryAddresses[chainId][0] : undefined

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: 'getEntranceFee',
        params: {},
    })

    const { runContractFunction: getNumEntrants } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: 'getNumEntrants',
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: 'getRecentWinner',
        params: {},
    })

    const {
        runContractFunction: enterLottery,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: 'enterLottery',
        params: {},
        msgValue: entranceFee,
    })

    const updateUI = async () => {
        const fee = (await getEntranceFee()) as string
        const entries = (await getNumEntrants()) as string
        const winner = (await getRecentWinner()) as string
        setEntranceFee(fee)
        setNumEntrants(entries)
        setRecentWinner(winner)
    }

    const handleClick = async () => {
        await enterLottery({
            onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
        })
    }

    const handleSuccess = async (tx: ContractTransaction) => {
        await tx.wait(1)
        handleNewNotification()
        updateUI()
    }

    const handleNewNotification = async () => {
        dispatch({
            type: 'info',
            message: 'Transaction Complete',
            title: 'TX Notification',
            position: 'topR',
            icon: 'bell',
        })
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    return (
        <>
            {lotteryAddress ? (
                <div className='flex flex-col h-[400px] w-screen justify-center items-center '>
                    <div className='flex flex-col grow items-center gap-[8px]'>
                        <div>Previous winner: {recentWinner.toString()}</div>
                        <div>
                            Entrance fee: {ethers.utils.formatUnits(entranceFee, 'ether')} ETH
                        </div>
                        <div>Number of entries: {numEntrants.toString()}</div>
                    </div>
                    <button
                        className='h-[48px] w-[128px] bg-indigo-500 hover:bg-orange-500 rounded'
                        onClick={handleClick}
                        disabled={isLoading || isFetching}
                    >
                        Enter Lottery
                    </button>
                </div>
            ) : (
                <div>No Lottery Detected</div>
            )}
        </>
    )
}

export default LotteryEntrance

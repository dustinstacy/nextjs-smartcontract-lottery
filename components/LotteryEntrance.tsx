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

    const chainId = parseInt(chainIdHex as string)
    const lotteryAddresses: ContractAddresses = contractAddresses
    const lotteryAddress = lotteryAddresses[chainId] ? lotteryAddresses[chainId][0] : undefined

    useEffect(() => {
        if (isWeb3Enabled) {
            const updateUI = async () => {
                const fee = (await getEntranceFee()) as string
                setEntranceFee(fee)
            }
            updateUI()
        }
    }, [isWeb3Enabled])

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: 'getEntranceFee',
        params: {},
    })

    const { runContractFunction: enterLottery } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: 'enterLottery',
        params: {},
        msgValue: entranceFee,
    })

    const handleClick = async () => {
        await enterLottery({
            onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
        })
    }

    const handleSuccess = async (tx: ContractTransaction) => {
        await tx.wait(1)
        handleNewNotification()
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

    return (
        <>
            {lotteryAddress ? (
                <>
                    <div>Entrance fee: {ethers.utils.formatUnits(entranceFee, 'ether')} ETH</div>
                    <button onClick={handleClick}>Enter Lottery</button>
                </>
            ) : (
                <div>No Lottery Detected</div>
            )}
        </>
    )
}

export default LotteryEntrance

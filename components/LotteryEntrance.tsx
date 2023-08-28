import React from 'react'
import { useWeb3Contract } from 'react-moralis'

const LotteryEntrance = () => {
    const { runContractFunction } = useWeb3Contract({
        abi:,
        contractAddress:,
        functionName:,
        params:,
        msgValue:,
    })

    return <div>LotteryEntrance</div>
}

export default LotteryEntrance

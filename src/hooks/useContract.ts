import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { base } from 'wagmi/chains'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../lib/contract'

export function useGeoQuestContract() {
  const { address } = useAccount()
  const { writeContract, data: hash, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash })

  const submitAnswer = (questionId: number, answer: string) => {
    if (!address) throw new Error('No wallet connected')
    
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'submitAnswer',
      args: [BigInt(questionId), answer],
      chain: base,
      account: address,
    })
  }

  const updateCID = (newCID: string) => {
    if (!address) throw new Error('No wallet connected')
    
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'setCID',
      args: [newCID],
      chain: base,
      account: address,
    })
  }

  return {
    submitAnswer,
    updateCID,
    isPending,
    isConfirming,
    isConfirmed,
  }
}

export function useContractData() {
  const { data: cid } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'cid',
    chainId: base.id,
  })

  const { data: owner } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'owner',
    chainId: base.id,
  })

  return { cid, owner }
}

export function useSubmission(userAddress: string | undefined, questionId: number) {
  const { data: submission } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getSubmission',
    args: userAddress ? [userAddress as `0x${string}`, BigInt(questionId)] : undefined,
    chainId: base.id,
  })

  return {
    answer: submission?.[0],
    timestamp: submission?.[1],
    exists: submission?.[2],
  }
}
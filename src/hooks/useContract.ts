import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../lib/contract'

export function useGeoQuestContract() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash })

  const submitAnswer = (questionId: number, answer: string) => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'submitAnswer',
      args: [BigInt(questionId), answer],
    })
  }

  const updateCID = (newCID: string) => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'setCID',
      args: [newCID],
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
  })

  const { data: owner } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'owner',
  })

  return { cid, owner }
}

export function useSubmission(userAddress: string | undefined, questionId: number) {
  const { data: submission } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getSubmission',
    args: userAddress ? [userAddress as `0x${string}`, BigInt(questionId)] : undefined,
  })

  return {
    answer: submission?.[0],
    timestamp: submission?.[1],
    exists: submission?.[2],
  }
}
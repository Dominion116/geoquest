export const CONTRACT_ADDRESS = '0x3Fc76a51fc08db73F0eaD78ABd4EE01B05dEC371';

export const CONTRACT_ABI = [
  {
    "inputs": [{"internalType": "string", "name": "_cid", "type": "string"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": true, "internalType": "uint256", "name": "questionId", "type": "uint256"},
      {"indexed": false, "internalType": "string", "name": "answer", "type": "string"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "name": "AnswerSubmitted",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "cid",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "user", "type": "address"},
      {"internalType": "uint256", "name": "questionId", "type": "uint256"}
    ],
    "name": "getSubmission",
    "outputs": [
      {"internalType": "string", "name": "answer", "type": "string"},
      {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
      {"internalType": "bool", "name": "exists", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "questionId", "type": "uint256"},
      {"internalType": "string", "name": "answer", "type": "string"}
    ],
    "name": "submitAnswer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "_cid", "type": "string"}],
    "name": "setCID",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;
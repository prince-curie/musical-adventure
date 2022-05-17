import { ethers, Contract } from 'ethers'
import { abi, curieAddress, network } from '../constants'

export const getProvider = (instance) => {
    return new ethers.providers.Web3Provider(instance)
  }

export const getSigner = (provider) => {
    return provider.getSigner()
}

export const getAddress = async(signer) => {
    return await signer.getAddress();
}

export const getNetwork = async(provider) => {
    return await provider.getNetwork(network)
}

export const truncateWalletAddress = (str) => {
    const length = str.length;

    return str.substr(0, 5) + "......." + str.substr(length - 5, length);
};

export const initializeContract = (signerOrProvider) => {
    return new Contract(curieAddress, abi, signerOrProvider);
}

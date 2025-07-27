// src/hooks/useMetaMask.tsx
import { useState, useEffect, useCallback } from 'react';
import { ethers, getAddress } from 'ethers';

// Ajout de la déclaration pour window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

export function useMetaMask() {
  const [address, setAddress] = useState<string | null>(null);
  const [error,   setError]   = useState<string | null>(null);

  // Vérifier si MetaMask est installé
  const isMetaMaskInstalled = () => {
    return typeof window.ethereum !== 'undefined' &&
           window.ethereum.isMetaMask;
  };

  // Demander à MetaMask de se connecter
  const connect = useCallback(async () => {
    try {
      if (!isMetaMaskInstalled()) {
        setError('MetaMask non détecté : installe-le depuis https://metamask.io/');
        return;
      }
      // Demande d’autorisation
      const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAddress(getAddress(selectedAddress)); // normalisation
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion à MetaMask');
    }
  }, []);

  // Optionnel : écouter les changements de compte
  useEffect(() => {
    if (isMetaMaskInstalled()) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          setAddress(null);
        } else {
          setAddress(getAddress(accounts[0]));
        }
      });
    }
    return () => {
      if (isMetaMaskInstalled()) {
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, []);

  return { address, error, connect, isMetaMaskInstalled };
}

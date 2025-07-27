import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useMetaMask } from './hooks/useMetaMask';
import { getNonce, login as loginApi } from './services/auth';
import axios from 'axios';

export default function App() {
  const { address, error, connect, isMetaMaskInstalled } = useMetaMask();
  const [token, setToken]       = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('access_token');
    if (saved) {
      setToken(saved);
      axios.defaults.headers.common['Authorization'] = `Bearer ${saved}`;
    }
  }, []);

  const handleLogin = async () => {
    if (!address) return;
    setLoading(true);
    setLoginError(null);

    try {
      // 1. Récupérer le challenge (nonce)
      const nonce = await getNonce(address);

      // 2. Signer la nonce avec MetaMask
      // nouveau (ethers v6)
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer   = await provider.getSigner();
      const signature = await signer.signMessage(nonce);

      // 3. Envoyer la signature au backend pour obtenir le JWT
      const accessToken = await loginApi(address, signature);
      localStorage.setItem('access_token', accessToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      setToken(accessToken);
    } catch (err: any) {
      setLoginError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Connexion Web3</h1>

      { !isMetaMaskInstalled() && (
        <p className="text-red-600">
          MetaMask non installé ! <a href="https://metamask.io/" target="_blank" rel="noopener">Installer MetaMask</a>
        </p>
      )}

      { error && <p className="text-red-600">{error}</p> }

      {!address ? (
        <button
          onClick={connect}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Se connecter avec MetaMask
        </button>
      ) : (
        <p>Adresse détectée : <code>{address}</code></p>
      )}

      {address && !token && (
        <button
          onClick={handleLogin}
          disabled={loading}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
        >
          {loading ? 'Connexion…' : 'Se connecter au backend'}
        </button>
      )}

      {loginError && <p className="text-red-600 mt-2">{loginError}</p>}

      {token && (
        <div className="mt-4">
          <p className="text-green-700">Authentifié !</p>
          <p>Token : <code>{token.slice(0, 20)}…</code></p>
        </div>
      )}
    </div>
  );
}

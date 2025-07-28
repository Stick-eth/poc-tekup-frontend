import React, { useState } from 'react'
import { ethers } from 'ethers'
import { useMetaMask } from '../hooks/useMetaMask'
import { getNonce, login as loginApi } from '../services/auth'
import axios from 'axios'
import { Button } from '../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'

interface LoginProps {
  onSuccess: (token: string) => void
}

export default function Login({ onSuccess }: LoginProps) {
  const { address, error, connect, isMetaMaskInstalled } = useMetaMask()
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  const handleLogin = async () => {
    if (!address) return
    setLoading(true)
    setLoginError(null)
    try {
      const nonce = await getNonce(address)
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const signature = await signer.signMessage(nonce)
      const accessToken = await loginApi(address, signature)
      localStorage.setItem('access_token', accessToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      onSuccess(accessToken)
    } catch (err: any) {
      setLoginError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Connexion Web3</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {!isMetaMaskInstalled() && (
          <p className="text-red-600">
            MetaMask non installé !{' '}
            <a href="https://metamask.io/" target="_blank" rel="noopener">
              Installer MetaMask
            </a>
          </p>
        )}
        {error && <p className="text-red-600">{error}</p>}
        {!address ? (
          <Button onClick={connect}>Se connecter avec MetaMask</Button>
        ) : (
          <p>
            Adresse détectée : <code>{address}</code>
          </p>
        )}
        {address && (
          <Button onClick={handleLogin} disabled={loading}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </Button>
        )}
        {loginError && <p className="text-red-600">{loginError}</p>}
      </CardContent>
    </Card>
  )
}

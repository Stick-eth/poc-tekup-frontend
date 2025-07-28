import React, { useEffect, useState } from 'react'
import { fetchProfile } from '../services/profile'
import { Button } from '../components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '../components/ui/card'

interface ProfileProps {
  onLogout: () => void
}

export default function ProfilePage({ onLogout }: ProfileProps) {
  const [profile, setProfile] = useState<{ address: string; message: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProfile()
      .then(data => setProfile(data))
      .catch(err => setError(err.response?.data?.message || err.message))
  }, [])

  if (error) return <p className="text-red-600">Erreur : {error}</p>
  if (!profile) return <p>Chargement du profil…</p>

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Mon profil Web3</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>
          🆔 Adresse : <code>{profile.address}</code>
        </p>
        <p>💬 Message : {profile.message}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={onLogout} className="w-full">
          Déconnexion
        </Button>
      </CardFooter>
    </Card>
  )
}

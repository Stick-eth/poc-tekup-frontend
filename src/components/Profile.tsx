// src/components/Profile.tsx
import React, { useEffect, useState } from 'react';
import { fetchProfile } from '../services/profile';

export function Profile() {
  const [profile, setProfile] = useState<{ address: string; message: string } | null>(null);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    fetchProfile()
      .then(data => setProfile(data))
      .catch(err => setError(err.response?.data?.message || err.message));
  }, []);

  if (error) return <p className="text-red-600">Erreur : {error}</p>;
  if (!profile) return <p>Chargement du profil…</p>;

  return (
    <div className="mt-6 p-4 border rounded">
      <h2 className="text-xl mb-2">Mon profil Web3</h2>
      <p>🆔 Adresse : <code>{profile.address}</code></p>
      <p>💬 Message : {profile.message}</p>
    </div>
  );
}

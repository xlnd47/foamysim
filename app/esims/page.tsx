'use client'

import AuthGuard from '../components/AuthGuard';
import EsimsContent from '../components/EsimsContent';

export default function Esims() {
  return (
    <AuthGuard>
      <EsimsContent />
    </AuthGuard>
  );
}
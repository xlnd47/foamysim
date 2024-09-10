'use client'

import AuthGuard from '../components/AuthGuard';
import PackagesContent from '../components/PackagesContent';

export default function Packages() {
  return (
    <AuthGuard>
      <PackagesContent />
    </AuthGuard>
  );
}
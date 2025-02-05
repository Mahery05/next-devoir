"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import DetailsActivite from '@/components/DetailsActivite';

const ActiviteDetailsPage = () => {
  const params = useParams();
  const { id } = params;

  if (!id) return <div>Loading...</div>;

  return <DetailsActivite id={parseInt(id as string, 10)} />;
};

export default ActiviteDetailsPage;
"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import ActivitesEditForm from '@/components/ActivitesEditForm';

const EditActivitePage = () => {
  const params = useParams();
  const { id } = params;

  if (!id) return <div>Loading...</div>;

  return <ActivitesEditForm id={parseInt(id as string, 10)} />;
};

export default EditActivitePage;
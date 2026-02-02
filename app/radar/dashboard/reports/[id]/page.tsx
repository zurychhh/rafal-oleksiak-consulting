import React from 'react';
import ReportDetail from './ReportDetail';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ReportDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <ReportDetail reportId={id} />;
}

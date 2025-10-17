'use client';
import StatisticsView from '@/components/Statistics';
import { useEffect } from 'react';

export default function StatisticsPage() {
    useEffect(() => {
        document.title = 'B-JET Kana: Statistics';
    }, []);

    return <StatisticsView />;
}

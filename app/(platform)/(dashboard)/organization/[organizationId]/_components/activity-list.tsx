import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import { ActivityItem } from '@/components/activity-item';
import React from 'react'
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/db';

const ActivityList = async () => {
    const { orgId } = await auth();

    if (!orgId) {
        redirect("/select-org")
    }

    const auditLogs = await db.auditLog.findMany({
        where: {
            orgId
        }
    });

    // ActivityItem
    return (
        <ol className='space-y-4 mt-4'>
            <p className='hidden last:block text-xs text-center text-muted-foreground'>No activity found inside this organization</p>
            {
                auditLogs.map((log) => {
                    return <ActivityItem key={log.id} data={log} />
                })
            }
        </ol>
    )
}

ActivityList.Skeleton = function ActivityListSkeleton(){
    return (
        <ol className='space-y-4 mt-4'>
            <Skeleton  className='w-[80%] h-14' />
            <Skeleton  className='w-[50%] h-14' />
            <Skeleton  className='w-[70%] h-14' />
            <Skeleton  className='w-[80%] h-14' />
            <Skeleton  className='w-[750%] h-14' />
            <Skeleton  className='w-[40%] h-14' />
            <Skeleton  className='w-[55%] h-14' />
        </ol>
    )
}

export default ActivityList

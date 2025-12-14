import Link from 'next/link'
import { getRoutineWithItems } from '../actions'
import { RoutineList } from './_components/routine-list'

export default async function RoutineDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const { routine, items, error } = await getRoutineWithItems(id)

    if (error) {
        return <div className="p-4 text-destructive">Error: {error}</div>
    }

    return (
        <div className="p-4">
            <Link
                href="/routines"
                className="text-sm text-muted-foreground hover:underline mb-4 inline-block"
            >
                ← Back to routines
            </Link>

            <h1 className="text-2xl font-bold mb-4">{routine?.title}</h1>

            <h2 className="text-lg font-semibold mb-2">Items ({items?.length ?? 0})</h2>
            <RoutineList items={items ?? []} />
        </div>
    )
}

import Link from 'next/link'
import { getRoutines } from './actions'
import { RoutineBoard } from './_components/routine-board'
import { Button } from '@repo/design-system/components/ui/button'

export default async function RoutinesPage() {
    const { routines, error } = await getRoutines()

    if (error) {
        return <div className="p-4 text-destructive">Error: {error}</div>
    }

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Your Routines</h1>
                <Button asChild>
                    <Link href="/routines/create">Add a routine</Link>
                </Button>
            </div>
            <RoutineBoard routines={routines ?? []} />
        </div>
    )
}

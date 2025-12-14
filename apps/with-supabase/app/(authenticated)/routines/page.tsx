import Link from 'next/link'
import { getRoutines } from './actions'

export default async function RoutinesPage() {
    const { routines, error } = await getRoutines()

    if (error) {
        return <div className="p-4 text-destructive">Error: {error}</div>
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Routines</h1>
            <div className="space-y-4">
                {routines?.map((routine) => (
                    <Link
                        key={routine.id}
                        href={`/routines/${routine.id}`}
                        className="block hover:opacity-80 transition-opacity"
                    >
                        <pre className="bg-muted p-4 rounded-lg overflow-auto">
                            {JSON.stringify(routine, null, 2)}
                        </pre>
                    </Link>
                ))}
                {routines?.length === 0 && (
                    <p className="text-muted-foreground">No routines yet.</p>
                )}
            </div>
        </div>
    )
}

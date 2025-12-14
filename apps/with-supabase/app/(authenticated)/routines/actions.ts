'use server'

import { cache } from 'react'
import { revalidatePath } from 'next/cache'
import { createClient } from '@repo/supabase/server'

// React cache() deduplicates within a single request
// This is better for user-specific data with RLS
export const getRoutines = cache(async () => {
    const supabase = await createClient()

    const { data: routines, error } = await supabase
        .from('routines')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching routines:', error)
        return { error: error.message, routines: null }
    }

    return { routines, error: null }
})

export const getRoutineWithItems = cache(async (routineId: string) => {
    const supabase = await createClient()

    // Fetch routine
    const { data: routine, error: routineError } = await supabase
        .from('routines')
        .select('*')
        .eq('id', routineId)
        .single()

    if (routineError) {
        console.error('Error fetching routine:', routineError)
        return { error: routineError.message, routine: null, items: null }
    }

    // Fetch routine items
    const { data: items, error: itemsError } = await supabase
        .from('routine_items')
        .select('*')
        .eq('routine_id', routineId)
        .order('position', { ascending: true })

    if (itemsError) {
        console.error('Error fetching routine items:', itemsError)
        return { error: itemsError.message, routine, items: null }
    }

    return { routine, items, error: null }
})

// Revalidation helper - call after mutations
export async function revalidateRoutines() {
    revalidatePath('/routines')
}

export async function revalidateRoutine(routineId: string) {
    revalidatePath(`/routines/${routineId}`)
    revalidatePath('/routines')
}

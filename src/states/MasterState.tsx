import {create} from 'zustand'

interface MasterState {
    count: number
    increase: () => void
}

export const useMasterState = create <MasterState>()(
    (set) => ({
        count: 0,
        increase: () => set((state) => ({count: state.count + 1}))
    })
)
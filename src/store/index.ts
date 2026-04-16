import { create } from 'zustand'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface State {
  // Add your state properties here
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Actions {
  // Add your actions here
  _set: (updater: Partial<State> | ((state: State) => Partial<State>)) => void
}

export const useStore = create<State & Actions>()((set) => ({
  _set: (updater) => set(updater),
}))

export type { State, Actions }

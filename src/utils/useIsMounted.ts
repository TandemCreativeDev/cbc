import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export default function useIsMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}

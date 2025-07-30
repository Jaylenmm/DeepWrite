import { useSessionContext } from "@/lib/context/SessionContext";
export function useSession() {
  return useSessionContext();
} 
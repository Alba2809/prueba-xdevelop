"use client";

import { useAuthStore } from "@/stores/auth.store";
import { useEffect } from "react";

type ClientInitializerProps = {
  role: "admin" | "user" | null;
  accessToken: string | null;
  userId: number | null;
};

export default function ClientInitializer({
  role,
  accessToken,
  userId,
}: ClientInitializerProps) {
  const setRole = useAuthStore((s) => s.setRole);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setUserId = useAuthStore((s) => s.setUserId);

  useEffect(() => {
    if (role) setRole(role);
    if (accessToken) setAccessToken(accessToken);
    if (userId) setUserId(userId);
  }, [role, accessToken, userId]);

  return null;
}

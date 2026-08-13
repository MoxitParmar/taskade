"use client";

import OrganizationSwitcher1 from "@/components/auth/organization-switcher-1";
import { useEffect, useState } from "react";

export function OrgSwitcher() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Defer the state update to the next macrotask to avoid synchronous setState in the effect,
    // which can trigger cascading renders and the React warning.
    const id = window.setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  if (!mounted) return null;

  return <OrganizationSwitcher1 />;
}

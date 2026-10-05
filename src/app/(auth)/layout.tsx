export default function AuthLayout({ children }: { children: React.ReactNode }) {
  // Each auth page owns its own full-height wrapper so backgrounds can differ per page.
  return <>{children}</>;
}

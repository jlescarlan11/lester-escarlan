import React from "react";

const NAVBAR_HEIGHT = 48; // px, adjust if your navbar is taller/shorter
const NAVBAR_TOP_OFFSET = 24; // px, for top-6 (1.5rem = 24px)

export default function NavbarSpacer({ visible }: { visible: boolean }) {
  return (
    <div
      style={{
        height: NAVBAR_HEIGHT + NAVBAR_TOP_OFFSET,
        transition: 'opacity 0.2s',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    />
  );
} 
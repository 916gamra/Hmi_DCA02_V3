# Trivium HMI Tray Designer

A high-performance web-based CAD/CAM tool for designing and simulating circular tray drilling patterns for industrial 3-head radial machines.

## Tech Stack
- React + Vite
- TypeScript
- Tailwind CSS

## Architecture
- **Core Engine:** Handles geometry calculations (`model.ts`), timeline generation (`timeline.ts`), and G-code/JSON export functionality.
- **UI Components:** Modular React components using Tailwind CSS for UI, `lucide-react` for icons, and `CanvasStage` for visual feedback.
- **PWA Capabilities:** Supports offline installation to run as a standalone machine control tool on smartphones.

## Key Features
- **Auto Design:** Automatically calculates layer spacing and radial expansion based on tray diameter, tool size, and desired clearance.
- **Simulation:** Real-time visualization of drilling cycles, radial movements, and rotational speeds.
- **PLC Export:** Generates recipe files compatible with TouchWin PLC HMI systems.
- **G-Code Recipe Exchange:** Supports standard text-based recipe exchange between devices via G-code/JSON formats.
- **Manual Mode:** Direct control of axis expansion and rotation for testing.

## Documentation Note
- `TouchWinScreenMirror.tsx`: This component simulates the HMI screen (TouchWin OP320) to provide operators with a familiar interface for setting parameters directly on the machine control.

// components/Footer.tsx
export default function Footer() {
    return (
        <footer style={{ backgroundColor: "transparent", position: "fixed", zIndex: 999, top: "auto", bottom: "20px" }} className="w-full py-4 text-center text-sm text-zinc-500">
            © {new Date().getFullYear()} Snapzel. Crafted with 🧠 and ☕ in the Philippines.
        </footer>
    );
}

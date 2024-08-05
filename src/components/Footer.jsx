export default function Footer() {
  return (
    <footer className="footer footer-center bg-primary text-primary-content p-8">
      <aside>
        <p className="font-bold text-2xl">Pokemon game</p>
        <p className="font-bold">Copyright © {new Date().getFullYear()} - All right reserved</p>
      </aside>
    </footer>
  );
}

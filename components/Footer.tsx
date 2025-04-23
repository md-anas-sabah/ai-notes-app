export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="container mx-auto text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} AI Notes App. All rights reserved.</p>
      </div>
    </footer>
  );
}

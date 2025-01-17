export default function Footer() {
  return (
    <footer className="fixed bottom-0 w-full bg-white shadow-lg p-4 border-t-2 border-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center items-center">
          <p className="text-gray-900 font-medium text-center">
            &copy; {new Date().getFullYear()} made in{" "}
            <a 
              href="https://sundai.club"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-600 hover:text-yellow-500 transition-colors"
            >
              sundai.club
            </a>
            {" "}for MIT course 6.S093{" "}
            <a 
              href="https://iap.sundai.club"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-600 hover:text-yellow-500 transition-colors"
            >
              How to Ship Almost Anything with AI
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
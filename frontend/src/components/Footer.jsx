import { Globe } from 'lucide-react';
import  { FiGithub } from 'react-icons/fi';
import { CiLinkedin, CiMail } from 'react-icons/ci';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-3">About</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://ariqgchowdhury.github.io/portfolio"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  Website
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/AriqGChowdhury"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <FiGithub className="w-4 h-4" />
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/ariqchowdhury123"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <CiLinkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Contact Me</h3>
            <a
              href="mailto:ariq922@hotmail.com"
              className="hover:text-white transition-colors flex items-center gap-2"
            >
              <CiMail className="w-4 h-4" />
              ariq922@hotmail.com
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} AI Interviewer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
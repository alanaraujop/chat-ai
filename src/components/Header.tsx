'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user, signOut } = useAuth();

  // if (!user) return null;

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase() || 'Eu';
  };

  const getUserName = () => {
    return 'Eu'
    // return user.user_metadata?.full_name || user.email;
  };

  return (
    <header className="navbar bg-base-100 shadow-lg px-4">
      <div className="flex-1">
        <h1 className="text-xl font-bold">FragrâncIA</h1>
      </div>
      
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
          >
            <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
              {user?.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <span className="text-sm font-medium">
                 Eu {/* {getInitials(user?.email)} */}
                </span>
              )}
            </div>
          </div>
          
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li className="menu-title">
              <span>{getUserName()}</span>
            </li>
            <li>
              <button
                onClick={signOut}
                className="text-error hover:bg-error hover:text-error-content"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sair
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
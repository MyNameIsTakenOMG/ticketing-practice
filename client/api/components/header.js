import Link from 'next/link';

export default ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign up', href: '/auth/signup' },
    !currentUser && { label: 'Sign in', href: '/auth/signin' },
    currentUser && { label: 'Sell tickets', href: '/tickets/new' },
    currentUser && { label: 'My orders', href: '/orders' },
    currentUser && { label: 'Sign out', href: '/auth/signout' },
  ]
    .filter((link) => link)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link href={href} className="nav-link">
            {label}
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/" className="navbar-brand">
        GitTix
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
          {/* {currentUser ? 'Sign out' : 'Sign in/up'} */}
          {links}
        </ul>
      </div>
    </nav>
  );
};

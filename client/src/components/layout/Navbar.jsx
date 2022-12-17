const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-light py-3">
      <div className="container">
        <a className="navbar-brand" href="#">
          DevConnector
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav me-auto">
            <a className="nav-link" href="#">
              Developers
            </a>
          </div>
          <div className="navbar-nav ms-auto">
            <a className="nav-link" href="#">
              Sign Up
            </a>
            <a className="nav-link" href="#">
              Login
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

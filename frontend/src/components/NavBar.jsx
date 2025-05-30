import { useNavigate } from "react-router-dom";
import { Navbar, Container, Nav, Button } from "react-bootstrap";

function NavBar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear()
    setUser(null);
    navigate('/login');
  }
  
  return (
    
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="#home">AI Interviewer</Navbar.Brand>
        <Nav className="me-auto">
          {user ? (
            <>
              <Nav.Link onClick={() => navigate("/dashboard")}>Home</Nav.Link>
              <Nav.Link onClick={() => navigate("/settings")}>Settings</Nav.Link>
            </>
          ) : (
              <Nav.Link onClick={() => navigate("/")}>Home</Nav.Link>
          )}
          
        </Nav>

        <Nav className="ms-auto">
          {user ? (
              <>
                  <Navbar.Text className="me-2">Hello, {user.username}</Navbar.Text>
                  <Button onClick={handleLogout} variant="outline-light">Logout</Button>
              </>
          ) : (
              <Button onClick={() => navigate("/login")} variant="success">Sign In</Button>
          )}
  </Nav>
      </Container>
    </Navbar>
  );
}

export default NavBar;
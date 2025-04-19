import styled from 'styled-components';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  font-weight: bold;
  color: #ff9f1c;
`;

const Nav = styled.nav`
  display: flex;
  gap: 20px;
`;

const NavLink = styled.a`
  color: #ff9f1c;
  text-decoration: none;
  font-weight: 600;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Logo>
        🐁 MouseMap
      </Logo>
      <Nav>
        <NavLink href="#">Profile</NavLink>
        <NavLink href="#">Leaderboard</NavLink>
        <NavLink href="#">Log Out</NavLink>
      </Nav>
    </HeaderContainer>
  );
};

export default Header; 
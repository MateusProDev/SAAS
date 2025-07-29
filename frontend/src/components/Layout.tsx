import React, { type ReactNode } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '@tanstack/react-router';
import PlanBadge from './PlanBadge';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate({ to: '/login' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLogoClick = () => {
    navigate({ to: '/dashboard' });
  };

  return (
    <LayoutContainer>
      <Header>
        <Logo onClick={handleLogoClick}>
          <h2>🌐 SaaS Builder</h2>
        </Logo>
        {user && (
          <UserMenu>
            <UserInfo>
              <span>{user.displayName || user.email}</span>
              <PlanBadge />
            </UserInfo>
            <LogoutButton onClick={handleLogout}>
              Sair
            </LogoutButton>
          </UserMenu>
        )}
      </Header>
      <Main>
        {children}
      </Main>
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.div`
  cursor: pointer;
  h2 {
    margin: 0;
    color: #2c3e50;
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const LogoutButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #c0392b;
  }
`;

const Main = styled.main`
  flex: 1;
  background: #f8f9fa;
`;

export default Layout;

import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logoImg from "../styles/logo.svg"    // 로고 이미지

const Header: React.FC = () => {

  // 오픈 이벤트
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleNavToggle = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <header className="header">
      <div className="inner">
        <a className="logo" href="/"></a>

        {/* 네비게이션 메뉴 */}
        <nav className={`nav ${isNavOpen ? "open" : ""}`}>
          <ul>
            <li>
              <NavLink to="/Guide" className={({ isActive }) => (isActive ? "active" : "")}>
                서비스 소개
              </NavLink>
            </li>
            <li>
              <NavLink to="/FAQ" className={({ isActive }) => (isActive ? "active" : "")}>
                자주 묻는 질문
              </NavLink>
            </li>
            <li>
              <NavLink to="/News" className={({ isActive }) => (isActive ? "active" : "")}>
                새소식
              </NavLink>
            </li>
            <li>
              <NavLink to="/Counsel" className={({ isActive }) => (isActive ? "active" : "")}>
                상담문의
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* 메뉴 버튼 */}
        <span className="util">
          <button type="button" className="nav-toggle" onClick={handleNavToggle}>
            {isNavOpen ? "메뉴 닫기" : "메뉴 열기"}
          </button>
        </span>
      </div>
    </header>
  );
};

export default Header;
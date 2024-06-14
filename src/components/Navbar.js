import React, { useState } from "react";
import { FaAlignLeft, FaCaretDown, FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Logo } from "./index";
import { logoutUser, toggleSidebar } from "../features/user/userSlice";
import Wrapper from "../assets/wrappers/Navbar";

const Navbar = () => {
  const [showLogout, setShowLogout] = useState(false);

  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const toggle = () => {
    dispatch(toggleSidebar());
  };
  const logout = ()=>{
    dispatch(logoutUser())
  }
  return (
    <Wrapper>
      <div className="nav-center">
        <button type="button" className="toggle-btn" onClick={toggle}>
          <FaAlignLeft />
        </button>
        <div>
          <Logo />
          <h3 className="logo-text">dashboard</h3>
        </div>
        <div className="btn-container">
          <button
            className="btn"
            type="button"
            onClick={() => setShowLogout(!showLogout)}
          >
            <FaUserCircle />
            {user?.name}
            <FaCaretDown />
          </button>
          <div className={showLogout ? "dropdown show-dropdown" : "dropdown"}>
            <button
              type="button"
              className="dropdown-btn"
              onClick={logout}
            >
              logout
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Navbar;

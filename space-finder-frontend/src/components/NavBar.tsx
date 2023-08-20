import { NavLink } from "react-router-dom";

type NavBarProps = {
  username: string | undefined;
};

const NavBar = ({ username }: NavBarProps) => {
  const rednerLoginLogout = () => {
    if (username) {
      return (
        <NavLink to="/logout" style={{ float: "right" }}>
          {username}
        </NavLink>
      );
    } else {
      return (
        <NavLink to="/login" style={{ float: "right" }}>
          Login
        </NavLink>
      );
    }
  };


  return (
    <div className="navbar">
      <NavLink to={"/"}>Home</NavLink>
      <NavLink to={"/profile"}>Profile</NavLink>
      <NavLink to={"/spaces"}>Spaces</NavLink>
      <NavLink to={"/create-space"}>Create Space</NavLink>
      {rednerLoginLogout()}
    </div>
  );
};

export default NavBar;

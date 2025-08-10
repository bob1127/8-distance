import Link from "next/link";

const Nav = () => {
  return (
    <nav className="border-b-1 border-black fixed z-50 w-screen ">
      <div className="relative w-full justify-between flex">
        <div className="nav-logo w-[15%]">
          <Link href="/">Silhouette</Link>
        </div>
        <div className="nav-links w-[65%] flex justify-between ">
          <Link href="/">Index</Link>
          <Link href="/service">Archive</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div className="w-[20%]"></div>
      </div>
    </nav>
  );
};

export default Nav;

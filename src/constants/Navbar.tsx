"use client";
import React, { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";


interface NavLinks {
  label: string;
  href: string;
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  // const navLinks: NavLinks[] = [
  //   { label: "Home", href: "/" },
  //   { label: "About", href: "/about" },
  //   { label: "Contact", href: "/contact" },
  // ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="w-full flex flex-row justify-between items-center p-6">
      <h1 className="text-4xl text-red-600 cursor-pointer">SABER.PUMP</h1>

      <div className="hidden md:flex space-x-4">
        <ConnectButton />
      </div>
    </nav>
  );
};

export default Navbar;

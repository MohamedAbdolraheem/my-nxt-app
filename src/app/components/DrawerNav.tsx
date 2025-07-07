"use client";
import React, { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact-us", label: "Contact Us" },
  { href: "/sigin", label: "Sign In" },
  { href: "/login", label: "Login" },
];

export default function DrawerNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full">
      {/* Desktop nav */}
      <ul className="hidden sm:flex gap-8 text-base sm:text-lg font-medium items-center justify-center py-4 sm:py-6">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="hover:underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      {/* Mobile hamburger */}
      <div className="flex sm:hidden items-center justify-between py-4 px-2">
        <button
          aria-label="Open navigation menu"
          className="text-white focus:outline-none"
          onClick={() => setOpen(true)}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {/* Drawer overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setOpen(false)} />
      )}
      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full"}`}
        style={{ willChange: "transform" }}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <span className="font-bold text-lg text-blue-700 dark:text-white">Menu</span>
          <button
            aria-label="Close navigation menu"
            className="text-gray-700 dark:text-white focus:outline-none"
            onClick={() => setOpen(false)}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ul className="flex flex-col gap-4 p-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
} 
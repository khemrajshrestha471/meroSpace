"use client";

import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

import { ImUpload } from "react-icons/im";
import { TbMapSearch } from "react-icons/tb";

const Navbar = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            meroSpace
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Link
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Dropdown
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="#">
                      Action
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Another action
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Something else here
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <a className="nav-link disabled" aria-disabled="true">
                  Disabled
                </a>
              </li>
            </ul>
            <div className="flex space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Login</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-46">
                  <DropdownMenuGroup>
                    <Link
                      href="/login-as-uploader"
                      className="no-underline text-black"
                    >
                      <DropdownMenuItem>
                        <ImUpload className="mr-2 h-4 w-4" />
                        <span className="cursor-pointer">
                          Login as Uploader
                        </span>
                      </DropdownMenuItem>
                    </Link>
                    <Link
                      href="/login-as-seeker"
                      className="no-underline text-black"
                    >
                      <DropdownMenuItem>
                        <TbMapSearch className="mr-2 h-4 w-4" />

                        <span className="cursor-pointer">Login as Seeker</span>
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Register</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-46">
                  <DropdownMenuGroup>
                    <Link
                      href="/register-as-uploader"
                      className="no-underline text-black"
                    >
                      <DropdownMenuItem>
                        <ImUpload className="mr-2 h-4 w-4" />

                        <span className="cursor-pointer">
                          Register as Uploader
                        </span>
                      </DropdownMenuItem>
                    </Link>
                    <Link
                      href="/register-as-seeker"
                      className="no-underline text-black"
                    >
                      <DropdownMenuItem>
                        <TbMapSearch className="mr-2 h-4 w-4" />

                        <span className="cursor-pointer">
                          Register as Seeker
                        </span>
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

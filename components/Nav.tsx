"use client";

import Link from "next/link";
import Image from "next/image";
import "../styles/components_css/Nav.css";
import "../styles/global.css";
import { useState, useEffect, FC } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import GoogleIcon from "@mui/icons-material/Google";

interface Provider {
  id: string;
  name: string;
  // add other properties of provider as needed
}

const Nav: FC = () => {
  const { data: session, status } = useSession();

  const [providers, setProviders] = useState<Provider[] | null>(null);
  const [toggleDropdown, setToggleDropdown] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const res: any = await getProviders();

      setProviders(res);
    })();
  }, []);

  return (
    <nav className="nav_container">
      <Link href="/" className="nav_logo_link">
        <Image
          src="/assets/images/logo.svg"
          alt="logo"
          className="nav_logo_image"
          width={30}
          height={30}
        />
        <p className="nav_logo_text">UI-topia</p>
      </Link>

      {/* Desktop Navigation */}
      <div className="desktop_nav">
        {session?.user ? (
          <div className="nav_btn_container">
            <Link href="/createUiComp" className="black_btn">
              Share Component
            </Link>
            <Link href="/MyComps" className="outline_btn">
              My Components
            </Link>
            <button
              type="button"
              className="outline_btn"
              onClick={() => signOut()}
            >
              Sign Out
            </button>

            <Link href="/Profile">
              <Image
                src={session?.user.image || "/assets/images/logo-text.svg"}
                alt="profile-logo"
                width={60}
                height={60}
                className="nav-desktop-profile"
              />
            </Link>
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => {
                    signIn(provider.id);
                  }}
                  className="black_btn"
                >
                  Sign in with <GoogleIcon />
                  {/* <img src="/assets/icons/googleIcon.png" alt="Google Icon" /> */}
                </button>
              ))}
          </>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="mobile_nav">
        {session?.user ? (
          <div>
            <div>
              {" "}
              <Image
                src="/assets/images/logo-text.svg"
                alt="profile-logo"
                width={37}
                height={37}
                onClick={() => setToggleDropdown((prev) => !prev)}
              />
            </div>

            {toggleDropdown && (
              <div className="dropdown">
                <Link
                  href="/Profile"
                  className="dropdown_link"
                  onClick={() => setToggleDropdown(false)}
                >
                  My Profile
                </Link>
                <Link
                  href="/createUiComp"
                  className="dropdown_link"
                  onClick={() => setToggleDropdown(false)}
                >
                  Create UI Component
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setToggleDropdown(false);
                    signOut();
                  }}
                  className="black_btn"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => {
                    signIn(provider.id);
                  }}
                  className="black_btn"
                >
                  Sign in
                </button>
              ))}
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;

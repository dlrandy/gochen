import React, { useEffect, useState } from "react";
import styles from "./navbar.module.css";

import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

// import { magic } from "../../lib/magic-client";

const NavBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState("");
  const [didToken, setDidToken] = useState("");
  const router = useRouter();

  // useEffect(() => {
  //   const applyUsernameInNav = async () => {
  //     try {
  //       const { email, issuer } = await magic.user.getMetadata();
  //       const didToken = await magic.user.getIdToken();
  //       if (email) {
  //         setUsername(email);
  //         setDidToken(didToken);
  //       }
  //     } catch (error) {
  //       console.error("Error retrieving email", error);
  //     }
  //   };
  //   applyUsernameInNav();
  // }, []);

  const handleOnClickHome = (e:React.SyntheticEvent<HTMLLIElement,MouseEvent>) => {
    e.preventDefault();
    router.push("/");
  };

  const handleOnClickMyList = (e:React.SyntheticEvent<HTMLLIElement,MouseEvent>) => {
    e.preventDefault();
    router.push("/browse/my-list");
  };

  const handleShowDropdown = (e:React.SyntheticEvent<HTMLButtonElement,MouseEvent>) => {
    e.preventDefault();
    setShowDropdown(!showDropdown);
  };

  const handleSignout = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${didToken}`,
          "Content-Type": "application/json",
        },
      });

      const res = await response.json();
    } catch (error) {
      console.error("Error logging out", error);
      router.push("/login");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Link className={styles.logoLink} href="/">
       
            <div className={styles.logoWrapper}>
              <Image
                src="/icons/netflix.svg"
                alt="Netflix logo"
                width={128}
                height={34}
              />
            </div>
        
        </Link>

        <ul className={styles.navItems}>
          <li className={styles.navItem} onClick={handleOnClickHome}>
            Home
          </li>
          <li className={styles.navItem2} onClick={handleOnClickMyList}>
            My List
          </li>
        </ul>
        <nav className={styles.navContainer}>
          <div>
            <button className={styles.usernameBtn} onClick={handleShowDropdown}>
              <p className={styles.username}>{username}</p>
              {/** Expand more icon */}
              <Image
                src={"/icons/expand_more.svg"}
                alt="Expand dropdown"
                width={24}
                height={24}
              />
            </button>

            {showDropdown && (
              <div className={styles.navDropdown}>
                <div>
                  <a className={styles.linkName} onClick={handleSignout}>
                    Sign out
                  </a>
                  <div className={styles.lineWrapper}></div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default NavBar;

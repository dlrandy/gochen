import Head from "next/head";
import NavBar from "../../../components/nav/navbar";

import SectionCards from "../../../components/netcard/section-cards";
import { redirectUser } from "../../../utils/index";
import { getMyList } from "../../../lib/videos";
import styles from "../../../styles/netflix/MyList.module.css";
import { NextPageContext } from "next";

export async function getServerSideProps(context:NextPageContext) {
  const { userId, token } = await redirectUser(context);

  if (!userId) {
    return {
      props: {},
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const videos = await getMyList(userId, token);

  return {
    props: {
      myListVideos: videos,
    },
  };
}

const MyList = ({ myListVideos }:any) => {
  return (
    <div>
      <Head>
        <title>My list</title>
      </Head>
      <main className={styles.main}>
        <NavBar />
        <div className={styles.sectionWrapper}>
          <SectionCards
            title="My List"
            videos={myListVideos}
            size="small"
            shouldWrap
            shouldScale={false}
          />
        </div>
      </main>
    </div>
  );
};

export default MyList;

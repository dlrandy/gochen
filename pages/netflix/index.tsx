import Head from "next/head";
import Banner from "../../components/netbanner/netbanner";
import styles from "../../styles/netflix/Home.module.css";
import NavBar from "../../components/nav/navbar";
import SectionCards from "../../components/netcard/section-cards/index";

import {
  getVideos,
  getPopularVideos,
  // getWatchItAgainVideos,
} from "../../lib/videos/index";
import { GetServerSideProps } from "next";
// import { redirectUser } from "../utils/redirectUser";

export async function getServerSideProps(context:GetServerSideProps<{}>) {
  // const { userId, token } = await redirectUser(context);

  // if (!userId) {
  //   return {
  //     props: {},
  //     redirect: {
  //       destination: "/login",
  //       permanent: false,
  //     },
  //   };
  // }
  const watchItAgainVideos: any[] = []; //await getWatchItAgainVideos(userId, token);

  const [disneyVideos, travelVideos, productivityVideos, popularVideos] =
    await Promise.all([
      getVideos("disney trailer"),
      getVideos("Productivity"),
      getVideos("indie music"),
      getPopularVideos(),
    ]);

  return {
    props: {
      disneyVideos,
      travelVideos,
      productivityVideos,
      popularVideos,
      watchItAgainVideos,
    },
  };
}
type IHome = {
  disneyVideos:any[],
  travelVideos:any[],
  productivityVideos:any[],
  popularVideos:any[],
  watchItAgainVideos:any[],
}
export default function Home({
  disneyVideos,
  travelVideos,
  productivityVideos,
  popularVideos,
  watchItAgainVideos,
}:IHome) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <NavBar />
        <Banner
          videoId="4zH5iYM4wJo"
          title="Clifford the red dog"
          subTitle="a very cute dog"
          imgUrl="/images/clifford.webp"
        />
        <div className={styles.sectionWrapper}>
          <SectionCards title="Disney" videos={disneyVideos} size="large" />
          <SectionCards
            title="Watch it again"
            videos={watchItAgainVideos}
            size="small"
          />
          <SectionCards title="Travel" videos={travelVideos} size="small" />
          <SectionCards
            title="Productivity"
            videos={productivityVideos}
            size="medium"
          />
          <SectionCards title="Popular" videos={popularVideos} size="small" />
        </div>
      </main>
    </div>
  );
}

import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/coffee-store/Home.module.css";
import Banner from "../../components/banner/banner";
import Card from "../../components/card/card";
import { GetStaticProps, GetStaticPropsResult } from "next";
import { fetchCoffeeStores } from "../../lib/coffee-store/service";
import { useRouter } from 'next/router';
import useTrackLocation from "../../hooks/use-track-location";
import { useEffect, useState, useContext } from 'react';
import { ACTION_TYPES, StoreContext } from "../../store/coffee-store/context";
type CoffeeStore = {
  id: string;
  name: string;
  imgUrl?: string;
};
type HomeProps = {
  coffeeStores: CoffeeStore[];
};

export const getStaticProps = async (
  context: GetStaticProps
): Promise<GetStaticPropsResult<HomeProps>> => {
  const coffeeStores: any[] = await fetchCoffeeStores();
  
  return {
    props:{coffeeStores}
  };
};

export default function Home(props:HomeProps) {
  const router = useRouter();
  // const [coffeeStores, setCoffeeStores] = useState([]);
  const [coffeeStoresError, setCoffeeStoresError] = useState<string>("");
  const {dispatch, state} =useContext(StoreContext);
  const { coffeeStores, latLong } = state;
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
    useTrackLocation();
    useEffect(() => {
      async function setCoffeeStoresByLocation() {
        if (latLong) {
          try {
            // const fetchedCoffeeStores = await fetchCoffeeStores(latLong, 6);
            const response = await fetch(
              `/api/coffee/getCoffeeStoreByLocation?latLong=${latLong}&limit=30`
            );
  
            const fetchedCoffeeStores = await response.json();
             
            // setCoffeeStores(fetchedCoffeeStores);
            dispatch({
              type: ACTION_TYPES.SET_COFFEE_STORES,
              payload: {
                coffeeStores: fetchedCoffeeStores,
              },
            });
            setCoffeeStoresError("");
          } catch (error:any) {
            setCoffeeStoresError(error.message);
         
          }
        }
      }
      setCoffeeStoresByLocation();
    }, [latLong,dispatch]);
    if (router.isFallback) {
    return <div>loading....</div>;
  }

  
 
  const buttonText: string = isFindingLocation ? "Locating..." : "View stores nearby";
  const handleOnBannerBtnClick = () => {
 

    handleTrackLocation();
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta
          name="description"
          content="allows you to discover coffee stores"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          title1="Coffee"
          title2="Connoisseur"
          subTitle="Discover your local coffee stores!"
        />
        <Image
          className={styles.heroImage}
          src="/images/hero-image.png"
          priority
          width={700}
          height={400}
          alt="hero image"
        />
        <div className={styles.buttonWrapper}>
          <button className={styles.button} onClick={handleOnBannerBtnClick}>{buttonText}</button>
          {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        </div>
        {coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}
        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores near me</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    key={coffeeStore.id}
                    name={coffeeStore.name}
                    imgUrl={
                      coffeeStore.imgUrl ||
                      "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                    }
                    href={`/coffee-store/${coffeeStore.id}`}
                    className={styles.card}
                  />
                );
              })}
            </div>
          </div>
        )}

        <div className={styles.sectionWrapper}>
          {props.coffeeStores.length > 0 && (
            <>
              <h2 className={styles.heading2}>Toronto stores</h2>
              <div className={styles.cardLayout}>
                {props.coffeeStores.map((coffeeStore) => {
                  return (
                    <Card
                      key={coffeeStore.id}
                      name={coffeeStore.name}
                      imgUrl={
                        coffeeStore.imgUrl ||
                        "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                      }
                      href={`/coffee-store/${coffeeStore.id}`}
                      className={styles.card}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

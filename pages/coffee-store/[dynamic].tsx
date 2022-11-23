import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

import cls from "classnames";

import styles from "../../styles/coffee-store/dynamic.module.css";
import { fetchCoffeeStores } from "../../lib/coffee-store/service";
 
import { GetStaticPathsResult, GetStaticPropsContext } from "next";
import { StoreContext } from '../../store/coffee-store/context';
import { isEmpty } from "../../utils";

type PageParams = {
  dynamic:string;
}
export async function getStaticProps(staticProps:GetStaticPropsContext<PageParams>) {
  const params = staticProps.params||{dynamic:''};

  const coffeeStores = await fetchCoffeeStores();
  const findCoffeeStoreById = coffeeStores.find((coffeeStore:CoffeStore) => {
    return coffeeStore.id.toString() === params.dynamic; //dynamic id
  });
  return {
    props: {
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    },
  };
}
type CoffeStore = {
  id: string;
  address: string;
  name: string;
  neighbourhood: string;
  imgUrl: string;
};

export async function getStaticPaths(...a:any):Promise<GetStaticPathsResult<PageParams>> {

  const coffeeStores = await fetchCoffeeStores();
  const paths = coffeeStores.map((coffeeStore: CoffeStore) => {
    return {
      params: {
        dynamic: coffeeStore.id.toString(),
      },
    };
  });
  console.log(paths)
  return {
    paths,
    fallback: true,
  };
}

const CoffeeStore = (initialProps:{coffeeStore:CoffeStore}) => {
 
  const router = useRouter();
  const id = router.query.dynamic;
  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);
  const {state:{coffeeStores}} = useContext(StoreContext)
  useEffect(()=>{
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
          return coffeeStore.id.toString() === id; //dynamic id
        });
        setCoffeeStore(findCoffeeStoreById);
      }
    }
  },[coffeeStores, id, initialProps.coffeeStore]);
  if (router.isFallback) {
    return <div>loading...</div>;
  }
  const { name, address, neighbourhood, imgUrl } = coffeeStore;
  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
        <meta name="description" content={`${name} coffee store`} />
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/coffee-store">
              <span>← Back to home</span>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            }
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name||""}
          />
        </div>

        <div className={cls("custom-glass", styles.col2)}>
          {address && (
            <div className={styles.iconWrapper}>
              <Image
                src="/icons/places.svg"
                width="24"
                height="24"
                alt="places icon"
              />
              <p className={styles.text}>{address}</p>
            </div>
          )}
          {neighbourhood && (
            <div className={styles.iconWrapper}>
              <Image
                src="/icons/nearMe.svg"
                width="24"
                height="24"
                alt="near me icon"
              />
              <p className={styles.text}>{neighbourhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              src="/icons/star.svg"
              width="24"
              height="24"
              alt="star icon"
            />
            <p className={styles.text}>345</p>
          </div>

          <button className={styles.upvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;

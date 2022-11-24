import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import useSWR from 'swr';
import cls from "classnames";

import styles from "../../styles/coffee-store/dynamic.module.css";
import { fetchCoffeeStores } from "../../lib/coffee-store/service";
 
import { GetStaticPathsResult, GetStaticPropsContext } from "next";
import { StoreContext } from '../../store/coffee-store/context';
import { isEmpty, fetcher } from "../../utils";

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
  voting?: number;
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
  return {
    paths,
    fallback: true,
  };
}

const CoffeeStore = (initialProps:{coffeeStore:CoffeStore}) => {
 
  const router = useRouter();
  const id = router.query.dynamic;
  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore||{});
  const {state:{coffeeStores}} = useContext(StoreContext);
  const handleCreateCoffeeStore = async (coffeeStore:CoffeStore) => {
    try {
      const { id, name, voting, imgUrl, neighbourhood, address } = coffeeStore;
      const response = await fetch("/api/coffee/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          voting: 0,
          imgUrl,
          neighbourhood: neighbourhood || "",
          address: address || "",
        }),
      });

      const dbCoffeeStore = await response.json();
    } catch (err) {
      console.error("Error creating coffee store", err);
    }
  };
  useEffect(()=>{
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const findCoffeeStoreInContext = coffeeStores.find((coffeeStore) => {
          return coffeeStore.id.toString() === id; //dynamic id
        });
        if (findCoffeeStoreInContext) {   
          setCoffeeStore(findCoffeeStoreInContext);
          handleCreateCoffeeStore(findCoffeeStoreInContext);
        }
      }
    } else {
      //SSG
      handleCreateCoffeeStore(initialProps.coffeeStore||{});
    }
  },[coffeeStores, id, initialProps.coffeeStore]);
  
  const { name, address, neighbourhood, imgUrl } = coffeeStore;
  const [votingCount, setVotingCount] = useState(0);
  const { data, error } = useSWR(`/api/coffee/getCoffeeStoreById?id=${id}`, fetcher);
  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStore(data[0]);
      setVotingCount(data[0].voting);
    }
  }, [data]);
  if (router.isFallback) {
    return <div>loading...</div>;
  }
  if (error) {
    return <div>Something went wrong retrieving coffee store page</div>;
  }
  const handleUpvoteButton = async () => {
    try {
      const response = await fetch("/api/coffee/favouriteCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const dbCoffeeStore = await response.json();

      if (dbCoffeeStore && dbCoffeeStore.length > 0) {
        let count = votingCount + 1;
        setVotingCount(count);
      }
    } catch (err) {
      console.error("Error upvoting the coffee store", err);
    }
  };
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
           <p className={styles.text}>{votingCount}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;

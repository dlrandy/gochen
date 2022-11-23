import styles from './banner.module.css';

type BannerProps = {
  title1?:string;
  title2?:string;
  subTitle?:string;
};
export default function Banner({
  title1 = 'GoChen',
  title2 = 'Space',
  subTitle = 'Welcome to the web site!',
}:BannerProps) {
  return (
    <div className={styles.container} >
        <h1 className={styles.title}>
            <span className={styles.title1}>{title1}</span>
            <span className={styles.title2}>{title2}</span>
        </h1>
        <p className={styles.subTitle}>
            {subTitle}
        </p>
    </div>
  )
}

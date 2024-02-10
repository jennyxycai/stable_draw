import { useRouter } from 'next/router';
import styles from '../styles/Shop.module.css'; // Import the CSS module

const Shop = () => {
    const router = useRouter();
    const { finalURL } = router.query;

    const createBingImageUrl = (imageUrl) => {
        if (!imageUrl) return '';
        const encodedUrl = encodeURIComponent(imageUrl);
        return `https://www.bing.com/images/search?view=detailv2&iss=SBI&form=SBIIDP&q=imgurl:${encodedUrl}&idpbck=1&vt=3&cal=0.44700462&cab=0.34&cat=0&selectedindex=0&id=${encodedUrl}&mediaurl=${encodedUrl}&exph=0&expw=0&sim=1`;
    };

    const bingUrl = createBingImageUrl(finalURL);

    return (
        <div className={styles.iframeContainer}>
            {bingUrl && (
                <iframe 
                    src={bingUrl} 
                    className={styles.iframeStyle}
                    title="Bing Image Search"
                />
            )}
            {/* Rest of your page content */}
        </div>
    );
};

export default Shop;

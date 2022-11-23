import { useRouter } from 'next/router';
import Link from 'next/link';
export default function GraphqlItem() {
    const router = useRouter();
    return <div>
        <Link href="/"><a>BackToHome</a></Link>
        Graphql item:{router.query.id}
    </div>
};

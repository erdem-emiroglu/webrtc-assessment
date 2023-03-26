import Head from "next/head";

const metaDescription = 'WebRTC based chat application';
const metaTitle = 'OCRLabs - Assessment';

export const SEOHeader = () => {
    return (
        <Head>
            <title>{metaTitle}</title>
            <meta name="description" content={metaDescription}/>
        </Head>
    )
}

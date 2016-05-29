const origin = 'https://samefourchords-com-images.imgix.net';
const createSrc = (slug: string, file: string, width: number, isHighDpi: boolean): string => {
    const path = encodeURI(`/${slug}/${file}`);
    const params = `w=${width}&${(isHighDpi ? 'auto=format&q=25&usm=20' : 'auto=format%2Ccompress')}`;
    return `${origin}${path}?${params}`
};

export default createSrc;

import img1 from '../assets/news/earthquake.jpg';
import img2 from '../assets/news/flood.jpg';
import img3 from '../assets/news/news1.jpg';
import img4 from '../assets/news/news2.jpg';
import winterSuppliesImg from '../assets/news/winter-supplies.jpg';
import winterConvoyImg from '../assets/news/winter-convoy.jpg';
import schoolCeremonyImg from '../assets/news/school-ceremony.jpg';
import schoolBagsImg from '../assets/news/school-bags.jpg';
import medicalClinicImg from '../assets/news/medical-clinic.jpg';
import medicalMedicineImg from '../assets/news/medical-medicine.jpg';
import waterWellImg from '../assets/news/water-well.jpg';
import waterPumpImg from '../assets/news/water-pump.jpg';
import newsInitialData from '../data/news.json';

// Every picture that was ever saved into src/assets/uploads (older articles reference these by path)
const uploadedAssetUrls = import.meta.glob('../assets/uploads/*.{jpg,jpeg,png,webp,gif,JPG,JPEG,PNG}', {
    eager: true,
    query: '?url',
    import: 'default'
});
const uploadsMap = Object.fromEntries(
    Object.entries(uploadedAssetUrls).map(([path, url]) => [path.split('/').pop(), url])
);

// Image mapping for filenames stored in JSON
const imageMap = {
    'winter-supplies.jpg': winterSuppliesImg,
    'winter-convoy.jpg': winterConvoyImg,
    'school-ceremony.jpg': schoolCeremonyImg,
    'school-bags.jpg': schoolBagsImg,
    'medical-clinic.jpg': medicalClinicImg,
    'medical-medicine.jpg': medicalMedicineImg,
    'water-well.jpg': waterWellImg,
    'water-pump.jpg': waterPumpImg,
    'earthquake.jpg': img1,
    'flood.jpg': img2,
    'news1.jpg': img3,
    'news2.jpg': img4,
    ...uploadsMap
};

export const resolveImageUrl = (img) => {
    if (!img) return winterSuppliesImg;
    if (typeof img !== 'string') return img;
    // Data URLs, Blobs, and external HTTP URLs (e.g. Vercel Blob) can be used directly
    if (img.startsWith('data:') || img.startsWith('blob:') || img.startsWith('http://') || img.startsWith('https://')) {
        return img;
    }
    if (imageMap[img]) return imageMap[img];
    const filename = img.split('/').pop().split('\\').pop();
    if (imageMap[filename]) return imageMap[filename];
    return img;
};

const toContentArray = (content, fallback = ["No details provided."]) => (
    Array.isArray(content)
        ? content
        : (typeof content === 'string'
            ? content.split('\n\n').filter(p => p.trim())
            : fallback)
);

const normalizeArticle = (article) => {
    if (!article) return article;
    return {
        ...article,
        content: toContentArray(article.content),
        image: resolveImageUrl(article.image),
        relatedImages: (article.relatedImages || []).map(item => ({
            ...(typeof item === 'object' ? item : {}),
            url: resolveImageUrl(item && item.url ? item.url : item)
        }))
    };
};

const sortNewestFirst = (list) => [...list].sort((a, b) => {
    const dateA = new Date(a.date || 0).getTime();
    const dateB = new Date(b.date || 0).getTime();
    if (dateB !== dateA) return dateB - dateA;
    return Number(b.id || 0) - Number(a.id || 0);
});

/**
 * Client-side Canvas Image Compression
 * Shrinks uploaded 5MB-15MB photos down to ~120KB while preserving retina clarity.
 */
export const compressImageFile = (file, maxWidth = 1600, maxHeight = 1600, quality = 0.82) => {
    return new Promise((resolve) => {
        if (!file) {
            resolve('');
            return;
        }
        if (typeof file === 'string') {
            resolve(file);
            return;
        }
        // If not an image or is an animated GIF, read as regular data URL
        if (!file.type || !file.type.startsWith('image/') || file.type === 'image/gif') {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => resolve('');
            reader.readAsDataURL(file);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                if (width > maxWidth || height > maxHeight) {
                    if (width / height > maxWidth / maxHeight) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    } else {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Use JPEG for optimal photo compression and compatibility
                const outputFormat = file.type === 'image/png' ? 'image/jpeg' : (file.type || 'image/jpeg');
                const compressedUrl = canvas.toDataURL(outputFormat, quality);
                resolve(compressedUrl);
            };
            img.onerror = () => {
                resolve(reader.result);
            };
            img.src = e.target.result;
        };
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
    });
};


/**
 * Server API helpers.
 * News and pictures are stored on the server (Vercel Blob in production,
 * src/data/news.json + src/assets/uploads when running `npm run dev`).
 * Writes require an admin session token issued by /api/login.
 */
const TOKEN_KEY = 'umca_auth_token';

export const getAuthToken = () => {
    try {
        return localStorage.getItem(TOKEN_KEY) || '';
    } catch (e) {
        return '';
    }
};

const isRealJsonResponse = (response) => {
    const contentType = (response && response.headers.get('content-type')) || '';
    return contentType.includes('application/json');
};

const apiRequest = async (url, { method = 'GET', body, auth = false } = {}) => {
    const headers = {};
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (auth) {
        const token = getAuthToken();
        if (!token) throw new Error('You are not signed in. Please log in again.');
        headers.Authorization = `Bearer ${token}`;
    }

    let response;
    try {
        response = await fetch(url, {
            method,
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined,
            cache: 'no-store'
        });
    } catch (e) {
        throw new Error('Could not reach the server. Check your internet connection and try again.');
    }

    if (!isRealJsonResponse(response)) {
        throw new Error('The news server is not available.');
    }
    const data = await response.json().catch(() => null);
    if (response.status === 401) {
        throw new Error((data && data.error) || 'Your session has expired. Please log in again.');
    }
    if (!response.ok) {
        throw new Error((data && data.error) || `Request failed (${response.status})`);
    }
    return data;
};

/**
 * Upload Image: compresses in the browser, then stores it on the server.
 * Returns the permanent picture URL.
 */
export const uploadImage = async (file) => {
    const compressedDataUrl = await compressImageFile(file, 1600, 1600, 0.82);
    if (!compressedDataUrl) throw new Error('Could not read the selected picture.');
    const result = await apiRequest('/api/upload', {
        method: 'POST',
        auth: true,
        body: { filename: file.name || 'photo.jpg', data: compressedDataUrl }
    });
    if (!result || !result.url) throw new Error('Picture upload failed.');
    return result.url;
};

export const deleteUploadedImage = async (imageUrl) => {
    if (!imageUrl || typeof imageUrl !== 'string') return;
    const isServerPicture = imageUrl.includes('/uploads/') || imageUrl.includes('.blob.vercel-storage.com/');
    if (!isServerPicture) return;
    try {
        await apiRequest(`/api/upload?url=${encodeURIComponent(imageUrl)}`, { method: 'DELETE', auth: true });
    } catch (e) {
        console.warn('Could not delete picture', imageUrl, e);
    }
};

export const presetImages = [
    { label: "Winter Supplies Relief", url: winterSuppliesImg, filename: "winter-supplies.jpg" },
    { label: "Winter Mountain Convoy", url: winterConvoyImg, filename: "winter-convoy.jpg" },
    { label: "School Classroom", url: schoolCeremonyImg, filename: "school-ceremony.jpg" },
    { label: "School Backpacks & Books", url: schoolBagsImg, filename: "school-bags.jpg" },
    { label: "Medical Clinic Outreach", url: medicalClinicImg, filename: "medical-clinic.jpg" },
    { label: "Pharmacy & Medicine", url: medicalMedicineImg, filename: "medical-medicine.jpg" },
    { label: "Clean Solar Water Tap", url: waterWellImg, filename: "water-well.jpg" },
    { label: "Solar Pump Installation", url: waterPumpImg, filename: "water-pump.jpg" },
    { label: "Emergency Operations", url: img1, filename: "earthquake.jpg" },
    { label: "Community Development", url: img2, filename: "flood.jpg" }
];

/**
 * Fetch all news from the server. Falls back to the bundled news.json
 * only when the server cannot be reached (e.g. `vite preview`).
 */
export const fetchNews = async () => {
    const fresh = getAuthToken() ? '?fresh=1' : '';
    try {
        const articles = await apiRequest(`/api/news${fresh}`);
        if (Array.isArray(articles)) {
            return sortNewestFirst(articles).map(normalizeArticle);
        }
    } catch (e) {
        console.warn('News server unavailable, showing bundled news', e);
    }
    return sortNewestFirst(Array.isArray(newsInitialData) ? newsInitialData : []).map(normalizeArticle);
};

export const fetchNewsById = async (id) => {
    const fresh = getAuthToken() ? '?fresh=1' : '';
    try {
        const article = await apiRequest(`/api/news/${encodeURIComponent(id)}${fresh}`);
        if (article) return normalizeArticle(article);
    } catch (e) {
        if (!/not available|reach the server/i.test(e.message)) throw e;
    }
    const found = (Array.isArray(newsInitialData) ? newsInitialData : [])
        .find(item => String(item.id) === String(id));
    if (found) return normalizeArticle(found);
    throw new Error("News article not found");
};

export const createNews = async (newsItem) => {
    const newArticle = {
        title: newsItem.title || "Untitled News",
        date: newsItem.date || new Date().toISOString().split('T')[0],
        author: newsItem.author || "UMCA Team",
        readTime: newsItem.readTime || "3 min read",
        summary: newsItem.summary || "",
        image: newsItem.image || "winter-supplies.jpg",
        content: toContentArray(newsItem.content),
        quote: newsItem.quote || null,
        relatedImages: newsItem.relatedImages && newsItem.relatedImages.length > 0
            ? newsItem.relatedImages
            : [{ url: newsItem.image || "winter-supplies.jpg", title: newsItem.title || "News Photo" }]
    };
    const saved = await apiRequest('/api/news', { method: 'POST', auth: true, body: newArticle });
    return normalizeArticle(saved);
};

export const updateNews = async (id, updatedFields) => {
    const body = { ...updatedFields };
    if (body.content !== undefined) body.content = toContentArray(body.content);
    const saved = await apiRequest(`/api/news/${encodeURIComponent(id)}`, { method: 'PUT', auth: true, body });
    return normalizeArticle(saved);
};

export const deleteNews = async (id) => {
    await apiRequest(`/api/news/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true });
    return true;
};

/**
 * Admin export tool: downloads the current news list as news.json (backup).
 */
export const exportNewsData = async () => {
    let list;
    try {
        list = await apiRequest(`/api/news${getAuthToken() ? '?fresh=1' : ''}`);
    } catch (e) {
        list = newsInitialData;
    }
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(list, null, 4)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', 'news.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
};

export const API_URL: string =  
process.env.NODE_ENV === 'production'
    ? 'https://spark-bytes-project-team4-391.up.railway.app'
    : 'http://localhost:5005';

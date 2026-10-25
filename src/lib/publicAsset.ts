/** The project may run at / locally or under /science_atlas/ on GitHub Pages. */
export const publicAsset=(path:string)=>import.meta.env.BASE_URL+path.replace(/^\//,'');

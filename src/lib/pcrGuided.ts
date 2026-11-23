/** One ordered copy-count sweep across the full concept demonstration; never wrap at its end. */
export function pcrConceptTime(seconds:number){return 6*Math.min(.99999,Math.max(0,Math.min(100,seconds))/100)}

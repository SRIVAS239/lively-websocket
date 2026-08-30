import {MATCH_STATUS} from '../validation/matches.js'; 

export const fetchmatchStatus =async(st, et, now = new Date())=>{
    const start = new Date(st);
    const end = new Date(et);

    if(Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return null;
    }

    if(now< start){
        return MATCH_STATUS.SCHEDULED;
    }

    if(now>=end){
        return MATCH_STATUS.FINISHED;
    }

    return MATCH_STATUS.LIVE;
}

export async function syncMatchStatus(match, updateStatus){
    
}
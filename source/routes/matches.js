import {Router} from 'express';
import { createMatchSchema } from '../validation/matches.js';
import {db} from "../db/db.js";
import { matches } from '../db/schema.js';
import {string} from "zod";
import { fetchmatchStatus } from '../utils/match-status.js';

export const matchRouter = Router();

matchRouter.get('/', async (req, res) => {
    try {
        const allMatches = await db.select().from(matches);
        res.status(200).json({ data: allMatches, count: allMatches.length });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch matches', details: error.message });
    }
    //pagination AMX LIIMIT also or 50, and order by desc - newsest first
})

matchRouter.post('/', async (req, res) => {
    const parsed = createMatchSchema.safeParse(req.body);

    if(!parsed.success){
       return res.status(400).json({error: 'Validation failed', details: parsed.error.errors}) 
    }

    try{
        const { startTime, endTime, homeScore, awayScore, ...otherData } = parsed.data;
        
        const [event] = await db.insert(matches).values({
            ...otherData,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            homeScore: homeScore ?? 0,
            awayScore: awayScore ?? 0,
            status: await fetchmatchStatus(startTime, endTime)
        }).returning();
        
        return res.status(201).json({data: event});
    }
    catch(e){
       res.status(500).json({error: 'Failed to create match', details: e.message}) 
    }
}) 
   
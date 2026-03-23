import { ClimbHeight, ScoutingData } from "../../scouting/AppData";

export function getClimbValue(match: ScoutingData) {
    return ((match.auto_climb.attempted && !match.auto_climb.failed && 15) || 0) + 
        ((!match.endgame_climb_failed && (
            match.endgame_climb_type === ClimbHeight.NO_ATTEMPT ? 0 :
            match.endgame_climb_type === ClimbHeight.L1 ? 10 :
            match.endgame_climb_type === ClimbHeight.L2 ? 20 :
            30
        )) || 0);
}
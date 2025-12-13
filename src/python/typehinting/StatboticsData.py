from typing import TypedDict, Literal

class StatboticsTeamEventData(TypedDict):
    class _EPA(TypedDict):
        class _TotalPoints(TypedDict):
            mean: int
            sd: int

        class _Breakdown(TypedDict):
            total_points: int
            auto_points: int
            teleop_points: int
            endgame_points: int
            auto_rp: int
            coral_rp: int
            barge_rp: int
            tiebreaker_points: int
            auto_leave_points: int
            auto_coral: int
            auto_coral_points: int
            teleop_coral: int
            teleop_coral_points: int
            coral_l1: int
            coral_l2: int
            coral_l3: int
            coral_l4: int
            total_coral_points: int
            processor_algae: int
            processor_algae_points: int
            net_algae: int
            net_algae_points: int
            total_algae_points: int
            total_game_pieces: int
            barge_points: int
            rp_1: int
            rp_2: int
            rp_3: int

        class _Stats(TypedDict):
            start: int
            pre_elim: int
            mean: int
            max: int

        total_points: _TotalPoints
        unitless: int
        norm: int
        conf: list[int]
        breakdown: _Breakdown
        stats: _Stats

    class _Record(TypedDict):
        class _QualifierRecord(TypedDict):
            wins: int
            losses: int
            ties: int
            count: int
            winrate: int
            rps: int
            rps_per_match: int
            rank: int
            num_teams: int

        class _EliminationRecord(TypedDict):
            wins: int
            losses: int
            ties: int
            count: int
            winrate: int
            alliance: None
            is_captain: None

        class _TotalRecord(TypedDict):
            wins: int
            losses: int
            ties: int
            count: int
            winrate: int

        qual: _QualifierRecord
        elim: _EliminationRecord
        total: _TotalRecord

    team: int
    year: int
    event: str
    time: int
    team_name: str
    event_name: str
    country: str
    state: str
    district: str
    type: str
    week: int
    status: str
    first_event: bool
    epa: _EPA
    record: _Record
    district_points: int

class StatboticsTeamData(TypedDict):
    class _Record(TypedDict):
        wins: int
        losses: int
        ties: int
        count: int
        winrate: int

    class _NormalizedEPA(TypedDict):
        current: int
        recent: int
        mean: int
        max: int

    team: int
    name: str
    country: str
    state: str
    district: str
    rookie_year: int
    active: bool
    record: _Record
    norm_epa: _NormalizedEPA
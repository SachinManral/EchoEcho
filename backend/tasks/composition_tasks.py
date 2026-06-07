from crewai import Task, Agent

# ── Strict JSON instruction appended to every task ────────────────────────────
_JSON_RULE = (
    "\n\nCRITICAL: Your ENTIRE response must be a single valid JSON object. "
    "NO prose, NO explanation, NO markdown fences, NO extra text — ONLY the raw JSON object. "
    "Start your response with '{' and end with '}'."
)


def create_mood_task(agent: Agent, user_prompt: str) -> Task:
    return Task(
        description=(
            f"Analyze this music request and extract the musical mood.\n\n"
            f"User input: \"{user_prompt}\"\n\n"
            f"Return exactly this JSON structure:{_JSON_RULE}"
        ),
        expected_output=(
            '{"emotion":"melancholic","energy":"low","tempo_bpm_range":"70-85",'
            '"key_feel":"minor","genre_influences":["lo-fi","jazz"],'
            '"description":"A quiet, introspective piece..."}'
        ),
        agent=agent,
    )


def create_chord_task(agent: Agent, mood_context: str) -> Task:
    return Task(
        description=(
            "Using the mood analysis from context, compose a chord progression.\n\n"
            "Rules:\n"
            "- Use standard chord names: C, Cm, C7, Cmaj7, Cm7, Cdim, Caug, Csus4 etc.\n"
            "- Provide 4 to 8 chords in the progression array.\n"
            f"Return exactly this JSON structure:{_JSON_RULE}"
        ),
        expected_output=(
            '{"key":"C minor","mode":"Aeolian","progression":["Cm7","Fm7","Ab","Bb"],'
            '"explanation":"This i-iv-VI-VII progression creates melancholic tension..."}'
        ),
        agent=agent,
    )


def create_melody_task(agent: Agent, chord_context: str) -> Task:
    return Task(
        description=(
            "Using the chord progression from context, compose a melody.\n\n"
            "Rules:\n"
            "- 'pitch' must be a note name + octave number: C4, D#4, Bb3, F#5, etc.\n"
            "- 'duration' must be one of: whole, half, quarter, eighth, sixteenth.\n"
            "- Provide exactly 12 to 16 notes in the notes array.\n"
            "- Notes must be in a singable range (C3 to C6).\n"
            f"Return exactly this JSON structure:{_JSON_RULE}"
        ),
        expected_output=(
            '{"notes":[{"pitch":"E4","duration":"quarter"},{"pitch":"D4","duration":"eighth"},'
            '{"pitch":"C4","duration":"quarter"},{"pitch":"E4","duration":"eighth"},'
            '{"pitch":"G4","duration":"half"},{"pitch":"F4","duration":"quarter"},'
            '{"pitch":"E4","duration":"eighth"},{"pitch":"D4","duration":"quarter"},'
            '{"pitch":"C4","duration":"half"},{"pitch":"A3","duration":"quarter"},'
            '{"pitch":"B3","duration":"eighth"},{"pitch":"C4","duration":"whole"}],'
            '"contour":"arch","rhythmic_feel":"straight",'
            '"suggested_instrument":"piano","description":"A gentle descending melody..."}'
        ),
        agent=agent,
    )


def create_lyrics_task(agent: Agent, mood_and_melody_context: str) -> Task:
    return Task(
        description=(
            "Using the mood and melody from context, write song lyrics.\n\n"
            "Rules:\n"
            "- verse: 4 to 6 lines separated by \\n\n"
            "- chorus: 4 lines separated by \\n\n"
            "- Match the emotional tone from the mood analysis.\n"
            f"Return exactly this JSON structure:{_JSON_RULE}"
        ),
        expected_output=(
            '{"verse":"The clock ticks slow at midnight\\nYour ghost walks through my hall\\n'
            'I reach for you in darkness\\nBut only silence calls","chorus":"Stay with me just a little longer\\n'
            'Hold me through the cold\\nEvery night grows stronger\\nEvery story left untold",'
            '"theme_summary":"Missing someone in the quiet hours of the night"}'
        ),
        agent=agent,
    )


def create_sync_task(agent: Agent, all_elements_context: str) -> Task:
    return Task(
        description=(
            "Review all compositional elements from context and produce a unified summary.\n\n"
            "Verify the mood, chord progression, melody, and lyrics are coherent together.\n"
            f"Return exactly this JSON structure:{_JSON_RULE}"
        ),
        expected_output=(
            '{"mood_summary":"Melancholic lo-fi piece","chord_progression":"Cm7-Fm7-Ab-Bb",'
            '"melody_description":"Gentle arch-shaped melody on piano",'
            '"arrangement_structure":"Intro(4 bars) Verse Chorus Verse Chorus Outro",'
            '"coherence_notes":"All elements align well around themes of longing"}'
        ),
        agent=agent,
    )


def create_judge_task(agent: Agent, composition_context: str) -> Task:
    return Task(
        description=(
            "Critically evaluate the full composition from context.\n\n"
            "Score from 1 to 100. Be specific and fair.\n"
            f"Return exactly this JSON structure:{_JSON_RULE}"
        ),
        expected_output=(
            '{"score":82,"emotional_impact":"Strong melancholic atmosphere 85/100",'
            '"harmonic_quality":"Solid diatonic progression 78/100",'
            '"melodic_quality":"Memorable hook with clear contour 84/100",'
            '"lyrical_quality":"Evocative imagery 80/100","overall_cohesion":"Well integrated 83/100",'
            '"strengths":["Consistent mood","Singable melody","Evocative lyrics"],'
            '"improvements":["Add a bridge section","Vary the chord rhythm"],'
            '"final_verdict":"A cohesive melancholic composition with strong emotional core."}'
        ),
        agent=agent,
    )

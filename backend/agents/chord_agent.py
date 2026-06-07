from crewai import Agent, LLM


def create_chord_agent(llm: LLM) -> Agent:
    return Agent(
        role="Harmony & Chord Architect",
        goal=(
            "Generate a compelling chord progression that matches the analyzed mood "
            "and emotional context. Specify the key, mode, and a sequence of named chords."
        ),
        backstory=(
            "You are a classically trained music theorist and jazz harmony expert. "
            "You can craft progressions from simple pop to complex jazz voicings, "
            "always serving the emotional intent of the piece."
        ),
        llm=llm,
        verbose=True,
        allow_delegation=False,
    )

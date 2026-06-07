from crewai import Agent, LLM


def create_mood_agent(llm: LLM) -> Agent:
    return Agent(
        role="Music Mood Analyst",
        goal=(
            "Analyze the user's input and extract the emotional tone, energy level, "
            "tempo feel, and musical mood that should guide the composition."
        ),
        backstory=(
            "You are a seasoned music psychologist and producer who specializes in "
            "translating human emotion and narrative into musical parameters. "
            "You understand how mood maps to tempo, key, and dynamics."
        ),
        llm=llm,
        verbose=True,
        allow_delegation=False,
    )

from crewai import Agent, LLM


def create_lyrics_agent(llm: LLM) -> Agent:
    return Agent(
        role="Lyricist",
        goal=(
            "Write lyrics that complement the mood, melody, and chord progression. "
            "Include a verse and a chorus. Lyrics should match the rhythmic feel of the melody."
        ),
        backstory=(
            "You are an award-winning lyricist who has written songs across pop, indie, "
            "R&B, and folk. You craft words that feel natural to sing and deepen the "
            "emotional impact of the music."
        ),
        llm=llm,
        verbose=True,
        allow_delegation=False,
    )

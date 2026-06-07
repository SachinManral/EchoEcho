from crewai import Agent, LLM


def create_sync_agent(llm: LLM) -> Agent:
    return Agent(
        role="Music Synchronization Specialist",
        goal=(
            "Review and harmonize all musical elements — mood, chords, melody, and lyrics — "
            "ensuring they are coherent and work together as a unified composition. "
            "Produce a structured final composition summary."
        ),
        backstory=(
            "You are a music director and arranger who has worked in recording studios "
            "and on film scores. You specialize in ensuring that every element of a "
            "composition supports the central vision and emotional arc."
        ),
        llm=llm,
        verbose=True,
        allow_delegation=False,
    )

## Conway’s Game of Life

Conway’s Game of Life is a famous simulation that demonstrates a **cellular automaton**. It is modeled as a grid with four simple rules:

1. Any live cell with fewer than two live neighbors dies, as if caused by underpopulation.
2. Any live cell with two or three live neighbors lives on to the next generation.
3. Any live cell with more than three live neighbors dies, as if caused by overcrowding.
4. Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.

## Requirements

Create a multiplayer web application version of Game of Life with the following functionality.

At a minimum, the application must support the latest desktop version of Google Chrome. You may be penalized if the game does not work in other modern browsers—for example, grading may occur in Chrome, while clients might use Firefox or Safari.

1. **Browser frontend**  
   Implement the Game of Life frontend in the browser. You may use any representation, such as:

   - `<canvas>`
   - `<table>`
   - Direct DOM manipulation
   - Individual cell elements

   The game should tick automatically at a predefined interval, for example one step per second.

2. **Shared, synchronized world**  
   The browser must connect to a server that allows multiple browsers to share the same synchronized world view.

   Unless otherwise specified, the server may be written in Python, Node.js, or any other technology that can run on Linux.

3. **Client-specific colors and cell placement**  
   Each client is assigned a random color during initialization.

   When a user clicks a grid cell in the browser, the client creates a live cell at that location using the client’s assigned color. This change must be synchronized across all connected clients.

   You may use any synchronization mechanism, such as:

   - Polling
   - Server-Sent Events (SSE)
   - WebSocket

4. **Color inheritance on reproduction**  
   When a dead cell revives under rule 4—“Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction”—the revived cell receives the average color of the neighbors that caused it to revive.

5. **Predefined patterns**  
   Include a toolbar that lets players place predefined patterns at random locations using the player’s assigned color.

   Patterns may include examples from [Conway’s Game of Life patterns](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life#Examples_of_patterns). You do not need to implement all patterns; three to four patterns are sufficient.

## Project Submission

Use Git to track progress while working on the project, then share the repository when the project is complete.

## Skills Evaluated

1. Algorithmic programming
2. API and service design
3. Testing, CI/CD, and site reliability
4. UX design and prototyping
5. Web frontend development
6. Communication

## README Requirements

Write the README as though it documents a production service and is the only documentation available to other developers.

Include:

- A description of the problem and solution
- Instructions for testing, building, deploying, and using the solution
- Reasoning behind technical and architectural choices
- Trade-offs made, omitted work, and what you would change with additional time
- Links to other projects or code you are particularly proud of

The easier your code is to understand, the better the grade is likely to be.

## Evaluation Criteria

Pay particular attention to:

1. **Correctness and robustness**  
   For example:
   - Does the application behave correctly if a client connection is unstable for several seconds?
   - Can the application be built and deployed easily?

2. **Performance and scalability**  
   Consider both client-side and server-side behavior.

3. **Code style and technology choices**  
   Prefer concise, well-structured code and appropriate use of current technologies.

4. **UI aesthetics**

5. **Communication and documentation**

6. **Deployment**  
   Preferably include a `Dockerfile` for ease of deployment.

7. **Time constraint**  
   Spend no more than a few hours. If time runs out, document:
   - Missing features
   - Why they are missing
   - How you would implement them with more time

8. **Follow-up presentation**  
   Be prepared to walk through the solution and defend any part of it during a follow-up presentation.

## AI Usage

Using AI will not count against you, but you must document its use, just as you would document use of any other tools.

Include in the README:

- Which tools, harnesses, models, or skills you used
- Your overall workflow:
  - What you wrote
  - What you decided
  - What you delegated
- The key prompts you entered
- Ideally, a session transcript

The evaluation will consider how well you direct AI tools and judge their output.

## FAQ

### Does a reconnecting client keep the same color?

The specification does not define this behavior. Use your best judgment.

During evaluation, engineering choices and trade-offs will also be considered.

### What does “average of colors” mean?

A mathematical average is sufficient, although you may use another definition of color averaging. Document the chosen approach.

### How large should the playground be?

You may configure width and height, use the full browser viewport, or make the board resizable.

Previous submissions have ranged from a `10 × 10` board to millions of cells. Use your best judgment.

> Many employers value readability and maintainability over fancy features. Choosing algorithms that are demonstrably scalable is also a significant advantage.

### What scale is expected?

The expected scale should be reasonably achievable within a few hours. An MMO-scale implementation is not expected.

You may decide whether to limit the client count.

### What should the initial board state be?

A blank world is acceptable.

### What happens when a placed pattern overlaps a live cell?

Overwriting the existing cell’s color with the pattern’s color is acceptable.

Document this and any other assumptions not specified by the requirements.

### What if parts of the specification are incomplete?

In real-world work, specifications are rarely completely defined. Use communication skills to either:

- Make reasonable assumptions, or
- Clarify requirements with the relevant stakeholders.

### What is the most important point of the game/product?

The purpose is to showcase your skills and abilities while also having some fun.


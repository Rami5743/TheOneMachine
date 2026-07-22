# solution-layouts

One file per solution walkthrough, in the card-editor bundle format
(loadable via My Cards -> load card from file).

## Editing
1. In the game: My Cards -> load a card from file -> pick e.g. Inc.json
2. Edit the card in the editor (drag the components).
3. Save to file and send it back (or push to the branch); I bake the
   positions into the solution.

## Structure
- cards[0].logic.components - the solution components (without the task
  frame and without the external test source). Edit x,y to move them.
  card-frame-1 is the card frame (it replaces the task frame).
- cards[0].logic.wires - wiring; the frame pins are card-frame-1.inputInt0
  / outputInt0 (zero-based).
- inputs/outputs - the bus width of each frame pin (e.g. 16 = a 16-bit bus).

Tasks: halfAdder, fullAdder, Add4, Add16, Inc, ALU0, PreperNum, Dmux4way, Mux4way16, Not4, Not16, AND4, OR4, AND16, MUX4, MUX16, Mux, DMux, Not, And, Or, Xor, AND3way, OR4way

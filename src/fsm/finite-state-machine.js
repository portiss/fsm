export default class FSM {
  constructor(initialState, handleTransition) {
    this.state = initialState;
    this.transitions = {};
    this.handleTransition = handleTransition;
  }

  addTransition(fromState, event, toState) {
    if (!this.transitions[fromState]) {
      this.transitions[fromState] = {};
    }
    this.transitions[fromState][event] = toState;
  }

  transition(event) {
    const nextState = this.transitions[this.state][event];
    if (nextState) {
      this.handleTransition(nextState);
      console.log(`Transitioning from ${this.state} to ${nextState}`);
      this.state = nextState;
    } else {
      console.log(`Invalid event ${event} for current state ${this.state}`);
    }
  }
}
